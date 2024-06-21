from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
	# path('admin/', admin.site.urls),
	path('api/login/', views.login, name='login'),
	path('api/autenticate', views.autenticate, name='autenticate'),
	path('api/notAuthorized/', views.not_authorized, name='not_authorized'),
	path('api/users/', include('users.urls')),
	path('api/tournament/', include('tournament.urls')),
]
