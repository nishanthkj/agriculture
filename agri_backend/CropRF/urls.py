from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='crop_fertilizer_index'),
]
# Compare this snippet from CropRF/views.py:    