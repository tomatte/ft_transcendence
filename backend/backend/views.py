from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from users.models import User
import datetime
##redirect import
from django.shortcuts import redirect


def register(request):
	if (request.method != 'POST'):
		return HttpResponse("Invalid request", status=400)

	try:
		user = User.objects.create_user(name=request.POST['name'])
		user.save()
		return redirect('/login/')
	except User.DoesNotExist:
		return HttpResponse("Internal Erro", status=500)
	except Exception as e:
		return HttpResponse("Invalid request", status=400)

def login(request):
	if request.method == 'POST':
		try:
			print(request.POST)
			user = authenticate(name=request.POST['username'])
			print('user:')
			print(user)
			if user is not None:
				login(request, user)
				return HttpResponse(f"Welcome {user.username}", status=200)
			else:
				return HttpResponse("Invalid login", status=401)

		except Exception as e:
			return redirect('/rehgister/')
	return render(request, 'login.html')
