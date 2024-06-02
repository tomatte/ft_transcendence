from django.urls import re_path
from . import views

urlpatterns = [
	re_path('my_user/', views.my_user, name='my_user'),
	re_path('all/', views.all_users, name='all_users'),

	re_path('uptade_nickname/', views.uptade_nickname, name='uptade_nickname'),
	re_path('uptade_avatar/', views.uptade_avatar, name='uptade_avatar'),
	# re_path('populate/', views.populate, name='populate'),
	# re_path('auxiliar/', views.auxiliar, name='auxiliar'),
]
