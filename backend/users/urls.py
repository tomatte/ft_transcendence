from django.urls import re_path
from . import views

urlpatterns = [
	re_path('get/my_user', views.my_user, name='my_user'),
	re_path('get/all_users', views.all_users, name='all_users'),
	re_path('get/friends-request-send' , views.friend_request_send, name='get_pending_friends'),
	re_path('get/friends-request-receive' , views.friend_request_received, name='get_pending_friends'),

	re_path('uptate/uptade_nickname/', views.uptade_nickname, name='uptade_nickname'),
	re_path('uptate/uptade_avatar/', views.uptade_avatar, name='uptade_avatar'),

	re_path('response/friends-request', views.response_friend_request, name='response_friend'),

	re_path('add_friend/', views.add_friend, name='add_friend'),


	re_path('populate/', views.populate, name='populate'),
	re_path('auxiliar/', views.auxiliar, name='auxiliar'),
]
