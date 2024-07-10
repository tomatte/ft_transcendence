from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, authenticate
from users.models import User
from django.contrib.auth import get_user_model

import requests


def get_access_token(code):
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


def get_intra_data(access_token):
	headers = {
		'Authorization': 'Bearer ' + access_token
	}
	response = requests.get('https://api.intra.42.fr/v2/me', headers=headers)
	if response.status_code != 200:
		raise Exception('Error getting user data')

	return (response.json())


def autenticate(request):
	if request.method != 'GET':
		return JsonResponse({'message': 'Invalid request'})
	try:
		access_token = get_access_token(request.GET.get('code'))
		user = authenticate(request, token=access_token)
		data_user = get_intra_data(access_token)
		# user, created = User.objects.get_or_create(username=data_user['login'], defaults=data_user)
		response = redirect('http://localhost:4009/')
		auth_login(request, user)
		return response
	except Exception as e:
		return JsonResponse({'message': str(e)})


def not_authorized(request):
	return render(request, 'not_authorized.html')


def login(request):
	return render(request, 'login.html')
