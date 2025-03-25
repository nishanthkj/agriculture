from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import numpy as np
import os
import pickle

from .serializers import PredictionInputSerializer

# Load models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
MODEL_PATH = os.path.join(BASE_DIR, 'CropRF', 'static', 'models')

try:
    nb_model = pickle.load(open(os.path.join(MODEL_PATH, 'naive_bayes_model.pkl'), 'rb'))
    rf_model = pickle.load(open(os.path.join(MODEL_PATH, 'random_forest_model.pkl'), 'rb'))
except Exception as e:
    print("Error loading models:", e)
    nb_model = None
    rf_model = None

crop_dict = {
    1: 'Rice', 2: 'Maize', 3: 'Jute', 4: 'Cotton', 5: 'Coconut',
    6: 'Papaya', 7: 'Orange', 8: 'Apple', 9: 'Muskmelon', 10: 'Watermelon',
    11: 'Grapes', 12: 'Mango', 13: 'Banana', 14: 'Pomegranate',
    15: 'Lentil', 16: 'Blackgram', 17: 'Mungbean', 18: 'Mothbeans',
    19: 'Pigeonpeas', 20: 'Kidneybeans', 21: 'Chickpea', 22: 'Coffee'
}

fertilizer_dict = {
    0: 'Urea', 1: 'DAP', 2: 'Fourteen-Thirty Five-Fourteen',
    3: 'Twenty Eight-Twenty Eight', 4: 'Seventeen-Seventeen-Seventeen',
    5: 'Twenty-Twenty', 6: 'Ten-Twenty Six-Twenty Six'
}

class CropFertilizerPredictAPI(APIView):
    def post(self, request):
        serializer = PredictionInputSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                features = np.array([[data['N'], data['P'], data['K'], data['ph']]])
                crop_pred = nb_model.predict(features)[0]
                fertilizer_pred = rf_model.predict(features)[0]

                return Response({
                    'predicted_crop': crop_dict.get(crop_pred, 'Unknown Crop'),
                    'recommended_fertilizer': fertilizer_dict.get(fertilizer_pred, 'Unknown Fertilizer')
                })
            except Exception as e:
                return Response({'error': str(e)}, status=500)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
