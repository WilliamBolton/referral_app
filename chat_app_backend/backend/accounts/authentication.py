from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

class EmailBackend(BaseBackend):
    def authenticate(self, request, username=None, password=None):
        """Function to authenticate users"""
        UserModel = get_user_model()
        # Print all user objects
        all_users = UserModel.objects.all()
        for user in all_users:
            print('\n\n\n', user)
            print(user.email)
            print(user.password)
        try:
            user = UserModel.objects.get(email=username)
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            return None

    def get_user(self, user_id):
        """Function to get user"""
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None