from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
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
		'avatar': user.avatar.name,
	})


################################################################################
#							Routes
################################################################################


def uptade_nickname(request):
	if request.method != 'POST':
		return HttpResponse(status=405)

	nickname = request.POST.get('nickname')
	user = User.objects.get(username=request.user.username)
	user.nickname = nickname
	user.save()
	return HttpResponse(status=200)


def uptade_avatar(request):
	if request.method != 'POST':
		return HttpResponse(status=405)

	if 'avatar' not in request.FILES:
		return HttpResponse(status=400)

	user = User.objects.get(username=request.user.username)

	if user.avatar:
		user.avatar.delete(save=False)

	user.avatar = request.FILES.get('avatar')
	user.save()
	return HttpResponse(status=200)


def auxiliar(request):
	return render(request, 'auxiliar.html')


def populate(request):
	for i in range(1, 10):
		username = f'username{i}'
		nickname = f'nickname{i}'
		User.objects.create(nickname=nickname, username=username)
	return JsonResponse({'message': 'Populate success!'})

