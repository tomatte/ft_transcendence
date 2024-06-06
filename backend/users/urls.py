from django.urls import re_path
from . import views

urlpatterns = [
	re_path('my_user/', views.my_user, name='my_user'),
	re_path('all_users/', views.all_users, name='all_users'),
	re_path('friends/request/send' , views.pending_friends, name='get_pending_friends'),
	re_path('friends/request/receive' , views.receive_pending, name='get_pending_friends'),
	re_path('friends/response/', views.response_friend, name='response_friend'),


	re_path('uptade_nickname/', views.uptade_nickname, name='uptade_nickname'),
	re_path('uptade_avatar/', views.uptade_avatar, name='uptade_avatar'),
	re_path('add_friend/', views.add_friend, name='add_friend'),


	re_path('populate/', views.populate, name='populate'),
	re_path('auxiliar/', views.auxiliar, name='auxiliar'),
]
