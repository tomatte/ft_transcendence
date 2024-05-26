from django.shortcuts import render
from .models import User, Game
from django.http import JsonResponse
# Create your views here.
from django.db.models import Count

def get_user(request, user_id):
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


def user_historicy(request, user_id):
	user = User.objects.get(id=user_id)
	games = Game.objects.filter(players=user).prefetch_related(
		'players',
		'template',
		'playeringame_set'
	).annotate(matches=Count('playeringame'))
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
			'template': game.template.name,
			'matches': game.matches,
			'wiiners': game.playeringame_set.filter(user=user, winner=True).count(),
			'loser': game.playeringame_set.filter(user=user, winner=False).count(),
			'players': players_info,
		})

	response = games_data
	return JsonResponse({'status': '200', 'games': response}, status=200)
