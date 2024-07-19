from django.urls import re_path
from . import views
import websocket
import game.views

urlpatterns = [
    re_path("ws/player/", game.views.PlayerConsumer.as_asgi()),
    re_path("ws/game_loop/", game.views.GameLoopConsumer.as_asgi()),
    re_path("ws/tournament/", game.views.TournamentConsumer.as_asgi()),
    re_path("ws/notification/", game.views.NotificationConsumer.as_asgi()),
]
