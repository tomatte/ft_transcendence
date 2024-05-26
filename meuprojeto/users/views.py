from django.shortcuts import render
from .models import User
from django.http import JsonResponse
# Create your views here.

def get_user(request, user_id):
	print(user_id)
	user = User.objects.get(id=user_id)
	response = {
		'status': '200',
		'id': user.id,
		'name': user.name,
		'nickname': user.nickname,
		'avatar': user.avatar.name,
		'online': user.online
	}

	return JsonResponse(response, status=200)


def user_friends(request, user_id):
	user = User.objects.get(id=user_id)
	friends = user.friends.all().values(
		'id',
		'name',
		'nickname',
		'avatar',
		'online'
	)

	response = list(friends)
	return JsonResponse({'status': '200', 'friends': response}, status=200)


# def user_games(request, user_id):
# 	user = User.objects.get(id=user_id)
# 	games = user.games.all().values(
# 		'id',
# 		'winner',
# 		'created_at',
# 		'template'
# 	)

# 	response = list(games)
# 	return JsonResponse({'status': '200', 'games': response}, status=200)
