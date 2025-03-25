import os
import numpy as np
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SoilDataSerializer
from tensorflow.keras.models import load_model
from sklearn.preprocessing import StandardScaler

# Load model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'static', 'Models', 'soil_fertility_dl_model.h5')
model = load_model(MODEL_PATH)
print(model)
# Dummy scaler (you should load from joblib/pkl if saved)
scaler = StandardScaler()

# Simulate fitted scaler for inference (replace with joblib.load in real projects)
def fit_scaler_for_now():
    from pandas import read_csv
    df = read_csv('SoilFertility/static/DataSets/Soil Fertility Data (Modified Data).csv')
    X = df.drop(columns=['fertility'])
    scaler.fit(X)

fit_scaler_for_now()

# Map prediction index to label
fertility_map = {0: "Less Fertile", 1: "Fertile", 2: "Highly Fertile"}

class SoilFertilityPredictAPI(APIView):
    def post(self, request):
        serializer = SoilDataSerializer(data=request.data)
        if serializer.is_valid():
            input_data = np.array([[serializer.validated_data[key] for key in serializer.fields]])
            scaled = scaler.transform(input_data)
            prediction = model.predict(scaled)
            predicted_class = np.argmax(prediction, axis=1)[0]
            return Response({
                "fertility_class": fertility_map.get(predicted_class, "Unknown"),
                "confidence": float(np.max(prediction))
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
