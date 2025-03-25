from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='agri_home'),
    path('api/', views.api_home, name='agri_api'),
    path('docs/', views.docs, name='agri_docs'),
]
