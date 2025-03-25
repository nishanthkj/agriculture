from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .. serializers import CropPredictionSerializer
import os, pickle, numpy as np
from tensorflow.keras.models import load_model

# === Load model and tools
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
print(BASE_DIR)
MODEL_DIR = os.path.join(BASE_DIR, 'CropYield', 'static', 'CropYield', 'models')


model = load_model(os.path.join(MODEL_DIR, 'model.h5'), compile=False)

with open(os.path.join(MODEL_DIR, 'scaler.pkl'), 'rb') as f:
    scaler = pickle.load(f)

with open(os.path.join(MODEL_DIR, 'encoders.pkl'), 'rb') as f:
    encoders = pickle.load(f)


# ✅ DRF APIView
class CropYieldAPIView(APIView):
    def post(self, request):
        serializer = CropPredictionSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data

            try:
                crop = data["crop"].strip().title()
                season = data["season"].strip().title()
                state = data["state"].strip().title()

                # Validate inputs
                if crop not in encoders["Crop"].classes_:
                    return Response({"error": f"Unknown crop: {crop}"}, status=400)
                if season not in encoders["Season"].classes_:
                    return Response({"error": f"Unknown season: {season}"}, status=400)
                if state not in encoders["State"].classes_:
                    return Response({"error": f"Unknown state: {state}"}, status=400)

                # Encode and predict
                crop_enc = encoders["Crop"].transform([crop])[0]
                season_enc = encoders["Season"].transform([season])[0]
                state_enc = encoders["State"].transform([state])[0]

                input_data = [crop_enc, season_enc, state_enc,
                              data["area"], data["rainfall"],
                              data["fertilizer"], data["pesticide"]]

                scaled = scaler.transform([input_data])
                sequence_input = np.expand_dims([scaled[0]] * 3, axis=0)
                prediction = model.predict(sequence_input)[0][0]

                return Response({"predicted_yield": round(float(prediction), 4)})

            except Exception as e:
                return Response({"error": str(e)}, status=500)
        return Response(serializer.errors, status=400)
# Compare this snippet from CropYield/urls.py: