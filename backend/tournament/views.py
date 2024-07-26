from django.http import JsonResponse, HttpResponse
from tournament.models import Tournament, Match, MatchPlayer
from users.models import User
from django.db.models import Prefetch
from game.redis_models import TournamentRedis, MatchRedis
from asgiref.sync import sync_to_async

################################################################################
#						Auxiliaries
################################################################################


class CustomException(Exception):
	"""Classe de exceção customizada."""
	def __init__(self, msg: str, status: int) -> None:
		super().__init__(msg)
		self.status = status


def is_tournament_to_ready(tournament: object) -> bool:
	"""Função para verificar se um torneio está pronto para ser iniciado.

		args:
			tournament (OBJ): Torneio.

		return:
			bool (BOOL): True se o torneio estiver pronto para ser iniciado.
	"""

	if (tournament.players.count() != 4 and tournament.status != 'creating'):
		raise CustomException('Tournament is not ready to start!, status is not creating and tournament has not 8 players!', 405)


def is_tournament_to_finished(tournament: object) -> bool:
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


def format_players_bracket(bracket: object) -> dict:
	return {
		"player1": {
			"id": bracket.player1.id,
			"nickname": bracket.player1.nickname
		},
		"player2": {
			"id": bracket.player2.id,
			"nickname": bracket.player2.nickname
		},
	}

def get_tournament(request):
	"""Função para retornar um torneio.

		args:
			request (OBJ): Requisição do usuario.

		return:
			json (JSON): informações com as informações do torneio.
	"""

	# try:
	# 	# is_method_allowed(request, 'GET')
	# 	# tournament = Tournament.objects.prefetch_related(
	# 	# 	Prefetch('players', queryset=User.objects.all().only('id', 'nickname', 'avatar')),
	# 	# 	Prefetch('tournamentBracket', queryset=TournamentBracket.objects.all().select_related('user1', 'user2', 'match'))

	# 	# ).get(id=request.GET.get('id'))

	# 	tournament = Tournament.objects.prefetch_related(
	# 		Prefetch('players', queryset=User.objects.all().only('id', 'nickname', 'avatar')),
	# 		Prefetch('tournamentBracket', queryset=TournamentBracket.objects.all().select_related('player1', 'player2', 'match'))

	# 	).get(id=1)

	# 	backets = [{
	# 			f"bracket{i}": format_players_bracket(bracket)
	# 		} for i, bracket in enumerate(tournament.tournamentBracket.all())
	# 	]

	# 	response = {
	# 		"players": list(tournament.players.all().values('nickname', 'id')),
	# 		"brackets": backets
	# 	}
	# except Tournament.DoesNotExist:
	# 	return HttpResponse(status=404, content='Tournament not found!')
	# except CustomException as e:
	# 	return HttpResponse(status=e.status, content=str(e))
 
async def create_match(match_redis: MatchRedis):
    match = await sync_to_async(Match.objects.create)(
        create_at=match_redis.created_at,
        duration=None,
        type=match_redis.match_type
    )

    # Fetch or create User instances for the players
    player_left, _ = await sync_to_async(User.objects.get_or_create)(username=match_redis.player_left.username)
    player_right, _ = await sync_to_async(User.objects.get_or_create)(username=match_redis.player_right.username)

    # Create MatchPlayer instances for both players
    match_player_left = await sync_to_async(MatchPlayer.objects.create)(
        match=match,
        user=player_left,
        score=match_redis.player_left.points,
        winner=match_redis.player_left.winner
    )

    match_player_right = await sync_to_async(MatchPlayer.objects.create)(
        match=match,
        user=player_right,
        score=match_redis.player_right.points,
        winner=match_redis.player_right.winner
    )

    # Print the created objects (optional)
    print(f'Match: {match}')
    print(f'MatchPlayer Left: {match_player_left}')
    print(f'MatchPlayer Right: {match_player_right}')


async def create_tournament(tournament_redis: TournamentRedis):
    winner_username = (
		tournament_redis.final.player_left.username
		if tournament_redis.final.player_left.winner
		else tournament_redis.final.player_right.username
	)
    
    winner = await sync_to_async(User.objects.get)(username=winner_username)
    tournament = await sync_to_async(Tournament.objects.create)(
        winner=winner
    )

    # Create semi-final matches
    for match_redis in tournament_redis.semi_finals:
        await create_match(match_redis)

    # Create final match
    await create_match(tournament_redis.final)

    print(f'Tournament: {tournament}')