import requests
from backend.auth_providers.oauth_base import OAuthBase
from django.contrib.auth import authenticate
from backend.config import env


class OAuth_42(OAuthBase):
    def __init__(self, request):
        self.request = request
    
    def get_intra_data(self, access_token):
        headers = {
            'Authorization': 'Bearer ' + access_token
        }
        response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
        if response.status_code != 200:
            raise Exception('Error getting user data')

        return (response.json())
    
    def get_access_token(self, code):
        data = {
            'grant_type': 'authorization_code',
            'client_id': env('S42_CLIENT_ID'),
            'client_secret': env('S42_CLIENT_SECRET'),
            'code': code,
            'redirect_uri': env('S42_REDIRECT_URI')
        }

        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
        if response.status_code != 200:
            raise Exception('Error getting access token')

        return response.json()['access_token']
    
    def authenticate(self):
            code = self.request.GET.get('code')
            access_token = self.get_access_token(code)
            intra_data = self.get_intra_data(access_token)
            data = {
                'username': intra_data['login'],
                'nickname': intra_data['login'],
                'email': intra_data['email'],
		    }
            return authenticate(self.request, data=data)
    
    def get_redirect_url(self):
        return env('S42_AUTH_URL')
