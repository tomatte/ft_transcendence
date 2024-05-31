from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', views.login, name='login'),
	path('api/autenticate', views.autenticate, name='autenticate'),
]
