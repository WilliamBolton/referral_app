from django.urls import path
from django.urls import include, re_path

from ai_chat.consumers import AIChatConsumer
from referral.consumers import ReferralConsumer
from .consumers import PersonalChatConsumer

"""
WebSocket URL patterns define the routing information for WebSocket connections. 
Each WebSocket URL pattern maps a URL path to a corresponding WebSocket consumer.
"""

websocket_urlpatterns = [
    re_path(r'ws/(?P<email>[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/$', PersonalChatConsumer.as_asgi()),
    re_path(r'ws/referral/(?P<email>[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/$', ReferralConsumer.as_asgi()),
    re_path(r'ws/ai_chat/(?P<email>[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/$', AIChatConsumer.as_asgi()),
]
