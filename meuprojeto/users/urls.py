from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('all-friends/<user_id>', views.all_friends, name='all_friends'),
]

