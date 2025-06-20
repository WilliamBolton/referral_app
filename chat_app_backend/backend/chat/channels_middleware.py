from channels.middleware import BaseMiddleware
from rest_framework.exceptions import AuthenticationFailed
from django.db import close_old_connections
from accounts.tokenauthentication import JWTAuthentication

class JWTWebsocketMiddleware(BaseMiddleware):
    """Authenticates users and their assotiated JSON Web Tokens for webSocket connections."""
    async def __call__(self, scope, recieve, send):
        close_old_connections()

        query_string = scope.get("query_string", b"").decode("utf-8")
        query_parameters = dict(qp.split("=") for qp in query_string.split("&"))
        token = query_parameters.get("token", None)
        if token is None:
            await send({
                "type": "websocket.close",
                "code": 1007,
            })
        authentication = JWTAuthentication()
        try: 
            user = await authentication.authenticate_websocket(scope, token)
            print(user)
            if user is not None: 
                scope["user"] = user
            else:
                await send({
                    "type": "websocket.close",
                    "code": 1007,
                })
            
            return await super().__call__(scope, recieve, send)
        except AuthenticationFailed:
            await send({
                "type": "websocket.close",
                "code": 1007,
            })