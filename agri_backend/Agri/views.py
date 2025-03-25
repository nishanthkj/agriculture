from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import MessageSerializer

# HTML Home Page View
def home(request):
    return render(request, 'Agri/index.html')

# JSON API View
@api_view(['GET'])
def api_home(request):
    data = {'message': 'Welcome to Agri API 🌾'}
    serializer = MessageSerializer(data=data)
    if serializer.is_valid():
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

def docs(request):
    return render(request, 'Agri/docs.html')