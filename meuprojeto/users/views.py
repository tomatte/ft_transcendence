from django.shortcuts import render
from .models import User, Game, PlayerInGame
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

# Create your views here.
from django.db.models import Count, Q

user = User.objects.get(pk=1)

def get_user(request):
	"""Function to get user data

 		Args:
			request: request object

		returns:
			JsonResponse: response with user data
	"""
	players_in_game = PlayerInGame.objects \
		.filter(user=user) \
		.annotate(nun_matches=Count('game')) \
		.annotate(wins=Count('game', filter=Q(winner=True))) \
		.annotate(loses=Count('game', filter=Q(winner=False)))

	response = {
		'status': '200',
		'id': user.id,
		'name': user.name,
		'nickname': user.nickname,
		'avatar': user.avatar.name,
		'online': user.online,
		'wins': players_in_game[0].wins,
		'loses': players_in_game[0].loses,
		'games': players_in_game[0].nun_matches
	}

	return JsonResponse(response, status=200)


def update_avatar(request):
	"""Function to update user avatar

		args:
			request: request object

		returns:
			JsonResponse: response with status code
	"""
	if request.method == 'POST':
		user.avatar = request.FILES['avatar']
		user.save()
		return JsonResponse({'status': '200'}, status=200)
	return JsonResponse({'status': '400'}, status=400)


def update_nickname(request):
	"""Function to update user nickname

		args:
			request: request object

		returns:
			JsonResponse: response with status code
	"""
	if request.method == 'POST':
		user.nickname = request.POST['nickname']
		user.save()
		return JsonResponse({'status': '200'}, status=200)
	return JsonResponse({'status': '400'}, status=400)


def add_friend(request, other_id):
	"""Function to add a friend to user

		args:
			request: request object

		returns:
			JsonResponse: response with status code
	"""
	other = get_object_or_404(User, pk=other_id)
	user.friends.add(other)
	return JsonResponse({'status': '200'}, status=200)


def remove_friend(request, other_id):
	"""Function to remove a friend from user

		args:
			request: request object

		returns:
			JsonResponse: response with status code
	"""
	other = get_object_or_404(User, pk=other_id)
	user.friends.remove(other)
	return JsonResponse({'status': '200'}, status=200)


def user_friends(request):
	"""Function to get user friends

		args:
			request: request object

		returns:
			JsonResponse: response with user friends
	"""
	friends = user.friends.all().values(
		'id',
		'name',
		'nickname',
		'avatar',
		'online'
	)

	response = list(friends)
	return JsonResponse({'status': '200', 'friends': response}, status=200)


def user_historicy(request):
	"""Function to get user games history

		args:
			request: request object

		returns:
			JsonResponse: response with user games history
	"""
	games = Game.objects.filter(players=user).prefetch_related(
		'players',
		'playeringame_set'
	).annotate(nun_matches=Count('playeringame'))
	games_data = []
	for game in games:
		players_info = [
			{
				f'player{i}': player.name,
				'winner': game.playeringame_set.get(user=player).winner
			}
			for  i, player in enumerate(game.players.all())
		]
		games_data.append({
			'id': game.id,
			'template': game.template,
			'matches': game.nun_matches,
			'wiiners': game.playeringame_set.filter(user=user, winner=True).count(),
			'loser': game.playeringame_set.filter(user=user, winner=False).count(),
			'players': players_info,
		})

	response = games_data
	return JsonResponse({'status': '200', 'games': response}, status=200)
