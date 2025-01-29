from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, authenticate
from users.models import User
import requests
from environs import Env
import os
from django.conf import settings
from tournament.models import Match, Tournament
from backend.auth_google_utils import create_anti_forgery_state_token, decode_jwt, make_nickname
import secrets

env = Env()
env.read_env()

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
		code = request.GET.get('code')
		if not code:
			return HttpResponseRedirect(env('S42_AUTH_URL'))
		access_token = get_access_token(code)
		intra_data = get_intra_data(access_token)
		data = {
			'username': intra_data['login'],
			'nickname': intra_data['login'],
			'email': intra_data['email'],
		}
		user = authenticate(request, data=data)
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
		client_id = env('GOOGLE_CLIENT_ID')
		nonce = secrets.token_urlsafe(16)
		if not code:
			token = create_anti_forgery_state_token(request)
			request.session['state'] = token
			url = f"https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id={client_id}&scope=openid%20profile%20email&redirect_uri=https%3A//localhost/api/auth_google&state={token}&nonce={nonce}"
			return HttpResponseRedirect(url)
		else:
			if request.GET.get('state') != request.session['state']:
				return JsonResponse({'message': 'invalid state parameter'})
			codeExchangeResponse = requests.post('https://oauth2.googleapis.com/token', {
				'code': code,
				'client_id': client_id,
				'client_secret': env('GOOGLE_CLIENT_SECRET'),
				'redirect_uri': 'https://localhost/api/auth_google',
				'grant_type': 'authorization_code'
			})
			id_token = codeExchangeResponse.json()['id_token']
			decoded_token = decode_jwt(id_token)
			nickname = make_nickname(decoded_token['name'], decoded_token['sub'])
			data = {
				'username': nickname,
				'nickname': nickname,
				'email': decoded_token['email']
			}
			user = authenticate(request, data=data)
			if user:
				auth_login(request, user)
				response = redirect(env('SITE_URL'))
				set_cookies(response, user)
				return response
			else:
				return JsonResponse({'message': "forbbiden"})
	except Exception as e:
		return JsonResponse({'message': str(e)})


def auth(request):
    pass

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
