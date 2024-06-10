from django.http import JsonResponse, HttpResponse
from tournament.models import Tournament, TournamentBracket, Match
from users.models import User
from django.db.models import Prefetch

################################################################################
#						Auxiliaries
################################################################################


class CustomException(Exception):
	"""Classe de exceção customizada."""
	def __init__(self, msg: str, status: int) -> None:
		super().__init__(msg)
		self.status = status


def is_tournament_ready(tournament: object) -> bool:
	"""Função para verificar se um torneio está pronto para ser iniciado.

		args:
			tournament (OBJ): Torneio.

		return:
			bool (BOOL): True se o torneio estiver pronto para ser iniciado.
	"""

	if (tournament.players.count() != 8 and tournament.status != 'creating'):
		raise CustomException('Tournament is not ready to start!, status is not creating and tournament has not 8 players!', 405)


def is_tournament_finished(tournament: object) -> bool:
	"""Função para verificar se um torneio foi finalizado.

		args:
			tournament (OBJ): Torneio.

		return:
			bool (BOOL): True se o torneio foi finalizado.
	"""

	if tournament.status != 'active':
		raise CustomException('Tournament is not active!', 400)


def is_method_allowed(request: object, method: str) -> None:
	"""Função para verificar se o método é permitido.

		args:
			request (OBJ): Requisição do usuario.
			method (STR): Método permitido.
	"""

	if request.method != method:
		raise CustomException('Method not allowed!', 405)


def create_Bracket(tournament: object, round: int) -> None:
	"""Função para criar a tabela de um torneio.

		args:
			tournament (OBJ): Torneio.
	"""
	players = list(tournament.players.all())
	for i in range(0, len(players), 2):
		match = Match.objects.create(
			tournament=tournament,
		)
		match.players.add(players[i]),
		match.players.add(players[i + 1]),
		TournamentBracket.objects.create(
			player1=players[i],
			player2=players[i + 1],
			tournament=tournament,
			match=match,
			round=round,
		)


################################################################################
#							Routes
################################################################################


def create_tournament(request):
	"""Função para criar um torneio.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações do torneio.
	"""


	try:
		# is_method_allowed(request, 'POST')
		user = User.objects.get(username=request.user.username)
		tournament = Tournament.objects.create()
		tournament.players.add(user)
		return JsonResponse({'id': tournament.id}, status=201)
	except CustomException as e:
		return HttpResponse(status=e.status, content=str(e))


def add_player_tournament(request):
	"""Função para adicionar um jogador em um torneio.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""

	try:
		is_method_allowed(request, 'POST')
		tournament = Tournament.objects.get(id=request.POST.get('tournament_id'))
		player = User.objects.get(id=request.POST.get('player_id'))
		tournament.players.add(player)
		return HttpResponse(status=200)
	except CustomException as e:
		return HttpResponse(status=e.status, content=str(e))


def start_tournament(request):
	"""Função para iniciar um torneio.

		args:
			request (OBJ): Requisição do usuario.

		return:
			http (HTTP): status da requisição.
	"""

	try:
		is_method_allowed(request, 'POST')
		tournament = Tournament.objects.get(id=request.POST.get('tournament_id'))
		is_tournament_finished(tournament)
		tournament.status = request.POST.get('status')
		tournament.save()
		create_Bracket(tournament)
		return HttpResponse(status=200)
	except CustomException as e:
		return HttpResponse(status=e.status, content=str(e))


def get_tournament(request):
	"""Função para retornar um torneio.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações do torneio.
	"""

	try:
		# is_method_allowed(request, 'GET')
		# tournament = Tournament.objects.prefetch_related(
		# 	Prefetch('players', queryset=User.objects.all().only('id', 'nickname', 'avatar')),
		# 	Prefetch('tournamentBracket', queryset=TournamentBracket.objects.all().select_related('user1', 'user2', 'match'))

		# ).get(id=request.GET.get('id'))
		tournament = Tournament.objects.prefetch_related(
			Prefetch('players', queryset=User.objects.all().only('id', 'nickname', 'avatar')),
			Prefetch('tournamentBracket', queryset=TournamentBracket.objects.all().select_related('player1', 'player2', 'match'))

		).get(id=1)
		print('dsada')
		response = {
			"players": list(tournament.players.all().values('nickname', 'id')),
			"brackets": list(tournament.tournamentBracket.all())
		}

	except Tournament.DoesNotExist:
		return HttpResponse(status=404, content='Tournament not found!')
	except CustomException as e:
		return HttpResponse(status=e.status, content=str(e))
