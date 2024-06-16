from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from users.models import User, Friendship
from tournament.views import get_tournament, create_Bracket
from tournament.models import Tournament

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
		raise Exception('Method not allowed!')


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


def my_user(request):
	"""Função para retornar o usuário logado.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações do usuario.
	"""

	try:
		user = User.objects.prefetch_related('userMatch').get(username=request.user.username)
		return JsonResponse({
			'id': user.id,
			'name': user.username,
			'nickname': user.nickname,
			'friends': list(Friendship.objects.filter(from_user=user, status='accepted').values_list('to_user', flat=True)),
			'avatar': user.avatar.name,
		})

	except User.DoesNotExist:
		return JsonResponse({'message': 'User not found!'}, status=404)


def get_user(request):
	"""Função para retornar o usuário logado.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações do usuario.
	"""

	try:
		user = User.objects.prefetch_related('userMatch').get(id=request.GET.get('id'))
		return JsonResponse({
			'id': user.id,
			'name': user.username,
			'nickname': user.nickname,
			'friends': list(Friendship.objects.filter(from_user=user, status='accepted').values_list('to_user', flat=True)),
			'avatar': user.avatar.name,
		})

	except User.DoesNotExist:
		return JsonResponse({'message': 'User not found!'}, status=404)


def add_friend(request):
	"""Função para adicionar um amigo.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""

	if request.method != 'POST':
		return HttpResponse(status=405, content='Method not allowed!')

	try:
		is_valid_method(request, 'POST')
		my_user = User.objects.get(username=request.user.username)
		friends = User.objects.get(id=request.POST.get('friend_id'))
		Friendship.objects.create(from_user=my_user, to_user=friends, status='pending')
		return HttpResponse(status=200, content='Friend request sent!')

	except User.DoesNotExist:
		return HttpResponse(status=404, content='User not found!')
	except MethodNotAllowed as e:
		return HttpResponse(status=405, content=str(e))
	except Exception as e:
		return HttpResponse(status=400, content=str(e))


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


def friend_request_received(request):
	"""Função para retornar os pedidos de amizade recebidos.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações dos pedidos de amizade recebidos.
	"""

	user = User.objects.get(username=request.user.username)
	friends = Friendship.objects.filter(to_user=user, status='pending').values('id', 'from_user__nickname', 'to_user__nickname')
	return JsonResponse(list(friends), safe=False)


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


def response_friend_request(request):
	"""Função para aceitar um pedido de amizade.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""
	if request.method != 'POST':
		return HttpResponse(status=405, content='Method not allowed!')

	try:
		friendship = Friendship.objects.get(id=request.POST.get('friendship_id'))
		friendship.status = request.POST.get('status')
		friendship.save()
		return HttpResponse(status=200, content='Friend request accepted!')
	except User.DoesNotExist:
		return HttpResponse(status=404, content='User not found!')


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


