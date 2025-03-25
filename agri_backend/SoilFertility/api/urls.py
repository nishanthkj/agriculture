from django.urls import path
from .views import SoilFertilityPredictAPI

urlpatterns = [
    path('soil/', SoilFertilityPredictAPI.as_view(), name='predict_soil_fertility'),
]
