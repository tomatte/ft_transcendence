from django.urls import path
from . import views

urlpatterns = [
	path('', views.get_user, name='get_user'),

	## Uploads
	path('upload/avatar', views.update_avatar, name='update_file'),
	path('upload/nickname', views.update_nickname, name='upload_nickname'),

	path('friends/', views.user_friends, name='user_friends'),
	path('add/friend/<other_id>', views.add_friend, name='add_friend'),
	path('remove/friend/<other_id>', views.remove_friend, name='remove_friend'),
	path('games/', views.user_historicy, name='user_games'),
]

