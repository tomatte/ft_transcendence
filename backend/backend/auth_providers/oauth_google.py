import secrets

import requests
from backend.auth_providers.oauth_base import OAuthBase
from backend.auth_google_utils import create_anti_forgery_state_token, decode_jwt, make_nickname
from backend.config import env
from django.contrib.auth import authenticate


class OAuth_Google(OAuthBase):
    def __init__(self, request):
        self.request = request
    
    def get_google_data(self):
        codeExchangeResponse = requests.post('https://oauth2.googleapis.com/token', {
            'code': self.request.GET.get('code'),
            'client_id': env('GOOGLE_CLIENT_ID'),
            'client_secret': env('GOOGLE_CLIENT_SECRET'),
            'redirect_uri': 'https://localhost/api/auth/google',
            'grant_type': 'authorization_code'
        })
        id_token = codeExchangeResponse.json()['id_token']
        return decode_jwt(id_token)
    
    def authenticate(self):
        if self.request.GET.get('state') != self.request.session['state']:
            raise ValueError('invalid state parameter')
        
        google_data = self.get_google_data()
        nickname = make_nickname(google_data['name'], google_data['sub'])
        data = {
            'username': nickname,
            'nickname': nickname,
            'email': google_data['email']
        }
        return authenticate(self.request, data=data)
    
    def get_redirect_url(self):
        token = create_anti_forgery_state_token(self.request)
        client_id = env('GOOGLE_CLIENT_ID')
        nonce = secrets.token_urlsafe(16)
        self.request.session['state'] = token
        url = f"https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={client_id}&scope=openid%20profile%20email&redirect_uri=https%3A//localhost/api/auth/google&state={token}&nonce={nonce}"
        return url