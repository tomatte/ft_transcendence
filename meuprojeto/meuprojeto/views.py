from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login

def login(request):
	if request.method == 'POST':
		username = request.POST.get('username')
		password = request.POST.get('password')
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return redirect('index')
		else:
			return render(request, 'login.html', {'error': 'Usuário ou senha inválidos'})

	return render(request, 'login.html')


def register(request):
	print(request.method)
	print(request.user.is_authenticated)
	print(request.user)
	if request.method == 'POST':
		username = request.POST.get('username')
		password = request.POST.get('password')
		# user = User.objects.create_user(username=username, password=password)
		return redirect('login')

	return render(request, 'register.html')
