from django.core.asgi import get_asgi_application
from django.urls import path
import game.views
import websocket
import game


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
				path("add_player_tournament/", websocket.views.Add_player_tournament.as_asgi()),
				path("remove_player_tournament/", websocket.views.Remove_player_tournament.as_asgi()),
				path("create_bracket/", websocket.views.Create_Bracket.as_asgi()),
				path("start_tournament/", websocket.views.Start_tournament.as_asgi()),
				path("end_tournament/", websocket.views.Finish_tournament.as_asgi()),
				path("xablau/", game.views.XablauConsumer.as_asgi()),
			])
		)
})
