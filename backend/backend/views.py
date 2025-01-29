from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, authenticate
from users.models import User
import requests
import os
from django.conf import settings
from tournament.models import Match, Tournament
from backend.auth_google_utils import create_anti_forgery_state_token, decode_jwt, make_nickname
import secrets
from backend.config import env
from backend.auth_providers.oauth_factory import OAuth_Factory

def stats(request):
	data = {
		"users": User.objects.count(),
		"matches": Match.objects.count(),
		"tournaments": Tournament.objects.count(),
	}
	return JsonResponse(data)


def set_cookies(response, user):
	response.set_cookie('username', user.username)
	response.set_cookie('nickname', user.nickname)
	response.set_cookie('avatar', user.avatar.name)


def auth(request, provider):
	if request.method != 'GET':
		return JsonResponse({'message': 'Invalid request'})
	try:
		oauth_provider = OAuth_Factory.create(provider, request)
		code = request.GET.get('code')
		if not code:
			return HttpResponseRedirect(oauth_provider.get_redirect_url())
		user = oauth_provider.authenticate()
		if user:
			auth_login(request, user)
			response = redirect(env('SITE_URL'))
			set_cookies(response, user)
			return response
		else:
			return JsonResponse({'message': "forbbiden"})
	except Exception as e:
		return JsonResponse({'message': str(e)})

def not_authorized(request):
	return render(request, 'not_authorized.html')


def login(request):
	return render(request, 'login.html')

def auth_fake(request): #TODO: remove in production
	if request.method != 'GET':
		return JsonResponse({'message': 'Invalid request'})
	try:
		fake_data = {
			'login': 'user0',
			'email': 'user0@mail.com',
		}

		if request.GET.get('user'):
			fake_data['login'] = request.GET.get('user')
			fake_data['email'] = f"{fake_data['login']}@mail.com"

		user = authenticate(fake_data=fake_data)
		if user:
			auth_login(request, user)
			response = redirect(env('SITE_URL'))
			set_cookies(response, user)
			return response
	 	# return
		else:
			return JsonResponse({'message': "forbbiden"})
	except Exception as e:
		return JsonResponse({'message': str(e)})



def get_image(request, image_name):
	image_path = os.path.join(settings.MEDIA_ROOT, 'api/images/avatars', image_name)

	try:
		with open(image_path, 'rb') as image:
			return HttpResponse(image.read(), content_type="image/jpeg")
	except FileNotFoundError:
		return HttpResponse('Image not found', status=404)
