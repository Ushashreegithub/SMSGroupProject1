from rest_framework import serializers
from .models import PlanningVersion, Benchmark

class PlanningVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanningVersion
        fields = '__all__'

class BenchmarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Benchmark
        fields = '__all__'
