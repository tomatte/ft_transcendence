from django.urls import re_path
from . import views

urlpatterns = [
	re_path('my_user/', views.my_user, name='my_user'),
	re_path('all/', views.all_users, name='all_users'),
	re_path('populate/', views.populate, name='populate'),
]
