from django.urls import re_path
from . import views

urlpatterns = [
	re_path('create/' , views.create_tournament, name='create_tournament'),
	re_path('add/player' , views.add_player_tournament, name='add_player_tournament'),
	re_path('start/' , views.start_tournament, name='start_tournament'),
	re_path('end/' , views.start_tournament, name='start_tournament'),

]
