from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
	# path('admin/', admin.site.urls),
	path('api/login/', views.login, name='login'),
	path('api/stats/', views.stats, name='stats'),
	path('api/fake_login/', views.auth_fake, name='fake_login'), #TODO: remove in production
	path('api/auth/<str:provider>/', views.auth, name='auth'),
	path('api/notAuthorized/', views.not_authorized, name='not_authorized'),
	path('api/users/', include('users.urls')),
	path('api/tournament/', include('tournament.urls')),
	path('api/images/avatars/<str:image_name>/', views.get_image, name='get_image'),
]
