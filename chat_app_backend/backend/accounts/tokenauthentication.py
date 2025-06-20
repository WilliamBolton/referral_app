import jwt
from jwt.exceptions import InvalidTokenError, ExpiredSignatureError
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.conf import settings
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from channels.db import database_sync_to_async

User = get_user_model()

class JWTAuthentication(BaseAuthentication):
    """Provides JSON Web Token authentication for Django REST Framework views and channels"""
    def authenticate(self, request):
        """Authenticates the user based on the token provided in the request"""
        token = self.extract_token(request=request)
        if token is None:
            return None
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            self.verify_token(payload=payload)
            #print(payload)
            email = payload['email']
            #email = payload.get('email')
            user = User.objects.get(email=email)
            return (user, None)
        except (InvalidTokenError, ExpiredSignatureError, User.DoesNotExist):
            raise AuthenticationFailed("Invalid token")

    def verify_token(self, payload):
        """Verifies the validity and expiration of the token payload"""
        if "exp" not in payload:
            raise InvalidTokenError("Token has no expiration")
        exp_timestamp = payload["exp"]
        current_timestamp = datetime.now().timestamp()
        if current_timestamp > exp_timestamp:
            raise ExpiredSignatureError("Token has exspired")

    def extract_token(self, request):
        """Extracts the token from the requests authorization header"""
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Bearer '):
            return auth_header.split(" ")[1]
        return None
    
    @database_sync_to_async
    def authenticate_websocket(self, scope, token):
        """Authenticates the user for webSocket connections"""
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            self.verify_token(payload)
            print(payload)
            email = payload['email']
            user = User.objects.get(email=email)
            return user
        except (InvalidTokenError, ExpiredSignatureError, User.DoesNotExist):
            raise AuthenticationFailed("Invalid token")

    @staticmethod
    def generate_token(data):
        """Generates a token based on the provided data"""
        expiration = datetime.now() + timedelta(hours=24)
        #print(data.email)
        payload = {
            'email': data['email'],
            'exp': expiration.timestamp(),
        }
        token = jwt.encode(payload=payload, key=settings.SECRET_KEY, algorithm='HS256')
        return token

