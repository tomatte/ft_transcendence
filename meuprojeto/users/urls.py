from django.urls import path
from . import views

urlpatterns = [
    path('<user_id>', views.get_user, name='get_user'), ## TODO: por enquando recebendo o user, mas devemos salvar o user logado
    path('friends/<user_id>', views.user_friends, name='user_friends'), ## TODO: por enquando recebendo o user, mas devemos salvar o user logado
	# path('games/<user_id>', views.user_games, name='user_games'), ## TODO: por enquando recebendo o user, mas devemos salvar o user logado
]

