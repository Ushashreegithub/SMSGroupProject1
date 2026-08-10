from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .services import ProjectPlanningEngine
from .models import Project, ProjectTask, ProjectTaskMonthlyDistribution

class WeldingCalculationTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_welding_3_months_5000_hours(self):
        """
        User's exact requirement:
        5000 hours, 3 months (Aug, Sep, Oct)
        Aug (Month 1) = 750 hrs (15%)
        Sep (Month 2) = 2125 hrs (42.5%)
        Oct (Month 3) = 2125 hrs (42.5%)
        Total = 5000 hrs
        """
        result = ProjectPlanningEngine.calculate_welding_monthly_distribution(
            allocated_hours=5000,
            duration_months=3,
            start_date_str="2026-08-01"
        )

        self.assertEqual(len(result), 3)
        
        # Month 1 (Aug 2026)
        self.assertEqual(result[0]['month_label'], "Aug 2026")
        self.assertEqual(result[0]['hours'], 750.0)
        self.assertEqual(result[0]['percentage'], 15.0)

        # Month 2 (Sep 2026)
        self.assertEqual(result[1]['month_label'], "Sep 2026")
        self.assertEqual(result[1]['hours'], 2125.0)
        self.assertEqual(result[1]['percentage'], 42.5)

        # Month 3 (Oct 2026)
        self.assertEqual(result[2]['month_label'], "Oct 2026")
        self.assertEqual(result[2]['hours'], 2125.0)
        self.assertEqual(result[2]['percentage'], 42.5)

        # Total sum verification
        total_hours = sum(r['hours'] for r in result)
        self.assertEqual(total_hours, 5000.0)

    def test_welding_6_months_12000_hours(self):
        result = ProjectPlanningEngine.calculate_welding_monthly_distribution(
            allocated_hours=12000,
            duration_months=6,
            start_date_str="2026-08-01"
        )
        self.assertEqual(len(result), 6)
        self.assertEqual(result[0]['hours'], 1800.0) # 15% of 12000
        remaining_each = (12000 - 1800) / 5 # 10200 / 5 = 2040.0
        for i in range(1, 6):
            self.assertEqual(result[i]['hours'], remaining_each)
        self.assertEqual(sum(r['hours'] for r in result), 12000.0)

    def test_welding_1_month_edge_case(self):
        result = ProjectPlanningEngine.calculate_welding_monthly_distribution(
            allocated_hours=3000,
            duration_months=1,
            start_date_str="2026-08-01"
        )
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]['hours'], 3000.0)
        self.assertEqual(result[0]['percentage'], 100.0)

    def test_preview_welding_calculation_api(self):
        response = self.client.post(
            '/api/v1/projects/preview_welding_calculation/',
            {
                "allocated_hours": 5000,
                "duration_months": 3,
                "start_date": "2026-08-01"
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertEqual(data['status'], 'success')
        self.assertEqual(len(data['monthly_breakdown']), 3)
        self.assertEqual(data['monthly_breakdown'][0]['hours'], 750.0)

    def test_create_project_with_welding_task_api(self):
        payload = {
            "projectName": "Turbine Manufacturing Unit 4",
            "projectNumber": "PRJ-2026-009",
            "equipmentName": "High Pressure Rotor",
            "equipmentWeight": "25000",
            "description": "Heavy industrial turbine rotor fabrication",
            "startDate": "2026-08-01",
            "endDate": "2027-02-01",
            "projectManager": "R. Sharma",
            "plannedHours": 20000,
            "tasks": [
                {
                    "task_name": "Welding",
                    "task_code": "welding",
                    "allocated_hours": 5000,
                    "duration_months": 3,
                    "location": "Khordha",
                    "smi": "Internal",
                    "labour_supply": "Regular",
                    "job_contractor": "SMS Subcontracting"
                }
            ]
        }

        response = self.client.post('/api/v1/projects/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Check DB records
        project = Project.objects.get(project_number="PRJ-2026-009")
        self.assertEqual(project.total_planned_hours, 20000.0)

        task = project.tasks.first()
        self.assertEqual(task.task_name, "Welding")
        self.assertEqual(task.allocated_hours, 5000.0)

        distributions = list(task.monthly_distributions.all())
        self.assertEqual(len(distributions), 3)
        self.assertEqual(distributions[0].hours, 750.0)
        self.assertEqual(distributions[1].hours, 2125.0)
        self.assertEqual(distributions[2].hours, 2125.0)

    def test_adjustment_logic_month_1_unutilized(self):
        """
        5000 hours, 3 months (Aug, Sep, Oct).
        Month 1 actual utilization = 500 hrs (instead of 750).
        Unutilized 250 hrs added to Sep & Oct -> 2250 hrs each.
        """
        result = ProjectPlanningEngine.calculate_welding_monthly_distribution(
            allocated_hours=5000,
            duration_months=3,
            start_date_str="2026-08-01",
            adjustment_month_index=1,
            actual_utilized_hours=500
        )
        self.assertEqual(result[0]['hours'], 500.0)
        self.assertTrue(result[0]['is_adjusted'])
        self.assertEqual(result[1]['hours'], 2250.0)
        self.assertEqual(result[2]['hours'], 2250.0)
        self.assertEqual(sum(r['hours'] for r in result), 5000.0)

    def test_buffer_logic_month_2_extra_hours(self):
        """
        5000 hours, 3 months (Aug, Sep, Oct).
        Month 2 introduces 500 extra buffer hours.
        Sep becomes 2125 + 500 = 2625 hrs.
        Total = 5500 hrs.
        """
        result = ProjectPlanningEngine.calculate_welding_monthly_distribution(
            allocated_hours=5000,
            duration_months=3,
            start_date_str="2026-08-01",
            buffer_month_index=2,
            buffer_hours=500
        )
        self.assertEqual(result[0]['hours'], 750.0)
        self.assertEqual(result[1]['hours'], 2625.0)
        self.assertTrue(result[1]['is_buffer_added'])
        self.assertEqual(result[2]['hours'], 2125.0)
        self.assertEqual(sum(r['hours'] for r in result), 5500.0)

    def test_combined_adjustment_and_buffer(self):
        """
        5000 hours, 3 months.
        Month 1 adjusted to 500 hrs.
        Month 2 buffer added 500 hrs.
        Aug = 500, Sep = 2250 + 500 = 2750, Oct = 2250.
        Total = 5500 hrs.
        """
        result = ProjectPlanningEngine.calculate_welding_monthly_distribution(
            allocated_hours=5000,
            duration_months=3,
            start_date_str="2026-08-01",
            adjustment_month_index=1,
            actual_utilized_hours=500,
            buffer_month_index=2,
            buffer_hours=500
        )
        self.assertEqual(result[0]['hours'], 500.0)
        self.assertEqual(result[1]['hours'], 2750.0)
        self.assertEqual(result[2]['hours'], 2250.0)
        self.assertEqual(sum(r['hours'] for r in result), 5500.0)

