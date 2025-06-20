import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.text import slugify

from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from accounts.models import User
from referral.models import Referral

class ReferralConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer that handles referrals communication between different users.""" 
    async def connect(self):
        """Connects a user to the WebSocket"""
        request_user = self.scope['user']
        if request_user.is_authenticated:
            sanitized_request_user_email = slugify(request_user.email)
            self.referral_user_name = sanitized_request_user_email
            print('Consumer Group name:', self.referral_user_name)
            await self.channel_layer.group_add(
                self.referral_user_name,
                self.channel_name
            )
        await self.accept()

    async def receive(self, text_data=None):
        """Receives data from the WebSocket connection and broadcasts messages to the group"""
        if text_data:
            data = json.loads(text_data)
            patient = data.get('patient')
            reason = data.get('reason')
            recipient_email = data.get('recipient_email')
            print('receive data', data)

            if patient and recipient_email:
                sender = self.scope['user']
                recipient = await self.get_recipient_user(recipient_email)
            
            if recipient:
                await self.save_referral(sender, recipient, patient, reason)

                # Broadcast the new referral
                print('self.referral_user_name', self.referral_user_name)
                await self.channel_layer.group_send(
                    self.referral_user_name,
                    {
                        'type': 'referral_message',
                        'sender': sender,
                        'recipient': recipient,
                        'patient': patient,
                        'reason': reason,
                    }
                )

    async def referral_message(self, event):
        sender = event['sender']
        recipient = event['recipient']
        patient = event['patient']
        reason = event['reason']
        await self.send(text_data=json.dumps({
            'sender': sender,
            'recipient': recipient,
            'patient': patient,
            'reason': reason,
        }))
    
    async def disconnect(self, code):
        """Disconnects a user from the WebSocket"""
        self.channel_layer.group_discard(
            self.referral_user_name,
            self.channel_name
        )

    @sync_to_async
    def save_referral(self, sender, recipient, patient, reason):
        """Saves referral to Referral object database"""
        Referral.objects.create(sender=sender, recipient=recipient, patient=patient, reason=reason)


    @database_sync_to_async
    def get_recipient_user(self, email):
        """Gets user"""
        return User.objects.get(email=email)

    async def send_referral(self, event):
        """Sends referral"""
        referral_data = event['referral_data']
        recipient_email = referral_data['recipient_email']
        await self.channel_layer.group_send(
            f"{slugify(recipient_email)}",
            {
                "type": "referral_message",
                "sender": referral_data['sender_email'],
                "recipient": recipient_email,
                "patient": referral_data['patient_hospital_number'],
                "reason": referral_data['reason'],
            }
        )