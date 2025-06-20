from django.db import models
from backend import settings

# Create your models here.

class Patient(models.Model):
    """ Model for patients"""
    name = models.CharField(max_length=50)
    date_of_birth = models.DateField()
    hospital_number = models.CharField(max_length=50)

    def __str__(self):
        return self.name 

class Referral(models.Model):
    """ Model for referrals"""
    STATUS_CHOICES = [
        ('incomplete', 'Incomplete'),
        ('completed', 'Completed'),
    ]

    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_referrals')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_referrals')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE)
    reason = models.TextField(max_length=250)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='incomplete')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Referral to {self.recipient} for {self.patient}, Reason: {self.reason}, Status: {self.status}. Time: {self.timestamp}"