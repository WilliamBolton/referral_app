from django.shortcuts import render
from accounts.models import User
from ai_chat.models import AI_Message
from ai_chat.serializers import AIMessageSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


# Create your views here.

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_ai_messages(request):
    """Gets all messages sent to and recieved by the AI assistant for a user"""
    sender_email = request.data['sender']
    print('sender', sender_email)
    sender = User.objects.get(email=sender_email)
    messages = AI_Message.objects.filter(user=sender)
    # Order by time so in correct order
    messages = messages.order_by('timestamp')
    serializer = AIMessageSerializer(messages, many=True)
    return Response(serializer.data)