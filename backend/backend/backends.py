from django.contrib.auth.backends import BaseBackend
from users.models import User
import requests
from backend.auth_google_utils import make_nickname

class MyBackend(BaseBackend):
    @classmethod
    def get_intra_data(cls, access_token):
        headers = {
            'Authorization': 'Bearer ' + access_token
        }
        response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
        if response.status_code != 200:
            raise Exception('Error getting user data')

        return (response.json())

    def authenticate(self, request=None, token=None, fake_data=None, auth_provider='42', google_data=None):
        if auth_provider == '42':
            data = None
            try:
                data = MyBackend.get_intra_data(token)
            except:
                return None
            try:
                return User.objects.get(username=data['login'])
            except User.DoesNotExist:
                return self.create_user_42(data)
            
        if auth_provider == 'google':
            nickname = make_nickname(google_data['name'], google_data['sub'])
            try:
                return User.objects.get(username=nickname)
            except:
                data = {
                    'username': nickname,
                    'email': google_data['email']
                }
                return self.create_user_google(data)
                
            
        if auth_provider == None:
            if fake_data: #TODO: remove in production
                try:
                    return User.objects.get(username=fake_data['login'])
                except User.DoesNotExist:
                    return self.create_user_42(data)
            
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
        
    def create_user_42(self, data):
        user = User.objects.create_user(
            username=data['login'],
            email=data['email'],
        )
        user.nickname = data['login']
        user.save()
        return user
    
    def create_user_google(self, data):
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
        )
        user.nickname = data['username']
        user.save()
        return user
