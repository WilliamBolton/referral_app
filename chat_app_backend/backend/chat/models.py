from django.conf import settings
from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Message(models.Model):
    """ Model for the chat messages"""
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} said '{self.message}'to {self.recipient} at {self.timestamp}"