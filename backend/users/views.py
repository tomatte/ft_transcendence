from django.http import JsonResponse, HttpResponse
from users.models import User, Friendship
from tournament.models import Match, MatchPlayer
from statistics import mean
import json
from django.db.models import Prefetch
from django.contrib.auth import logout as _logout
from django.shortcuts import redirect
from datetime import datetime
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync



################################################################################
# 							Auxiliaries
################################################################################


class ExceptionMethodNotAllowed(Exception):
	def __init__(self):
		super().__init__('Method not allowed!')


class ExceptionConflict(Exception):
	def __init__(self):
		super().__init__('Method not allowed!')


def send_notification_event(username, data):
	channel_layer = get_channel_layer()
	async_to_sync(channel_layer.group_send)(
		username,
		{
			'type': 'notification.new',
			'data': data,
		}
	)
 
def send_update_friends_notification(username):
	notification_data = {
		'name': 'update_friends',
	}
    
	channel_layer = get_channel_layer()
	async_to_sync(channel_layer.group_send)(
		username,
		{
			'type': "notification.dynamic",
			'data': notification_data,
		}
	)

def is_valid_method(request, method):
	"""Função para verificar se o método é válido. Caso não seja, levanta uma exceção.

		args:
			request (OBJ): Requisição do usuario.
			method (STR): Método a ser verificado.

		return:
			None
	"""

	if request.method != method:
		raise ExceptionMethodNotAllowed()


def format_friend_requests(friend_requests):
	formatted_response = []
	for item in friend_requests:
		created_at = item['created_at']
		if isinstance(created_at, datetime):
			item['created_at'] = created_at.strftime('%Y-%m-%d %H:%M:%S')
		formatted_response.append({
			"owner": {
				"username": item['from_user__username'],
				"nickname": item['from_user__nickname'],
				"avatar": item['from_user__avatar']
			},
			"time": item['created_at'],
			"type": "friend"	
		})
	return formatted_response

def get_global_ranking(player):
	users_by_winners = User.objects.all().order_by('-winners')
	return list(users_by_winners).index(player) + 1


