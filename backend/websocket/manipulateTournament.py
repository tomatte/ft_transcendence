
# from tournament.models import TournamentBracket, Match


class CustomException(Exception):
	"""Classe de exceção customizada."""
	def __init__(self, msg: str, status: int) -> None:
		super().__init__(msg)
		self.status = status



class ManipulateTournament():
	@staticmethod
	def is_tournament_to_ready(tournament: object) -> bool:
		"""Função para verificar se um torneio está pronto para ser iniciado.

			args:
				tournament (OBJ): Torneio.

			return:
				bool (BOOL): True se o torneio estiver pronto para ser iniciado.
		"""

		if (tournament.players.count() != 4 and tournament.status != 'creating'):
			raise CustomException('Tournament is not ready to start!, status is not creating and tournament has not 8 players!', 405)


	@staticmethod
	def is_tournament_finished(tournament: object) -> bool:
		"""Função para verificar se um torneio foi finalizado.

			args:
				tournament (OBJ): Torneio.

			return:
				bool (BOOL): True se o torneio foi finalizado.
		"""

		if tournament.status != 'active':
			raise CustomException('Tournament is not active!', 400)


	@staticmethod
	def create_match(tournament: object, players: list) -> object:
		"""Função para criar uma partida.

			args:
				tournament (OBJ): Torneio.
				players (LIST): Lista de jogadores.

			return:
				match (OBJ): Partida.
		"""

		match = Match.objects.create(tournament=tournament)
		for player in players:
			match.players.add(player)
		return match


	@staticmethod
	def create_tournament_bracket(tournament: object, match: object, players: list) -> object:
		"""Função para criar uma chave de torneio.

			args:
				tournament (OBJ): Torneio.
				match (OBJ): Partida.
				players (LIST): Lista de jogadores.
		"""

		TournamentBracket.objects.create(
				player1=players[0],
				player2=players[1],
				tournament=tournament,
				match=match,
				round=round,
			)


	@staticmethod
	def create_initial_bracket(tournament: object) -> None:
		"""Função para criar a tabela de um torneio inicial.

			args:
				tournament (OBJ): Torneio.
		"""

		if TournamentBracket.objects.filter(tournament=tournament, round=round).exists():
			return

		TournamentBracket.objects.filter(tournament=tournament)
		players = list(tournament.players.all())
		for i in range(0, len(players), 2):
			match = ManipulateTournament.create_match(tournament, [players[i], players[i + 1]])
			ManipulateTournament.create_tournament_bracket(tournament, match, [players[i], players[i + 1]])


	@staticmethod
	def create_bracket(tournament: object, round: int) -> None:
		"""Função para criar a tabela de um torneio.

			args:
				tournament (OBJ): Torneio.
		"""

		if round == 1:
			return ManipulateTournament.create_initial_bracket(tournament)

		players = []
		brackets = TournamentBracket.objects.select_related('matchBracket') \
											.filter(tournament=tournament)

		for bracket in brackets:
			match = bracket.matchBracket.all()
			players.append(match[0].winner)

		for i in range(0, len(players), 2):
			match = ManipulateTournament.create_match(tournament, [players[i], players[i + 1]])
			ManipulateTournament.create_tournament_bracket(tournament, match, [players[i], players[i + 1]])

