from django.db import models

# Create your models here.
class Match(models.Model):
	"""Model to represent a match in a tournament."""
	"""Model to represent a tournament."""
	ROLE_CHOICES = (
		('random', 'Random'),
		('semi_final', 'Semi-Final'),
		('final', 'Final'),
	)
	players = models.ManyToManyField('users.User', through='MatchPlayer')
	tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, default=None, blank=True, null=True)
	create_at = models.DateTimeField(auto_now_add=True)
	duration = models.DurationField(null=True, blank=True)
	type = models.CharField(max_length=10, choices=ROLE_CHOICES, default='random')

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
	winner = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='winner', default=None, null=True, blank=True)
	create_at = models.DateTimeField(auto_now_add=True)