class ManipulateUser:
	def __init__(self, username) -> None:
		self.me = User.objects.get(username=username)

	def position_ranking(self):
		all_players = User.objects.all().order_by('winners')
		return list(all_players).index(self.me) + 1

	def friends(self):
		user1 = Friendship.objects.filter(from_user=self.me, status='accepted')
		user2 = Friendship.objects.filter(to_user=self.me, status='accepted')
		return user1.union(user2)

	def combats_with_player(self, player):
		if not player:
			Exception('Error: get_all_combat_users() line 48: Player not found!')

		matchs = Match.objects.filter(players=self.me).filter(players=player)
		info_matchs = MatchPlayer.objects.filter(match__in=matchs)
		return info_matchs

	def rank_statistics(self):
		return {
			"username": self.me.username,
			"nickname": self.me.nickname,
			"avatar": self.me.avatar.name,
			"winners_against_you": 0,
			"losses_against_you": 0,
			"global_ranking": self.position_ranking(),
			"percent_winner": 0,
			"percent_losses": 0,
		}

	def profile(self):
		return {
			"username": self.me.username,
			"nickname": self.me.nickname,
			"avatar": self.me.avatar.name,
		}

	def add_friend(self, friend_username):
		friend = User.objects.get(username=friend_username)
		if (friend == self.me):
			raise Exception("you can't add it youself ")
		if Friendship.objects.filter(from_user=self.me, to_user=friend).exists():
			raise ExceptionConflict('Friend request already sent!')
		if Friendship.objects.filter(from_user=friend, to_user=self.me).exists():
			raise ExceptionConflict('Friend request already sent!')

		return Friendship.objects.create(from_user=self.me, to_user=friend, status='pending')

	def remove_friend(self, friend_username):
		friend = User.objects.get(username=friend_username)
		if (friend == self.me):
			raise Exception("you can't add it youself ")

		if Friendship.objects.filter(from_user=self.me, to_user=friend).exists():
			return Friendship.objects.filter(from_user=self.me, to_user=friend).delete()

		if Friendship.objects.filter(from_user=friend, to_user=self.me).exists():
			return Friendship.objects.filter(from_user=friend, to_user=self.me).delete()

	def response_friend(self, friend_username, status):
		friend = User.objects.get(username=friend_username)
		friendship = Friendship.objects.get(from_user=friend, to_user=self.me)
		friendship.status = status
		if friendship.status == 'accepted':
			friendship.save()
			send_update_friends_notification(self.me.username)
			send_update_friends_notification(friend_username)
		else:
			friendship.delete()
   
	def seding_friends(self):
		response = Friendship.objects.filter(from_user=self.me, status='pending').values(
			'to_user__id',
			'to_user__nickname',
			'to_user__username',
		)
		return list(response)

	def receive_friends(self):
		friend_requests = Friendship.objects.filter(to_user=self.me, status='pending').values(
			'from_user__nickname',
			'from_user__username',
			'from_user__avatar',
			'created_at'
		)
  
		return format_friend_requests(friend_requests)

	def player_statistics_by_you(self, friend: object) -> dict:
		if not friend:
			Exception('Error: get_statistics_by_you() line 100: Users not found!')

		if (self.me == friend):
			return self.rank_statistics()

		combats = self.combats_with_player(friend)
		total_matchs = combats.count() / 2
		friend_winner = combats.filter(user=friend, winner=True).count()
		friend_losses = total_matchs - friend_winner
		percent_winner = int((friend_winner / total_matchs) * 100 if total_matchs > 0 else 0)
		percent_losses = 100 - percent_winner

		return {
			"username": friend.username,
			"nickname": friend.nickname,
			"avatar": friend.avatar.name,
			"winners_against_you": int(friend_winner),
			"losses_against_you": int(friend_losses),
			"global_ranking": get_global_ranking(friend),
			"percent_winner": percent_winner,
			"percent_losses": percent_losses,
		}

	def get_friends_list(self):
		"""Função para retornar a lista de amigos customizada

		Args:
			user (model.user): Query do usuario

		return:
			friends (Dict): Dicionario formatado com ranking, losses, winners against you
		"""

		data = []
		for friendship in self.friends():
			friend = friendship.from_user if friendship.from_user != self.me else friendship.to_user
			data.append(self.player_statistics_by_you(friend=friend))
		return data

	def uptade_nickname(self, nickname):
		if (User.objects.filter(nickname=nickname).exists()):
			raise Exception('Nickname already exists!')
		self.me.nickname = nickname
		self.me.save()

	def uptade_avatar(self, avatar):
		if self.me.avatar:
			self.me.avatar.delete(save=False)
		self.me.avatar = avatar
		self.me.save()

	def table_ranking(self):
		all_players = User.objects.all().order_by('-winners')
		return [self.player_statistics_by_you(friend=play) for play in all_players]

	def number_of_matchs(self):
		return Match.objects.filter(players=self.me).count()

	def dictionary_matchs(self):
		return {
			'max_consecutives': 0,
			'all_matchs': 0,
			'all_points': 0,
			'average_points': 0,
		}

	def statistic_match(self):
		try:
			dict = self.dictionary_matchs()
			all_matchs = MatchPlayer.objects.filter(user=self.me).order_by('match__create_at')
			consecutives = 0
			points = list()
			for match in all_matchs:
				score = match.score
				dict['all_points'] += score
				points.append(score)
				if match.winner:
					consecutives += 1
				else:
					dict['max_consecutives'] = consecutives if consecutives > dict['max_consecutives'] else dict['max_consecutives']
					consecutives = 0
			dict['all_matchs'] = all_matchs.count()
			dict['average_points'] = mean(points) if points else 0
			return dict

		except MatchPlayer.DoesNotExist as e:
			return 0

	def statistics(self):
		data_match = self.statistic_match()
		data_match.update({
			"username": self.me.username,
			"nickname": self.me.nickname,
			"avatar": self.me.avatar.name,
			"winners": self.me.winners,
			"losses": self.me.losses,
			"global_ranking": self.position_ranking(),
			"percent_winner": 0,
			"percent_losses": 0,

		})
		return data_match

	def separate_players(self, query_obj):
		player1 = query_obj[0]
		if player1.user.nickname == self.me.nickname:
			return player1, query_obj[1]
		else:
			return query_obj[1], player1

	def historic(self):
		prefetch = Prefetch('matchMatch', queryset=MatchPlayer.objects.all())
		matches = Match.objects.prefetch_related(prefetch).order_by('create_at')
		data = []
		for _match in matches:
			me, other = self.separate_players(_match.matchMatch.all())
			data.append({
				"is_tournament": _match.tournament,
				"my_score": me.score,
				"winner": me.winner,
				"opponent_score": other.score,
				"opponent_username": other.user.username,
				"opponent_nickname": other.user.nickname,
				"opponent_avatar": other.user.avatar.name,
				"date": _match.create_at.strftime('%d/%m/%y'),
			})
		return data

################################################################################
#							Routes
################################################################################


