from django.db import models

from backend import settings

# Create your models here.

class AI_Message(models.Model):
    """Model for messages with AI assistant"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='ai_sent_messages')
    message_from = models.CharField(max_length=50, null=True)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.message_from} sent at {self.timestamp} ({self.user})"