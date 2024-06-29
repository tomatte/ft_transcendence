from django.urls import re_path
from . import views
import websocket
import game.views

urlpatterns = [
    re_path("player/", game.views.PlayerConsumer.as_asgi()),
    re_path("game_loop/", game.views.GameLoopConsumer.as_asgi()),
    re_path("tournament/", game.views.TournamentConsumer.as_asgi()),
    re_path("notification/", game.views.NotificationConsumer.as_asgi()),
]
