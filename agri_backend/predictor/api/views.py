from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .gpt_engine import generate_yield_prediction

class CropPredictionAPIView(APIView):
    def post(self, request):
        data = request.data

        crop = data.get("crop")
        season = data.get("season")
        state = data.get("state")
        area = data.get("area_hectares")
        custom_question = data.get("custom_question", "").strip()
        soil = data.get("soil_health", {})

        if not all([crop, season, state, area]):
            return Response({"error": "Missing required fields."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            area = float(area)
            if area <= 0:
                raise ValueError
        except (ValueError, TypeError):
            return Response({"error": "Area must be a positive number."}, status=status.HTTP_400_BAD_REQUEST)

        default_soil = {
            "N": 0, "P": 0, "K": 0, "pH": 7.0, "EC": 0.0, "OC": 0.0, "S": 0,
            "Zn": 0.0, "Fe": 0.0, "Cu": 0.0, "Mn": 0.0, "B": 0.0
        }
        soil = {**default_soil, **soil}

        prompt = (
            f"You are an expert agronomist AI.\n\n"
            f"Crop: {crop}\n"
            f"Season: {season}\n"
            f"State: {state}\n"
            f"Area: {area:.2f} hectares\n"
            f"Soil Health:\n"
            f"- N: {soil['N']} mg/kg\n"
            f"- P: {soil['P']} mg/kg\n"
            f"- K: {soil['K']} mg/kg\n"
            f"- pH: {soil['pH']}\n"
            f"- EC: {soil['EC']} dS/m\n"
            f"- OC: {soil['OC']} %\n"
            f"- S: {soil['S']} mg/kg\n"
            f"- Zn: {soil['Zn']} mg/kg\n"
            f"- Fe: {soil['Fe']} mg/kg\n"
            f"- Cu: {soil['Cu']} mg/kg\n"
            f"- Mn: {soil['Mn']} mg/kg\n"
            f"- B: {soil['B']} mg/kg\n\n"
        )

        if custom_question:
            prompt += f"User Question: {custom_question}\nPlease answer this specifically."
        else:
            prompt += (
                "Based on the above, predict:\n"
                "1. Estimated crop yield per hectare\n"
                "2. Total estimated yield for the area\n"
                "3. Profit and economic feasibility\n"
                "4. Best farming techniques"
            )

        try:
            result = generate_yield_prediction(prompt)
        except Exception as e:
            return Response({"error": f"LLM Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"response": result}, status=status.HTTP_200_OK)
