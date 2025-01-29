from abc import ABC, abstractmethod


class OAuthBase(ABC):
    @abstractmethod
    def authenticate(self):
        pass
    
    @abstractmethod
    def get_redirect_url(self) -> str:
        pass
