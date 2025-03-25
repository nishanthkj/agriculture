from django.urls import path
from .views import CropFertilizerPredictAPI

urlpatterns = [
    path('croprf/', CropFertilizerPredictAPI.as_view(), name='predict_crop_fertilizer'),
]
