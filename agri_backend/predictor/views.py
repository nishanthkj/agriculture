from django.http import JsonResponse
from .gpt_engine import generate_yield_prediction
import json

def predict_crop(request):
    if request.method == "POST":
        data = json.loads(request.body)
        crop = data.get("crop")
        season = data.get("season")
        state = data.get("state")
        area = data.get("area_hectares")
        soil = data.get("soil_health", {})

        # Build prompt
        prompt = (
            f"Crop: {crop}\n"
            f"Season: {season}\n"
            f"State: {state}\n"
            f"Area: {area} hectare\n"
            f"Soil Data: N={soil.get('N')}, P={soil.get('P')}, K={soil.get('K')}, pH={soil.get('pH')}, "
            f"EC={soil.get('EC')}, OC={soil.get('OC')}, S={soil.get('S')}, Zn={soil.get('Zn')}, "
            f"Fe={soil.get('Fe')}, Cu={soil.get('Cu')}, Mn={soil.get('Mn')}, B={soil.get('B')}.\n"
            f"What is the estimated crop yield, profit, and how to grow it?"
        )

        result = generate_yield_prediction(prompt)
        return JsonResponse({"response": result})
    return JsonResponse({"error": "POST request required."}, status=400)
