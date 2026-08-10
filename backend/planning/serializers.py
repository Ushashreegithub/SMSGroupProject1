from rest_framework import serializers
from rest_framework import serializers

from .models import (
    CapacityAdjustment,
    PlanningVersion,
    Benchmark,
    Project,
    ProjectTask,
    ProjectTaskMonthlyDistribution,
)
from .services import ProjectPlanningEngine

class PlanningVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanningVersion
        fields = '__all__'

class CapacityAdjustmentSerializer(serializers.ModelSerializer):

    class Meta:
     model = CapacityAdjustment
    fields = [
            'id',
            'department',
            'year',
            'month',
            'buffer_hours',
            'adjustment_hours',
            'created_at',
            'updated_at',
        ]      

class BenchmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Benchmark
        fields = '__all__'

class ProjectTaskMonthlyDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTaskMonthlyDistribution
        fields = ['id', 'month_index', 'month_label', 'date', 'hours', 'percentage']

class ProjectTaskSerializer(serializers.ModelSerializer):
    monthly_distributions = ProjectTaskMonthlyDistributionSerializer(many=True, read_only=True)

    class Meta:
        model = ProjectTask
        fields = ['id', 'task_name', 'task_code', 'allocated_hours', 'duration_months', 'start_date', 'location', 'smi', 'labour_supply', 'job_contractor', 'monthly_distributions']

class ProjectSerializer(serializers.ModelSerializer):
    tasks = ProjectTaskSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ['id', 'costumer_name', 'WBS_No.', 'equipment_name', 'equipment_weight', 'description', 'zero_date', 'cdd', 'project_manager', 'total_planned_hours', 'priority', 'status', 'tasks', 'created_at', 'updated_at']

class WeldingCalculationPreviewSerializer(serializers.Serializer):
    allocated_hours = serializers.FloatField(required=True, min_value=0.1)
    duration_months = serializers.IntegerField(required=True, min_value=1)
    start_date = serializers.CharField(required=False, allow_blank=True, default="2026-08-01")
