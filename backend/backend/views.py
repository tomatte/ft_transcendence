from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login
from users.models import User
from django.contrib.auth import get_user_model

import requests


def get_acess_token(code):
	data = {
		'grant_type': 'authorization_code',
		'client_id': 'u-s4t2ud-9fc0845267bce949c5cf5e83db67b91730ba9fab5ffd6c62f001ec8802ec6f83',
		'client_secret': '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',
		'code': code,
		'redirect_uri': 'http://127.0.0.1:8000/api/autenticate'
	}

	response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
	if response.status_code != 200:
		raise Exception('Error getting access token')

	return response.json()['access_token']


def get_intra_data(acess_token):
	headers = {
		'Authorization': 'Bearer ' + acess_token
	}
	response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
	if response.status_code != 200:
		raise Exception('Error getting user data')

	return ({
		'username': response.json()['login'],
	})


def autenticate(request):
	code = request.GET.get('code')
	if request.method != 'GET' and not code:
		return JsonResponse({'message': 'Invalid request'})

	try:
		acess_token = get_acess_token(code)
		data_user = get_intra_data(acess_token)
		user, created = User.objects.get_or_create(username=data_user['username'], defaults=data_user)
		auth_login(request, user)
		return  HttpResponse(status=200, content='User logged in!')
	except Exception as e:
		return JsonResponse({'message': str(e)})


def not_authorized(request):
	return render(request, 'not_authorized.html')


def login(request):
	return render(request, 'login.html')
