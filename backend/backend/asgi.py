from django.core.asgi import get_asgi_application
from django.urls import path
import websocket
import game.urls


import websocket.views
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

application = ProtocolTypeRouter({
	"http": django_asgi_app,
	"websocket":
		AuthMiddlewareStack(
			URLRouter([
				*(game.urls.urlpatterns)
			])
		)
})
