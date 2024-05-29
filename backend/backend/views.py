from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from users.models import User


def register(request):
	if (request.method != 'POST'):
		return render(request, 'register.html')

	try:
		User.objects.create(name=request.POST['name'], nickname=request.POST['nickname'])
		return redirect('/login/')
	except User.DoesNotExist:
		return HttpResponse("Internal Erro", status=500)
	except Exception as e:
		return HttpResponse(f"Invalid request: {str(e)}", status=400)


def login(request):
	if request.method == 'POST':
		try:
			user = authenticate(name=request.POST['username'])
			if user is not None:
				login(request, user)
				## TODO: Redirect to the home page
				return HttpResponse(f"Welcome {user.username}", status=200)
			else:
				return redirect('/register/')

		except Exception as e:
			return redirect('/register/')
	return render(request, 'login.html')



