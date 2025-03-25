from django.urls import path
from .views import predict_soil_view

urlpatterns = [
    path('', predict_soil_view, name='soil_predict_form'),
]
