from django.contrib.auth.backends import BaseBackend
from users.models import User
import requests

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

    def authenticate(self, request=None, token=None, fake_data=None):
        try:
            data = MyBackend.get_intra_data(token)
        except:
            if fake_data: #TODO: remove in production
                data = fake_data
            else:
                return None
        try:
            return User.objects.get(username=data['login'])
        except User.DoesNotExist:
            return self.create_user(data)
    
    def get_user(self, user_id):
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
        
    def create_user(self, data):
        user = User.objects.create_user(
            username=data['login'],
            email=data['email'],
        )
        user.nickname = data['login']
        user.save()
        return user
