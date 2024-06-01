from django.db import models
from django.contrib.auth.models import AbstractUser



class Friendship(models.Model):
	from_user = models.ForeignKey('User', related_name='sent_requests', on_delete=models.CASCADE)
	to_user = models.ForeignKey('User', related_name='received_requests', on_delete=models.CASCADE)
	status = models.CharField(max_length=20, choices=(
		('pending', 'Pending'),
		('accepted', 'Accepted'),
		('rejected', 'Rejected')
	))
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ('from_user', 'to_user')

	def __str__(self):
		return f"{self.from_user} -> {self.to_user} ({self.status})"


class User(AbstractUser):
	"""User model with additional fields."""
	name = models.CharField(max_length=25, unique=True)
	nickname = models.CharField(max_length=25)
	avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
	friends = models.ManyToManyField('self', through='Friendship', symmetrical=False)
	def __str__(self):
		return self.nickname


class Match(models.Model):
	"""Model to represent a match in a tournament."""
	players = models.ManyToManyField('User', through='MatchPlayer')
	tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, blank=True, null=True)
	create_at = models.DateTimeField(auto_now_add=True)
	duration = models.DurationField()


class MatchPlayer(models.Model):
	"""Model to represent a player in a match."""
	match = models.ForeignKey('Match', on_delete=models.CASCADE, related_name='matchMatch')
	user = models.ForeignKey('User', on_delete=models.CASCADE, related_name='userMatch')
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
	winner = models.ForeignKey('User', on_delete=models.CASCADE, related_name='winner', blank=True, null=True)
	number_players = models.IntegerField(default=0)
	total_rounds = models.IntegerField(default=0)
	status = models.CharField(max_length=10, choices=ROLE_CHOICES, default='creating')
	create_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.status


class Bracket(models.Model):
	"""Model to represent a bracket in a tournament."""
	user1 = models.ForeignKey('User', on_delete=models.CASCADE, related_name='user1Bracket')
	user2 = models.ForeignKey('User', on_delete=models.CASCADE, related_name='user2Bracket')
	match = models.ForeignKey('Match', on_delete=models.CASCADE, related_name='matchBracket')
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='tournament')
	round = models.IntegerField()

	def __str__(self):
		return str(self.round)
