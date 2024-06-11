from django.db import models
from users.models import User

# Create your models here.
class Match(models.Model):
	"""Model to represent a match in a tournament."""
	players = models.ManyToManyField('users.User', through='MatchPlayer')
	tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, blank=True, null=True)
	create_at = models.DateTimeField(auto_now_add=True)
	duration = models.DurationField(null=True, blank=True)


class MatchPlayer(models.Model):
	"""Model to represent a player in a match."""
	match = models.ForeignKey('Match', on_delete=models.CASCADE, related_name='matchMatch')
	user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='userMatch')
	score = models.IntegerField(default=0)
	winner = models.BooleanField(default=False)

	def __str__(self):
		return f'{self.user} and {self.match}'


class Tournament(models.Model):
	"""Model to represent a tournament."""
	ROLE_CHOICES = (
		('creating', 'creating'),
		('active', 'active'),
		('finalized', 'finalized'),
	)
	players = models.ManyToManyField('users.User', through='TournamentPlayer')
	winner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='winner', default=None, null=True, blank=True)
	number_players = models.IntegerField(default=8)
	total_rounds = models.IntegerField(default=3)
	status = models.CharField(max_length=10, choices=ROLE_CHOICES, default='creating')
	create_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.status


class TournamentPlayer(models.Model):
	"""Model to represent a player in a tournament."""
	tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, related_name='tournamentTournament')
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userTournament')

	def __str__(self):
		return f'{self.user} and {self.tournament}'


class TournamentBracket(models.Model):
	"""Model to represent a bracket in a tournament."""
	player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1Bracket')
	player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2Bracket')
	match = models.ForeignKey('Match', on_delete=models.CASCADE, related_name='matchBracket')
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='tournamentBracket')
	round = models.IntegerField()

	def __str__(self):
		return str(self.round)
