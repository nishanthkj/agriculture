import requests
from django.conf import settings
from django.shortcuts import render

FIELDS = ["N", "P", "K", "pH", "EC", "OC", "S", "Zn", "Fe", "Cu", "Mn", "B"]

def predict_soil_view(request):
    result = None
    if request.method == "POST":
        form_data = {field: float(request.POST.get(field)) for field in FIELDS}
        try:
            soil_api_url = settings.BASE_API_URL + "/api/soil/"
            response = requests.post(soil_api_url, json=form_data)
            if response.status_code == 200:
                result = response.json()
            else:
                result = {"fertility_class": "Error", "confidence": 0}
        except Exception as e:
            result = {"fertility_class": str(e), "confidence": 0}

    return render(request, "SoilFertility/index.html", {"fields": FIELDS, "result": result})
