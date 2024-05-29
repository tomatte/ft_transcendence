from django.db import models

class User(models.Model):
	name = models.CharField(max_length=25, unique=True)
	nickname = models.CharField(max_length=25)
	avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
	friends = models.ManyToManyField('self', through='Friend')
	def __str__(self):
		return self.nickname


class Friend(models.Model):
	friend = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendUser')
	create_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f'{self.user1} and {self.user2}'


class Match(models.Model):
	players = models.ManyToManyField(User, through='MatchPlayer')
	tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, blank=True, null=True)
	create_at = models.DateTimeField(auto_now_add=True)
	duraction = models.DurationField()


class MatchPlayer(models.Model):
	match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='matchMatch')
	user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='userMatch')
	score = models.IntegerField(default=0)
	winner = models.BooleanField(default=False)
	def __str__(self):
		return f'{self.user} and {self.match}'


class Tournament(models.Model):
	ROLE_CHOICES = (
		('creating', 'creating'),
		('active', 'active'),
		('finalized', 'finalized'),
	)
	winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='winner', blank=True, null=True)
	number_players = models.IntegerField(default=0)
	total_rounds = models.IntegerField(default=0)
	status = models.CharField(max_length=10, choices=ROLE_CHOICES, default='creating')
	create_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return self.name


class Bracket(models.Model):
	user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1Bracket')
	user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2Bracket')
	match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='matchBracket')
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='tournament')
	round = models.IntegerField()
	def __str__(self):
		return self.round

