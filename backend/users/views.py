from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from users.models import User, Friendship
from tournament.views import get_tournament, create_Bracket
from tournament.models import Tournament, Match, MatchPlayer
from django.db.models import Prefetch


################################################################################
# 							Auxiliaries
################################################################################

class MethodNotAllowed(Exception):
	def __init__(self):
		super().__init__('Method not allowed!')


def is_valid_method(request, method):
	"""Função para verificar se o método é válido. Caso não seja, levanta uma exceção.

		args:
			request (OBJ): Requisição do usuario.
			method (STR): Método a ser verificado.

		return:
			None
	"""

	if request.method != method:
		raise MethodNotAllowed()


def get_all_friends(user):
	user1 = Friendship.objects.filter(from_user=user, status='accepted')
	user2 = Friendship.objects.filter(to_user=user, status='accepted')
	return user1.union(user2)

def get_all_combat_users(user1, user2):
	matchs = Match.objects.filter(players=user1).filter(players=user2)
	info_matchs = MatchPlayer.objects.filter(match__in=matchs)
	return info_matchs


def get_friends_list(user):
	"""Função para retornar a lista de amigos customizada

	Args:
		user (model.user): Query do usuario
  
	return:
		friends (Dict): Dicionario formatado com ranking, losses, winners against you
	"""

	data = []
	for friendship in get_all_friends(user):
		combats = get_all_combat_users(friendship.from_user, friendship.to_user)

		friend = friendship.from_user if friendship.from_user != user else friendship.to_user
		friend_winner = combats.filter(user=friend, winner=True).count()
		friend_losses = (combats.count() / 2) - friend_winner
  
		friend = {
			"nickname": friend.nickname,
			"winner": friend_winner,
			"losse": friend_losses
		}
  
		me = {
			"nickname": user.nickname,
			"winner": friend_losses,
			"loses": friend_winner
		}
		data.append({"friend": friend, "user": me})

	return data
		

# def format_maths_list(matches: object) -> dict:
# 	"""Função para formatar a query de partidas.

# 		args:
# 			matches (OBJ ITERABLE): QuerySet de partidas.

# 		return:
# 			list (List): Lista de partidas formatada.
# 	"""

# 	return [
# 		{
# 			'id': match.id,
# 			'tournament': match.tournament.id,
# 			'create_at': match.create_at,
# 			'duration': match.duration,
# 		} for match in matches
# 	]


# def format_friends_list(friends: object ) -> list:
# 	"""Função para formatar a query de amigos.

# 		args:
# 			friends (OBJ ITERABLE): QuerySet de amigos.

# 		return:
# 			list (List): Lista de amigos formatada.
# 	"""

# 	return [
# 		{
# 			'id': friend['id'],
# 			'from_user': friend['from_user__nickname'],
# 			'to_user': friend['to_user__nickname'],
# 		} for friend in friends
# 	]


################################################################################
#							Routes
################################################################################


##TESTADA
def my_user(request):
	"""Função para retornar o usuário logado.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações do usuario.
	"""

	try:
		is_valid_method(request, 'GET')
		user = User.objects.prefetch_related('userMatch').get(username=request.user.username)
		return JsonResponse({
			'id': user.id,
			'name': user.username,
			'nickname': user.nickname,
			'friends': list(Friendship.objects.filter(from_user=user, status='accepted').values_list('to_user', flat=True)),
			'avatar': user.avatar.name,
		})

	except MethodNotAllowed as e:
		return JsonResponse({'message': str(e)}, status=405)
	except User.DoesNotExist:
		return JsonResponse({'message': 'User not found!'}, status=404)


##TESTADA
def get_user(request):
	"""Função para retornar o usuário logado.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações do usuario.
	"""

	try:
		is_valid_method(request, 'GET')
		user = User.objects.prefetch_related('userMatch').get(id=request.GET['user_id'])

		return JsonResponse({
			'id': user.id,
			'name': user.username,
			'nickname': user.nickname,
			'avatar': user.avatar.name,
			# 'friends': get_friends(user),
		})

	except MethodNotAllowed as e:
		return JsonResponse({'message': str(e)}, status=405)
	except User.DoesNotExist:
		return JsonResponse({'message': 'User not found!'}, status=404)
	except KeyError:
		return JsonResponse({'message': 'User not found!'}, status=404)


