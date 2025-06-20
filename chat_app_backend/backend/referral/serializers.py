from rest_framework import serializers
from .models import Patient, Referral

class ReferralSerializer(serializers.ModelSerializer):
    """Serializes and deserializes Referral objects to and from JSON"""
    patient_hospital_number = serializers.CharField(source='patient.hospital_number', read_only=True)

    class Meta:
        model = Referral
        fields = ['id', 'sender', 'recipient', 'patient_hospital_number', 'reason', 'status', 'timestamp']

class PatientSerializer(serializers.ModelSerializer):
    """Serializes and deserializes Patient objects to and from JSON"""
    class Meta:
        model = Patient
        fields = ['name', 'date_of_birth', 'hospital_number']