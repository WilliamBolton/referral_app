from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Message

class UserGetSerializer(serializers.ModelSerializer):
    """Serializes and deserializes User objects to and from JSON"""
    class Meta:
        model = get_user_model()
        fields = ['email', 'first_name', 'last_name', 'medical_specialty', 'id']
        extra_kwargs = {'id': {'read_only': True}}

class MessageSerializer(serializers.ModelSerializer):
    """Serializes and deserializes Message objects to and from JSON"""
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'message', 'timestamp']