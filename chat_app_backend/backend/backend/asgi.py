import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from chat.route import websocket_urlpatterns
from channels.auth import AuthMiddlewareStack
from chat.channels_middleware import JWTWebsocketMiddleware

"""Asynchronous Server Gateway Interface (ASGI) configuration defines how the Django application 
handles asynchronous communication protocols such as HTTP requests and webSocket connections."""

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fact_wise.settings')

application = get_asgi_application()

application = ProtocolTypeRouter({
    "http":application,
    "websocket": JWTWebsocketMiddleware(AuthMiddlewareStack(URLRouter(websocket_urlpatterns))),
})