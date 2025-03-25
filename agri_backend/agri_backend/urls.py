"""
URL configuration for agri_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('', include('Agri.urls')),  # This line makes Agri the homepage
    path('api/', include('Agri.api.urls')),
    path('cropyield/', include('CropYield.urls')),
    path('api/', include('CropYield.api.urls')),
    path('croprf/', include('CropRF.urls')),
    path('api/', include('CropRF.api.urls')), 
    path('api/', include('SoilFertility.api.urls')),
    path('soil/', include('SoilFertility.urls')),
]
