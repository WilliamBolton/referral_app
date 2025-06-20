import asyncio
import json
from ai_chat.ai_response import get_ai_response
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils.text import slugify
from .models import AI_Message 
from accounts.models import User
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async

class AIChatConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer that handles communication between users and an AI chatbot. 
    When a user sends a message, it is saved to the database, then passed to the AI 
    chatbot to generate a response. The response is also saved to the database and 
    sent back to the user via the WebSocket."""
    async def connect(self):
        """Connects a user to the WebSocket"""
        user = self.scope['user']
        if user.is_authenticated:
            sanitized_user_email = slugify(user.email)
            self.room_group_name = f"ai_chat_{sanitized_user_email}"
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
        await self.accept()

    async def receive(self, text_data=None):
        """Receives data from the WebSocket connection and broadcasts both messages to the group"""
        if text_data:
            data = json.loads(text_data)
            message_text = data.get('message')
            message_from = 'user'
            print('receive data', data)
            if message_text:
                user = self.scope['user']
                # Save users message
                await self.save_message(user, message_from, message_text)

                # Send the user's message to the WebSocket group so it shows up quickly
                # This does not work for some reason?
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message_text
                    }
                )

                # Pass the user's message to the AI function, get the response and save
                ai_response = await get_ai_response(message_text)
                await self.save_message(user=user, message_from='AI', message_text=ai_response)

                # Broadcast message to room group
                print('self.room_group_name', self.room_group_name)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': ai_response
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
        await self.send(text_data=json.dumps({
            "message": message
        }))
    
    @sync_to_async
    def save_message(self, user, message_from, message_text):
        """Saves message to AI_Message object database"""
        AI_Message.objects.create(user=user, message_from=message_from, message=message_text)

    
    @database_sync_to_async
    def get_recipient_user(self, email):
        """Gets user"""
        return User.objects.get(email=email)
