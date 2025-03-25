from rest_framework import serializers

class SoilDataSerializer(serializers.Serializer):
    N = serializers.FloatField()
    P = serializers.FloatField()
    K = serializers.FloatField()
    pH = serializers.FloatField()
    EC = serializers.FloatField()
    OC = serializers.FloatField()
    S = serializers.FloatField()
    Zn = serializers.FloatField()
    Fe = serializers.FloatField()
    Cu = serializers.FloatField()
    Mn = serializers.FloatField()
    B = serializers.FloatField()
