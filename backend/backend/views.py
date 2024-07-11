from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login, authenticate
import requests
from environs import Env

env = Env()
env.read_env()

def get_access_token(code):
	data = {
		'grant_type': 'authorization_code',
		'client_id': env('S42_CLIENT_ID'),
		'client_secret': env('S42_CLIENT_SECRET'),
		'code': code,
		'redirect_uri': f"{env('SITE_URL')}/api/auth/"
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


def auth(request):
	if request.method != 'GET':
		return JsonResponse({'message': 'Invalid request'})
	try:
		access_token = get_access_token(request.GET.get('code'))
		user = authenticate(request, token=access_token)
		if user:
			auth_login(request, user)
			return redirect(env('SITE_URL'))
		else:
			return JsonResponse({'message': "forbbiden"})
	except Exception as e:
		return JsonResponse({'message': str(e)})


def not_authorized(request):
	return render(request, 'not_authorized.html')


def login(request):
	return render(request, 'login.html')
