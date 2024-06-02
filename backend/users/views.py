from django.http import JsonResponse
from users.models import User
import requests


# def all_users(request):
# 	users = User.objects.all()
# 	users_list = [
# 		{
# 			'id': user.id,
# 			'name': user.name,
# 			'nickname': user.nickname,
# 			'avatar': user.avatar.name,
# 		} for user in users
# 	]
# 	return JsonResponse(users_list, safe=False)

################################################################################
# This block is used to return the my user information.
################################################################################

def get_friends(friends: object) -> dict:
	friends_list = [
		{
			'id': friend.id,
			'name': friend.name,
			'nickname': friend.nickname,
			'avatar': friend.avatar.name,
		} for friend in friends
	]
	return friends_list


def get_maths(matches: object) -> dict:
	matches_list = [
		{
			'id': match.id,
			'tournament': match.tournament.id,
			'create_at': match.create_at,
			'duration': match.duration,
		} for match in matches
	]
	return matches_list


def my_user(request):
	user = User.objects.prefetch_related('userMatch').get(name=request.user.name)
	print(user.userMatch.all().__dict__)
	print(user.userMatch.all().__dict__)
	return JsonResponse({
		'id': user.id,
		'name': user.name,
		'nickname': user.nickname,
		'friends': get_friends(user.friends.all()),
	})


# def populate():
# 	for i in range(1, 10):
# 		user = User.objects.create(name=f'user{i}', nickname=f'nickname{i}', avatar=f'user{i}.png')
