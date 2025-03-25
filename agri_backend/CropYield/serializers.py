from rest_framework import serializers

class CropPredictionSerializer(serializers.Serializer):
    crop = serializers.CharField()
    season = serializers.CharField()
    state = serializers.CharField()
    area = serializers.FloatField()
    rainfall = serializers.FloatField()
    fertilizer = serializers.FloatField()
    pesticide = serializers.FloatField()