##TESTADA
def get_user(request):
	"""Função para retornar o usuário logado.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações do usuario.
	"""

	try:
		is_valid_method(request, 'POST')
		return JsonResponse(ManipulateUser(username=request.POST['username']).profile())
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({'message': str(e)}, status=405)
	except User.DoesNotExist:
		return JsonResponse({'message': 'User not found!'}, status=404)
	except KeyError:
		return JsonResponse({'msg': 'Username not send'}, status=400)


##TESTADA
def my_user(request):
	"""Função para retornar os dados do usuario.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações do usuario.
	"""

	try:
		is_valid_method(request, 'GET')
		return JsonResponse(ManipulateUser(username=request.user.username).profile())
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({'message': str(e)}, status=405)


def set_pending_friend_status(username, users: list):
	friend_requests_sent = ManipulateUser(username=username).seding_friends()
	friend_requests_usernames = {request['to_user__username'] for request in friend_requests_sent}
	for user in users:
		if user['username'] in friend_requests_usernames:
			user['friend_status'] = "pending"
   
def set_friend_status(username, users: list):
	friends = ManipulateUser(username=username).friends()
	friends_usernames = {
		friend.from_user.username
		if friend.from_user.username != username
		else friend.to_user.username
		for friend in friends
	}
 
	for user in users:
		if user['username'] in friends_usernames:
			user['friend_status'] = "friend"
		else:
			user['friend_status'] = "not_friend"
  
##TESTADA
def all_users(request):
	"""Função para retornar todos os usuarios.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações de todos os usuarios.
	"""
	try:
		is_valid_method(request, "GET")
		users = User.objects.all().values('username', 'nickname', 'avatar').order_by('winners')
		users_list = list(users)
		set_friend_status(request.user.username, users_list)
		set_pending_friend_status(request.user.username, users_list)
		return JsonResponse(users_list, status=200, safe=False)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({'message': str(e)}, status=405)


##TESTADA
def add_friend(request):
	"""Função para adicionar um amigo.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""
	try:
		is_valid_method(request, 'POST')
		data = json.loads(request.body)
		friend_username = data.get('username')
		friendship = ManipulateUser(username=request.user.username).add_friend(friend_username)
		send_notification_event(friend_username, {
			'type': 'friend',
			'owner': ManipulateUser(username=request.user.username).profile(),
			'time': friendship.created_at.strftime('%Y-%m-%d %H:%M:%S'),
		})
		return JsonResponse({'msg': 'Friend request sent!'}, status=200)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({'msg': str(e)}, status=405)
	except ExceptionConflict as e:
		return JsonResponse({'msg': str(e)}, status=409)
	except User.DoesNotExist:
		return JsonResponse({'msg': 'User not found!'}, status=404)
	except KeyError:
		return JsonResponse({'msg': 'Username not send'}, status=400)
	except Exception as e:
		return JsonResponse({'msg': str(e)}, status=400)


#Testada
def remove_friend(request):
	"""Função para adicionar um amigo.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""
	try:
		is_valid_method(request, 'DELETE')
		data = json.loads(request.body)
		ManipulateUser(username=request.user.username).remove_friend(data.get('username'))
		return JsonResponse({'msg': 'Friend request sent!'}, status=200)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({'msg': str(e)}, status=405)
	except ExceptionConflict as e:
		return JsonResponse({'msg': str(e)}, status=409)
	except User.DoesNotExist:
		return JsonResponse({'msg': 'User not found!'}, status=404)
	except KeyError:
		return JsonResponse({'msg': 'Username not send'}, status=400)
	except Exception as e:
		return JsonResponse({'msg': str(e)}, status=400)


