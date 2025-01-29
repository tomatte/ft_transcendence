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
from backend.auth_providers import OAuthBase
from backend.auth_providers.oauth_42 import OAuth_42
from backend.auth_providers.oauth_google import OAuth_Google
from backend.config import env

def stats(request):
	data = {
		"users": User.objects.count(),
		"matches": Match.objects.count(),
		"tournaments": Tournament.objects.count(),
	}
	return JsonResponse(data)

def get_access_token(code):
	data = {
		'grant_type': 'authorization_code',
		'client_id': env('S42_CLIENT_ID'),
		'client_secret': env('S42_CLIENT_SECRET'),
		'code': code,
		'redirect_uri': f"{env('SITE_URL')}/api/auth_42"
	}

	response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
	if response.status_code != 200:
		raise Exception('Error getting access token')

	return response.json()['access_token']


def get_intra_data(access_token):
	headers = {
		'Authorization': 'Bearer ' + access_token
	}
	response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
	if response.status_code != 200:
		raise Exception('Error getting user data')

	return (response.json())

def set_cookies(response, user):
	response.set_cookie('username', user.username)
	response.set_cookie('nickname', user.nickname)
	response.set_cookie('avatar', user.avatar.name)

def auth_42(request):
	if request.method != 'GET':
		return JsonResponse({'message': 'Invalid request'})
	try:
		oauth_provider: OAuthBase = OAuth_42(request)
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

def auth_google(request):
	if request.method != 'GET':
		return JsonResponse({'message': 'Invalid request'})
	try:
		code = request.GET.get('code')
		oauth_provider: OAuthBase = OAuth_Google(request)
		if not code:
			return HttpResponseRedirect(oauth_provider.get_redirect_url())
		else:
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


def auth(request, provider):
    print({'provider': provider})
    return JsonResponse({'message': f"trying to authenticate with {provider}"})

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
