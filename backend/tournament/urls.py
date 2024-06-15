from django.urls import re_path
from . import views

urlpatterns = [
	re_path('create/' , views.create_tournament, name='create_tournament'),
]
