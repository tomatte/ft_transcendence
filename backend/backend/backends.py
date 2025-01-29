from django.contrib.auth.backends import BaseBackend
from users.models import User
import requests
from backend.auth_google_utils import make_nickname

class MyBackend(BaseBackend):
    def authenticate(self, request, data=None):
            try:
                return User.objects.get(username=data['username'])
            except User.DoesNotExist:
                return self.create_user(data)
                
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
        
    def create_user(self, data):
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
        )
        user.nickname = data['nickname']
        user.save()
        return user
