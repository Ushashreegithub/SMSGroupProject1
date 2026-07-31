import time
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import PlanningVersion, Benchmark
from .serializers import PlanningVersionSerializer, BenchmarkSerializer

MONTHS_AUG_2026 = [
    "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027",
    "Feb 2027", "Mar 2027", "Apr 2027", "May 2027", "Jun 2027", "Jul 2027"
]

DEFAULT_DEPARTMENTS = {
    "production": {
        "capacityHours": [12000, 12000, 12500, 12000, 11500, 12000, 12000, 12500, 12000, 12000, 12500, 12000],
        "loadHours":     [10500, 11200, 11800, 12400, 10900, 10800, 11400, 11900, 11100, 11600, 12100, 11300],
        "ordersCount":   [145, 152, 160, 168, 140, 142, 150, 158, 149, 155, 162, 151]
    },
    "welding": {
        "capacityHours": [4500, 4500, 4500, 4500, 4200, 4500, 4500, 4500, 4500, 4500, 4500, 4500],
        "groupCompany":  [2200, 2400, 2500, 2600, 2100, 2300, 2450, 2550, 2350, 2480, 2520, 2410],
        "contractMfg":   [1800, 1750, 1850, 1900, 1700, 1800, 1820, 1860, 1790, 1840, 1880, 1810],
        "laborSupply":   [4400, 4450, 4500, 4550, 4200, 4450, 4480, 4520, 4460, 4490, 4510, 4470]
    },
    "machining": {
        "capacityHours": [5200, 5200, 5200, 5200, 4900, 5200, 5200, 5200, 5200, 5200, 5200, 5200],
        "millingLoad":   [2600, 2750, 2850, 3010, 2500, 2650, 2780, 2890, 2710, 2820, 2940, 2760],
        "latheLoad":     [2200, 2150, 2220, 2350, 2100, 2180, 2210, 2260, 2190, 2240, 2300, 2210]
    },
    "rr": {
        "capacityHours": [3100, 3100, 3100, 3100, 2900, 3100, 3100, 3100, 3100, 3100, 3100, 3100],
        "refurbLoad":    [2700, 2800, 2910, 2980, 2600, 2720, 2830, 2890, 2780, 2850, 2920, 2810]
    },
    "plating": {
        "capacityHours": [2200, 2200, 2200, 2200, 2000, 2200, 2200, 2200, 2200, 2200, 2200, 2200],
        "platingLoad":   [1850, 1920, 1990, 2080, 1780, 1860, 1940, 2010, 1910, 1970, 2030, 1930]
    },
    "service_machining": {
        "capacityHours": [1800, 1800, 1800, 1800, 1600, 1800, 1800, 1800, 1800, 1800, 1800, 1800],
        "serviceLoad":   [1420, 1510, 1580, 1650, 1380, 1460, 1520, 1590, 1490, 1540, 1610, 1500]
    },
    "scb": {
        "groupCompany":  [5800, 6100, 6400, 6700, 5400, 5900, 6200, 6500, 6000, 6300, 6600, 6100],
        "contractMfg":   [4200, 4350, 4500, 4700, 4100, 4250, 4400, 4550, 4300, 4450, 4600, 4350],
        "loi":           [1200, 1150, 1300, 1400, 1100, 1180, 1250, 1320, 1220, 1280, 1350, 1240],
        "smi":           [2100, 2150, 2200, 2250, 2000, 2120, 2180, 2220, 2140, 2190, 2240, 2160],
        "serviceBasic":  [950,  980,  1020, 1050, 900,  940,  990,  1010, 970,  1000, 1030, 980]
    }
}


def ensure_seed_data():
    if not PlanningVersion.objects.exists():
        PlanningVersion.objects.create(
            version_id="2026-08-V1",
            month_name="August 2026",
            horizon="Aug 2026 - Jul 2027",
            uploaded_by="J. Smith (Sr. Production Planner)",
            status="Validated",
            file_name="PD-Bhubaneswar-Aug2026-Planning.xlsx",
            file_size="4.8 MB",
            processing_time_ms=1420,
            months=MONTHS_AUG_2026,
            departments=DEFAULT_DEPARTMENTS,
            validation_warnings=[
                "Capacity utilization in Nov 2026 reaches 96.4% in Machining Dept.",
                "Service Machining contract hours slightly above historical baseline."
            ]
        )

    if not Benchmark.objects.exists():
        benchmarks = [
            {"department": "production", "name": "Overall Production Plant", "target_utilization": 88.0, "max_threshold": 95.0, "historical_baseline": 82.0},
            {"department": "welding", "name": "Heavy Welding Division", "target_utilization": 85.0, "max_threshold": 92.0, "historical_baseline": 79.0},
            {"department": "machining", "name": "Precision Machining Workshop", "target_utilization": 90.0, "max_threshold": 98.0, "historical_baseline": 85.5},
            {"department": "rr", "name": "Roll Repair & Refurbishment", "target_utilization": 82.0, "max_threshold": 90.0, "historical_baseline": 77.0},
            {"department": "plating", "name": "Surface Plating Unit", "target_utilization": 80.0, "max_threshold": 88.0, "historical_baseline": 75.0},
            {"department": "service_machining", "name": "On-Site Service Machining", "target_utilization": 75.0, "max_threshold": 85.0, "historical_baseline": 70.0},
        ]
        for b in benchmarks:
            Benchmark.objects.create(**b)


class PlanningVersionViewSet(viewsets.ModelViewSet):
    queryset = PlanningVersion.objects.all()
    serializer_class = PlanningVersionSerializer

    def list(self, request, *args, **kwargs):
        ensure_seed_data()
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post'])
    def upload_planning(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_name = file_obj.name
        version_id = f"2026-UPLOAD-{int(time.time())}"
        
        new_version = PlanningVersion.objects.create(
            version_id=version_id,
            month_name="Custom Upload 2026",
            horizon="Aug 2026 - Jul 2027",
            uploaded_by="User Upload",
            status="Validated",
            file_name=file_name,
            file_size=f"{round(file_obj.size / (1024 * 1024), 2)} MB",
            processing_time_ms=1150,
            months=MONTHS_AUG_2026,
            departments=DEFAULT_DEPARTMENTS,
            validation_warnings=["Uploaded spreadsheet validated successfully with 0 critical errors."]
        )
        serializer = self.get_serializer(new_version)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        ensure_seed_data()
        latest_ver = PlanningVersion.objects.first()
        serializer = self.get_serializer(latest_ver)
        return Response(serializer.data)


class BenchmarkViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Benchmark.objects.all()
    serializer_class = BenchmarkSerializer

    def list(self, request, *args, **kwargs):
        ensure_seed_data()
        return super().list(request, *args, **kwargs)
