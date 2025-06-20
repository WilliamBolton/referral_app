from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from chat.serializers import UserGetSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import Message
from .serializers import MessageSerializer
from accounts.models import User
# Create your views here.

User = get_user_model()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_list(request):
    """Gets all users"""
    try:
        # Remove self and superusers from list
        user_object = User.objects.exclude(id=request.user.id).filter(is_superuser=False)
        print('Users:', user_object)
        serialiser = UserGetSerializer(user_object, many=True)
        print('Users serialiser:', serialiser)
        return Response(serialiser.data)
    except:
        return Response({"error": "Error in getting list of users"}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_specific_user(request):
    """Gets a specific user"""
    try:
        print('in get_specific_user')
        user_email = request.data['user']
        print('user_email', user_email)
        user = User.objects.get(email=user_email)
        print('user', user)
        serialiser = UserGetSerializer(user)
        print('serialiser', serialiser)
        return Response(serialiser.data)
    except:
        return Response({"error": "Error in getting user"}, status=400)

class MessageListCreateAPIView(generics.ListCreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

class UserMessageListAPIView(generics.ListAPIView):
    serializer_class = MessageSerializer

    def get_queryset(self):
        recipient = self.kwargs['recipient']
        return Message.objects.filter(recipient=recipient, sender=self.request.user)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_messages(request):
    """Gets all messages sent and recieved by a user"""
    sender_email = request.data['sender']
    print('sender', sender_email)
    recipient_email = request.data['recipient']
    print('recipient', recipient_email)
    if not sender_email or not recipient_email:
        return Response({'error': 'Sender and recipient email are required'}, status=400)
    # Get user objects based on email addresses to load messages
    try:
        sender = User.objects.get(email=sender_email)
        recipient = User.objects.get(email=recipient_email)
    except User.DoesNotExist:
        return Response({'error': 'User or recipient does not exist'}, status=400)
    messages_sent_by_user = Message.objects.filter(sender=sender, recipient=recipient)
    messages_received_by_user = Message.objects.filter(sender=recipient, recipient=sender)
    messages = messages_sent_by_user | messages_received_by_user
    # Order by time so in correct order
    messages = messages.order_by('timestamp')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)