##TESTADA
def all_users(request):
	"""Função para retornar todos os usuarios.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações de todos os usuarios.
	"""

	users = User.objects.all().values(
		'id', 'nickname', 'avatar'
	)
	return JsonResponse(list(users), safe=False)

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
		my_user = User.objects.get(username=request.user.username)
		friend = User.objects.get(id=request.POST['friend_id'])

		Friendship.objects.create(from_user=my_user, to_user=friend, status='pending')
		return HttpResponse({'msg': 'Friend request sent!'}, status=200)

	except User.DoesNotExist:
		return JsonResponse({'msg': 'User not found!'}, status=404)
	except MethodNotAllowed as e:
		return JsonResponse({'msg': str(e)}, status=405)
	except Exception as e:
		return JsonResponse({'msg': str(e)}, status=400)


##TESTADA
def friend_request_send(request):
	"""Função para retornar os pedidos de amizade enviados.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações dos pedidos de amizade enviados.
	"""
	try:
		user = User.objects.get(username=request.user.username)
		friends = Friendship.objects.filter(from_user=user, status='pending').values(
			'to_user__id',
			'to_user__nickname',
			'to_user__username',
		)

		return JsonResponse(list(friends), safe=False)

	except User.DoesNotExist:
		return JsonResponse({'message': 'User not found!'}, status=404)
	except Friendship.DoesNotExist:
		return JsonResponse({'message': 'Friendship not found!'}, status=404)

##TESTADA
def friend_request_received(request):
	"""Função para retornar os pedidos de amizade recebidos.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações dos pedidos de amizade recebidos.
	"""

	user = User.objects.get(username=request.user.username)
	friends = Friendship.objects.filter(to_user=user, status='pending').values(
		'from_user__id',
		'from_user__nickname',
		'from_user__username',
	)
	return JsonResponse(list(friends), safe=False)


##TESTADA
def get_list_friends(request):
	"""Função para retornar os pedidos de amizade recebidos.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações dos pedidos de amizade recebidos.
	"""

	try:
		is_valid_method(request, 'POST')
		user = User.objects.get(id=request.POST['user_id'])
		return JsonResponse(get_friends_list(user), safe=False)

	except MethodNotAllowed as e:
		return JsonResponse({'message': str(e)}, status=405)
	except User.DoesNotExist:
		return JsonResponse({'message': 'User not found!'}, status=404)
	except KeyError:
		return JsonResponse({'message': 'User not found!'}, status=404)
	except Exception as e:
		return JsonResponse({'message': str(e)}, status=404)


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
		my_user = User.objects.get(username=request.user.username)
		friend = User.objects.get(id=request.POST['friend_id'])
		friendship = Friendship.objects.get(from_user=friend, to_user=my_user, status='pending')
		friendship.status = request.POST['status']
		friendship.save()
		return HttpResponse(status=200, content='Friend request accepted!')


	except MethodNotAllowed as e:
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

	if request.method != 'POST':
		return HttpResponse(status=405)

	nickname = request.POST.get('nickname')
	user = User.objects.get(username=request.user.username)
	user.nickname = nickname
	user.save()
	return HttpResponse(status=200)


def uptade_avatar(request):
	"""Função para atualizar o avatar do usuario.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""

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





################################################################################
# Auxiliaries
################################################################################


def populate_users():
	for i in range(1, 10):
		username = f'username{i}'
		nickname = f'nickname{i}'
		User.objects.create(nickname=nickname, username=username)
	return JsonResponse({'message': 'Populate success!'})


def add_users_tournament():
	tournament = Tournament.objects.get(pk=1)
	for i in range(1, 8):
		user = User.objects.get(username=f'username{i}')
		tournament.players.add(user)

def populate(request):
	# populate_users()
	# create_tournament(request)
	# add_users_tournament()
	create_Bracket(Tournament.objects.get(pk=1), 1)
	get_tournament(request)

	return JsonResponse({'message': 'Populate success!'})


