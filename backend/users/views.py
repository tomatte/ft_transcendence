from django.http import JsonResponse, HttpResponse
from django.shortcuts import render
from users.models import User, Friendship

################################################################################
# 							Auxiliaries
################################################################################

def format_maths_list(matches: object) -> dict:
	"""Função para formatar a query de partidas.

		args:
			matches (OBJ ITERABLE): QuerySet de partidas.

		return:
			list (List): Lista de partidas formatada.
	"""

	return [
		{
			'id': match.id,
			'tournament': match.tournament.id,
			'create_at': match.create_at,
			'duration': match.duration,
		} for match in matches
	]


def format_friends_list(friends: object ) -> list:
	"""Função para formatar a query de amigos.

		args:
			friends (OBJ ITERABLE): QuerySet de amigos.

		return:
			list (List): Lista de amigos formatada.
	"""

	return [
		{
			'id': friend['id'],
			'from_user': friend['from_user__nickname'],
			'to_user': friend['to_user__nickname'],
		} for friend in friends
	]


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

	user = User.objects.prefetch_related('userMatch').get(username=request.user.username)
	return JsonResponse({
		'id': user.id,
		'name': user.username,
		'nickname': user.nickname,
		'friends': list(Friendship.objects.filter(from_user=user, status='accepted').values_list('to_user', flat=True)),
		'avatar': user.avatar.name,
	})


def friend_request_send(request):
	"""Função para retornar os pedidos de amizade enviados.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações dos pedidos de amizade enviados.
	"""

	user = User.objects.get(username=request.user.username)
	friends = Friendship.objects.filter(from_user=user, status='pending').values(
		'id',
		'from_user__nickname',
		'to_user__nickname'
	)
	return JsonResponse(format_friends_list(friends), safe=False)


def friend_request_received(request):
	"""Função para retornar os pedidos de amizade recebidos.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações dos pedidos de amizade recebidos.
	"""

	user = User.objects.get(username=request.user.username)
	friends = Friendship.objects.filter(to_user=user, status='pending').values('id', 'from_user__nickname', 'to_user__nickname')
	return JsonResponse(format_friends_list(friends), safe=False)


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
		my_user = User.objects.get(username=request.user.username)
		friends = User.objects.get(id=request.POST.get('friend_id'))
		Friendship.objects.create(from_user=my_user, to_user=friends, status='pending')
		return HttpResponse(status=200, content='Friend request sent!')
	except User.DoesNotExist:
		return HttpResponse(status=404, content='User not found!')


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


def populate(request):
	for i in range(1, 10):
		username = f'username{i}'
		nickname = f'nickname{i}'
		User.objects.create(nickname=nickname, username=username)
	return JsonResponse({'message': 'Populate success!'})


