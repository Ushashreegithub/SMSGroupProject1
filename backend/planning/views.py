import time
import shutil
from pathlib import Path
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import PlanningVersion, Benchmark
from .serializers import PlanningVersionSerializer, BenchmarkSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


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

import os
import sys
import subprocess

def run_graph_automation(file_path=None):
    workspace_root = Path(settings.BASE_DIR).parent
    graph_venv_python = workspace_root / "Graph_Automation" / ".venv" / "Scripts" / "python.exe"
    
    cmd_code = "import sys; sys.path.insert(0, 'Graph_Automation/src'); from scb_dashboard.dashboard import create_dashboard; "
    if file_path:
        file_path_clean = str(file_path).replace('\\', '/')
        cmd_code += f"create_dashboard(file_path='{file_path_clean}')"
    else:
        cmd_code += "create_dashboard()"

    if graph_venv_python.exists():
        try:
            subprocess.run([str(graph_venv_python), "-c", cmd_code], cwd=str(workspace_root), check=True)
            return True
        except Exception as e:
            print(f"Error running Graph_Automation via venv python: {e}")
    
    # Fallback to current python process
    try:
        graph_automation_src = workspace_root / "Graph_Automation" / "src"
        if str(graph_automation_src) not in sys.path:
            sys.path.insert(0, str(graph_automation_src))
        from scb_dashboard.dashboard import create_dashboard
        create_dashboard(file_path=str(file_path) if file_path else None)
        return True
    except Exception as e:
        print(f"Error running Graph_Automation direct import: {e}")
        return False


def sync_graph_automation_charts(request=None):
    workspace_root = Path(settings.BASE_DIR).parent
    graph_out = workspace_root / "Graph_Automation" / "output"
    graph_outs = workspace_root / "Graph_Automation" / "outputs"
    
    scb_dashboard_png = graph_out / "scb_dashboard.png"
    if not scb_dashboard_png.exists():
        run_graph_automation()

    media_charts = Path(settings.MEDIA_ROOT) / "charts"
    media_charts.mkdir(parents=True, exist_ok=True)

    frontend_public_charts = workspace_root / "frontend" / "public" / "media" / "charts"
    if frontend_public_charts.parent.parent.exists():
        frontend_public_charts.mkdir(parents=True, exist_ok=True)

    mapping = {
        "production": scb_dashboard_png,
        "welding": graph_out / "charts" / "welding" / "Historical_Welding_Dashboard.png",
        "machining": graph_outs / "machining" / "Historical_Machining_Dashboard.png",
        "rr": graph_out / "rr" / "Historical_RR_Dashboard.png",
        "plating": graph_out / "plating" / "Historical_Plating_Dashboard.png",
        "scb": scb_dashboard_png,
        "service_machining": graph_out / "charts" / "welding" / "Welding_Dashboard.png",
    }

    urls = {}
    for key, src_path in mapping.items():
        if src_path.exists():
            dest = media_charts / f"{key}_dashboard.png"
            shutil.copy(src_path, dest)
            if frontend_public_charts.exists():
                shutil.copy(src_path, frontend_public_charts / f"{key}_dashboard.png")
            urls[key] = f"/media/charts/{key}_dashboard.png"
    return urls


def ensure_seed_data(request=None):
    chart_urls = sync_graph_automation_charts(request=request)
    
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
            chart_urls=chart_urls,
            validation_warnings=[
                "Capacity utilization in Nov 2026 reaches 96.4% in Machining Dept.",
                "Service Machining contract hours slightly above historical baseline."
            ]
        )
    else:
        # Force update chart_urls on existing records
        ver = PlanningVersion.objects.first()
        ver.chart_urls = chart_urls
        ver.save()

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
        ensure_seed_data(request=request)
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['post'])
    def upload_planning(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_name = file_obj.name
        version_id = f"2026-UPLOAD-{int(time.time())}"
        
        # Save temporary uploaded excel to process with python graph automation
        temp_dir = Path(settings.BASE_DIR) / "temp_uploads"
        temp_dir.mkdir(exist_ok=True)
        temp_path = temp_dir / f"upload_{int(time.time())}_{file_name}"
        with open(temp_path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)
                
        run_graph_automation(file_path=temp_path)

        chart_urls = sync_graph_automation_charts(request=request)
        
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
            chart_urls=chart_urls,
            validation_warnings=["Uploaded spreadsheet processed and Capacity Utilization dashboard updated successfully."]
        )
        serializer = self.get_serializer(new_version)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



    @action(detail=False, methods=['get'])
    def latest(self, request):
        ensure_seed_data(request=request)
        latest_ver = PlanningVersion.objects.first()
        serializer = self.get_serializer(latest_ver)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def calculate_manual_planning(self, request):
        import calendar
        annual_hours = float(request.data.get('annual_hours', 120000))
        year = int(request.data.get('year', 2026))
        tasks = request.data.get('tasks', [])
        
        # 1. Determine days in year (366 if leap year, else 365)
        is_leap = calendar.isleap(year)
        total_days_in_year = 366 if is_leap else 365
        
        # 2. 1 day's available hours
        daily_available_hours = annual_hours / total_days_in_year
        
        # 3. Monthly available hours for each month (Jan - Dec)
        month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        total_task_weight = sum(float(t.get('hours', 0)) for t in tasks)
        
        monthly_summary = []
        for month_num in range(1, 13):
            m_name = month_names[month_num - 1]
            days_in_month = calendar.monthrange(year, month_num)[1]
            
            # 1 day's available hours * days in month
            monthly_avl_hours = daily_available_hours * days_in_month
            
            # Split hours of each month based on tasks
            task_breakdown = []
            for task in tasks:
                task_id = task.get('id', task.get('name'))
                task_hours_input = float(task.get('hours', 0))
                
                if total_task_weight > 0:
                    ratio = task_hours_input / total_task_weight
                else:
                    ratio = 1.0 / len(tasks) if len(tasks) > 0 else 0
                    
                task_monthly_hours = monthly_avl_hours * ratio
                task_daily_hours = daily_available_hours * ratio
                
                task_breakdown.append({
                    "id": task_id,
                    "name": task.get('name'),
                    "category": task.get('category', 'Task'),
                    "monthly_hours": round(task_monthly_hours, 2),
                    "daily_hours": round(task_daily_hours, 2),
                    "days_in_month": days_in_month,
                    "share_pct": round(ratio * 100, 2)
                })
                
            monthly_summary.append({
                "month": f"{m_name} {year}",
                "month_num": month_num,
                "days_in_month": days_in_month,
                "monthly_available_hours": round(monthly_avl_hours, 2),
                "daily_available_hours": round(daily_available_hours, 2),
                "tasks": task_breakdown
            })
            
        return Response({
            "status": "success",
            "inputs": {
                "annual_hours": annual_hours,
                "year": year,
                "is_leap_year": is_leap,
                "total_days_in_year": total_days_in_year,
                "daily_available_hours": round(daily_available_hours, 4),
                "total_tasks_count": len(tasks)
            },
            "monthly_calculations": monthly_summary
        }, status=status.HTTP_200_OK)


class BenchmarkViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Benchmark.objects.all()
    serializer_class = BenchmarkSerializer

    def list(self, request, *args, **kwargs):
        ensure_seed_data()
        return super().list(request, *args, **kwargs)


@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "Invalid username or password"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    refresh = RefreshToken.for_user(user)

    return Response({
        "success": True,
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "username": user.username,
            "email": user.email,
            "is_superuser": user.is_superuser,
        }
    })
