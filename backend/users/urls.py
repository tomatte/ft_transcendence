from django.urls import re_path
from . import views

urlpatterns = [
	re_path('get/my_user', views.my_user, name='my_user'),
	re_path('get/user', views.get_user, name='get_user'),
	re_path('get/all_users', views.all_users, name='get_all_users'),
	re_path('get/friends-request-send' , views.friend_request_send, name='get_pending_friends'),
	re_path('get/friends-request-receive' , views.friend_request_received, name='get_receive_friends'),
	re_path('get/ranking' , views.ranking, name='get_ranking'),
	re_path('get/statistics' , views.statistics, name='get_statistics'),
	re_path('get/historic' , views.historic, name='get_historic'),
	##Do manel
	re_path('get/get-list-friends' , views.get_list_friends, name='get_list_friends'),
	# re_path('get/friends', views.get_friends, name='get_friends'),

	re_path('uptate/uptade-nickname/', views.uptade_nickname, name='uptade_nickname'),
	re_path('uptate/uptade-avatar/', views.uptade_avatar, name='uptade_avatar'),

	re_path('add/friend/', views.add_friend, name='add_friend'),
	re_path('response/pedding-friend/', views.response_friend, name='response_friend'),
	# re_path('remove/friend/', views.remove_friend, name='remove_friend'),

]

