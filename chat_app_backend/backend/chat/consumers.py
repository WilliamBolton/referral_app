import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.text import slugify
from .models import Message  # Import your Message model
from accounts.models import User  # Import the User model
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

class PersonalChatConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer that handles communication between different users.""" 
    async def connect(self):
        """Connects a user to the WebSocket"""
        request_user = self.scope['user']
        if request_user.is_authenticated:
            chat_with_email = self.scope['url_route']['kwargs']['email']
            sanitized_request_user_email = slugify(request_user.email)
            sanitized_chat_with_email = slugify(chat_with_email)
            user_emails = [sanitized_request_user_email, sanitized_chat_with_email]
            user_emails.sort() # Sort email addresses alphabetically so only one unique identifier for the conversation between two users
            self.room_group_name = f"chat_{user_emails[0]}_{user_emails[1]}"
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
        await self.accept()

    async def receive(self, text_data=None):
        """Receives data from the WebSocket connection and broadcasts messages to the group"""
        if text_data:
            data = json.loads(text_data)
            message_text = data.get('message')
            recipient_email = data.get('recipient_email')
            print('receive data', data)
            
            if message_text and recipient_email:
                sender = self.scope['user']
                recipient = await self.get_recipient_user(recipient_email)

                if recipient:
                    await self.save_message(sender, recipient, message_text)

                    # Broadcast message to room group
                    print('self.room_group_name', self.room_group_name)
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'chat_message',
                            'message': message_text
                        }
                    )

    async def disconnect(self, code):
        """Disconnects a user from the WebSocket"""
        self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
    async def chat_message(self, event):
        """Sends a message to the WebSocket client"""
        message = event["message"]
        #print('I am here 2')
        await self.send(text_data=json.dumps({
            "message": message
        }))
    
    @sync_to_async
    def save_message(self, sender, recipient, message_text):
        """Saves message to Message object database"""
        Message.objects.create(sender=sender, recipient=recipient, message=message_text)

    
    @database_sync_to_async
    def get_recipient_user(self, email):
        """Gets user"""
        return User.objects.get(email=email)