##TESTADA
def response_friend(request):
	"""Função para Responder um Pedido de amizade.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""
	try:
		is_valid_method(request, 'POST')
		ManipulateUser(username=request.user.username).response_friend(request.POST['username'], request.POST['status'])
		return JsonResponse({'msg': 'Friend request sent!'}, status=200)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({'msg': str(e)}, status=405)
	except User.DoesNotExist:
		return JsonResponse({'msg': 'User not found!'}, status=404)
	except KeyError:
		return JsonResponse({'msg': 'Username not send'}, status=400)
	except Exception as e:
		return JsonResponse({'msg': str(e)}, status=400)


##TESTADA
def get_list_friends(request):
	"""Função para retornar os pedidos de amizade recebidos.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações dos pedidos de amizade recebidos.
	"""

	try:
		is_valid_method(request, 'GET')
		return JsonResponse(ManipulateUser(username=request.user.username).get_friends_list(), safe=False)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({'message': str(e)}, status=405)
	except Friendship.DoesNotExist:
		return JsonResponse({'message': 'You do not have friends'}, status=404)
	except KeyError:
		return JsonResponse({'message': 'User not found!'}, status=404)
	except Exception as e:
		return JsonResponse({'message': str(e)}, status=404)


def friend_request_send(request):
	"""Função para retornar os pedidos de amizade enviados.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações dos pedidos de amizade enviados.
	"""
	try:
		is_valid_method(request, "GET")
		return JsonResponse(ManipulateUser(request.user.username).seding_friends(), safe=False)
	except ExceptionMethodNotAllowed:
		return JsonResponse({'message': 'Invalid Method!'}, status=405)
	except Exception as e:
		return JsonResponse({'message': str(e)}, status=500)



def friend_request_received(request):
	"""Função para retornar os pedidos de amizade recebidos.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações dos pedidos de amizade recebidos.
	"""
	try:
		is_valid_method(request, "GET")
		return JsonResponse(ManipulateUser(request.user.username).receive_friends(), safe=False)
	except ExceptionMethodNotAllowed:
		return JsonResponse({'message': 'Invalid Method!'}, status=405)
	except Exception as e:
		return JsonResponse({'message': str(e)}, status=500)




##TESTADA
def response_friend(request):
	"""Função para aceitar um pedido de amizade.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""

	try:
		is_valid_method(request, 'POST')
		data = json.loads(request.body)
		friend_username = data.get('username')
		status = data.get('status')
		if friend_username is None:
			return JsonResponse({'error': 'Missing username or status in the request'}, status=400)
		ManipulateUser(username=request.user.username).response_friend(friend_username, status)
		return HttpResponse(status=200)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({"msg": str(e)}, status=405)
	except Friendship.DoesNotExist:
		return JsonResponse({"msg": 'Friend request not found!'}, status=404)
	except User.DoesNotExist as e:
		return JsonResponse({"msg": 'User not found!'}, status=404)
	except KeyError as e:
		return JsonResponse({"msg": 'Missing parameters!'}, status=400)


##TESTADA
def uptade_nickname(request):
	"""Função para atualizar o nickname do usuario.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""

	try:
		is_valid_method(request, 'POST')
		nickname = json.loads(request.body).get('nickname')

		if not nickname:
			raise KeyError('Nickname not send')

		if len(nickname) > 40:
			return JsonResponse({"msg": 'Nickname too long!'}, status=400)

		ManipulateUser(username=request.user.username).uptade_nickname(nickname)
		return HttpResponse(status=200)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({"message": str(e)}, status=405)
	except KeyError as e:
		return JsonResponse({"message": 'Nickname not send'}, status=400)
	except Exception as e:
		return JsonResponse({"message": str(e)}, status=209)


def uptade_avatar(request):
	"""Função para atualizar o avatar do usuario.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""
	try:
		is_valid_method(request, 'POST')
		ManipulateUser(username=request.user.username).uptade_avatar(request.FILES.get('avatar'))
		return HttpResponse(status=200)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({"msg": str(e)}, status=405)
	except KeyError as e:
		return JsonResponse({"msg": 'Missing parameters!'}, status=400)


def ranking(request):
	try:
		is_valid_method(request, 'GET')
		return JsonResponse(ManipulateUser(username=request.user.username).table_ranking(), safe=False)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({"msg": str(e)}, status=405)
	except Exception as e:
		print(e)
		return JsonResponse({"msg": str(e)}, status=400)


def statistics(request):
	try:
		is_valid_method(request, 'GET')
		return JsonResponse(ManipulateUser(username=request.user.username).statistics(), safe=False)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({"msg": str(e)}, status=405)
	except Exception as e:
		return JsonResponse({"msg": str(e)}, status=400)


def historic(request):
	try:
		is_valid_method(request, 'GET')
		return JsonResponse(ManipulateUser(username=request.user.username).historic(), safe=False)
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({"msg": str(e)}, status=405)
	except Exception as e:
		return JsonResponse({"msg": str(e)}, status=400)
	except Match.DoesNotExist as e:
		return JsonResponse({"msg": {}}, status=200)
	except MatchPlayer.DoesNotExist as e:
		return JsonResponse({"msg": {}}, status=200)


def logout(request):
	try:
		_logout(request)
		response = redirect('/')
		response.delete_cookie('sessionid')
		response.delete_cookie('csrftoken')
		response.delete_cookie('username')
		response.delete_cookie('nickname')
		response.delete_cookie('avatar')
		return response
	except ExceptionMethodNotAllowed as e:
		return JsonResponse({'msg': str(e)}, status=405)
	except Exception as e:
		return JsonResponse({'msg': str(e)}, status=400)
