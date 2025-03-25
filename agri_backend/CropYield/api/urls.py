from django.urls import path
from . import views

urlpatterns = [
    path('cropyield', views.CropYieldAPIView.as_view(), name="cropyield_api"),
]
