from backend.auth_providers.oauth_base import OAuthBase
from backend.auth_providers.oauth_42 import OAuth_42
from backend.auth_providers.oauth_google import OAuth_Google
from backend.auth_providers.oauth_fake import OAuth_Fake



class OAuth_Factory:
    oauth_provider_options = {}
    
    @classmethod
    def create(cls, provider: str, request) -> OAuthBase:
        if not provider in cls.oauth_provider_options:
            raise ModuleNotFoundError(f"OAuth provider option not found: {provider}")
        return cls.oauth_provider_options[provider](request)
    
    @classmethod
    def register(cls, provider_name: str, provider_class: OAuthBase):
        cls.oauth_provider_options[provider_name] = provider_class

OAuth_Factory.register('42', OAuth_42)
OAuth_Factory.register('google', OAuth_Google)
OAuth_Factory.register('fake', OAuth_Fake)