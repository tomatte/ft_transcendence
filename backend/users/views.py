from django.http import JsonResponse
from users.models import User


def all_users(request):
	users = User.objects.all().values(
		'id', 'nickname', 'avatar'
	)
	return JsonResponse(list(users), safe=False)


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
	user = User.objects.prefetch_related('userMatch').get(username=request.user.username)
	return JsonResponse({
		'id': user.id,
		'name': user.username,
		'nickname': user.nickname,
		'friends': get_friends(user.friends.all()),
	})


def populate(request):
	for i in range(1, 10):
		username = f'username{i}'
		nickname = f'nickname{i}'
		User.objects.create(nickname=nickname, username=username)
	return JsonResponse({'message': 'Populate success!'})

