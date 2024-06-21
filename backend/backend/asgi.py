from django.core.asgi import get_asgi_application
from django.urls import path
from websocket import views

# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

application = ProtocolTypeRouter({
	"http": django_asgi_app,
	"websocket": AllowedHostsOriginValidator(
		AuthMiddlewareStack(
			URLRouter([
				# path("add_player_tournament/", views.Add_player_tournament.as_asgi()),
				# path("remove_player_tournament/", views.Remove_player_tournament.as_asgi()),
				# path("create_bracket/", views.Create_Bracket.as_asgi()),
				# path("start_tournament/", views.Start_Tournament.as_asgi()),
				# path("end_tournament/", views.End_Tournament.as_asgi()),
			])
		)
	),
})
