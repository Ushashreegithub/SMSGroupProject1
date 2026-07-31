from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PlanningVersionViewSet, BenchmarkViewSet

router = DefaultRouter()
router.register(r'versions', PlanningVersionViewSet, basename='planning-version')
router.register(r'benchmarks', BenchmarkViewSet, basename='benchmark')

urlpatterns = [
    path('', include(router.urls)),
]
