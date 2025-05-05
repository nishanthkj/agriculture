from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()
from .run import run
# === Google Gemini API Setup ===
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # or set it directly
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment.")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# === Prompt-based Yield Generator using Gemini ===
def generate_yield_prediction(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        return f"LLM Error: {str(e)}"

# === Django API View ===
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

        essential_keys = ["N", "P", "K", "pH", "EC", "OC", "S", "Zn", "Fe", "Cu", "Mn", "B"]
        default_soil = {key: 0 if key != "pH" else 7.0 for key in essential_keys}
        clean_soil = {key: soil.get(key, default_soil[key]) for key in essential_keys}

        prompt = (
            f"You are an expert agronomist AI.\n"
            f"Crop: {crop}\n"
            f"Season: {season}\n"
            f"State: {state}\n"
            f"Area: {area} hectares\n"
            f"Soil:\n" + "\n".join([f"- {k}: {v}" for k, v in clean_soil.items()]) + "\n\n"
        )

        if custom_question:
            prompt += f"User Question: {custom_question}\nAnswer briefly and precisely."
        else:
            prompt += (
                "Respond ONLY in this format:\n"
                "1. Yield/ha: <value>\n"
                "2. Total Yield: <value>\n"
                "3. Profitability: <short statement>\n"
                "4. Techniques: <short list>\n"
                "Be concise. Do not repeat the input or add extra explanation."
            )

        try:
            #response_text = generate_yield_prediction(prompt)
            response_text = run(prompt ) 
            print("\n=== Prompt Sent to Gemini ===\n", prompt)
            print("\n=== Gemini Response ===\n", response_text)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"response": response_text}, status=status.HTTP_200_OK)
