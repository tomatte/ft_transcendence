from backend.auth_providers.oauth_base import OAuthBase
from django.contrib.auth import authenticate
from backend.config import env


class OAuth_Fake(OAuthBase):
    def __init__(self, request):
        self.request = request
    
    def authenticate(self):
        if env('ALLOW_FAKE_AUTH') != 'true':
            raise PermissionError('fake auth not allowed')
        
        user = self.request.GET.get('user')
        if not user:
            raise ValueError('no user provided')
        data = {}
        data['username'] = user
        data['nickname'] = user
        data['email'] = f"{user}@mail.com"

        return authenticate(self.request, data=data)
    
    def get_redirect_url(self):
        return 'https://localhost'