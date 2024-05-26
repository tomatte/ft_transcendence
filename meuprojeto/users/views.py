from django.shortcuts import render
from .models import User
from django.http import JsonResponse
# Create your views here.

def index(request):
	context = {
		'users': User.objects.all()
	}
	return render(request, 'index.html', context=context)


def all_friends(request, user_id):
	user = User.objects.get(id=user_id)
	friends = user.friends.all().values(
		'name',
		'nickname',
		'avatar',
		'online'
	)

	response = list(friends)
	return JsonResponse({'status': '200', 'friends': response})

