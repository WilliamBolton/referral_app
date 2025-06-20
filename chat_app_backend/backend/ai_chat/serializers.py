from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import AI_Message

class AIMessageSerializer(serializers.ModelSerializer):
    """Serializes and deserializes AI_Message objects to and from JSON"""
    class Meta:
        model = AI_Message
        fields = ['id', 'user', 'message_from', 'message', 'timestamp']