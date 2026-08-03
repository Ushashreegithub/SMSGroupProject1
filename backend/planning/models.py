from django.db import models

class PlanningVersion(models.Model):
    version_id = models.CharField(max_length=64, unique=True)
    month_name = models.CharField(max_length=64)
    horizon = models.CharField(max_length=128)
    upload_date = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.CharField(max_length=128, default="J. Smith (Sr. Production Planner)")
    status = models.CharField(max_length=32, default="Validated")
    file_name = models.CharField(max_length=256)
    file_size = models.CharField(max_length=64, default="4.8 MB")
    processing_time_ms = models.IntegerField(default=1420)
    
    # Store complete structured JSON payload for dynamic frontend consumption
    months = models.JSONField(default=list)
    departments = models.JSONField(default=dict)
    chart_urls = models.JSONField(default=dict)
    validation_warnings = models.JSONField(default=list)

    class Meta:
        ordering = ['-upload_date']

    def __str__(self):
        return f"{self.version_id} ({self.month_name})"


class Benchmark(models.Model):
    department = models.CharField(max_length=64, unique=True)
    name = models.CharField(max_length=128)
    target_utilization = models.FloatField(default=85.0)
    max_threshold = models.FloatField(default=95.0)
    historical_baseline = models.FloatField(default=78.5)
    description = models.TextField(blank=True, default="")

    def __str__(self):
        return self.name
