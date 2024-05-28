from django.db import models


class User(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=25, unique=True, blank=False, null=False)
	nickname = models.CharField(max_length=25, default='', blank=True)
	avatar = models.ImageField(upload_to='avatars/', blank=True)
	online = models.BooleanField(default=False)
	friends = models.ManyToManyField('self', blank=True, through='Friendship')

	def __str__(self):
		return self.name


class Friendship(models.Model):
	id = models.AutoField(primary_key=True)
	user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user1')
	user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user2')
	create_at = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.user1.name} and {self.user2.name}"


class Match(models.Model):
	id = models.AutoField(primary_key=True)
	create_at = models.DateTimeField(auto_now_add=True)
	duration = models.DurationField(null=True, blank=True)
	tournament = models.ForeignKey('Tournament', on_delete=models.CASCADE, null=True, blank=True, related_name='tournamentMath')
	players = models.ManyToManyField(User, blank=True, through='MatchPlayer')


class MatchPlayer(models.Model):
	id = models.AutoField(primary_key=True)
	player = models.ForeignKey(User, on_delete=models.CASCADE)
	Match = models.ForeignKey(Match, on_delete=models.CASCADE)
	winner = models.BooleanField(default=False)
	score 	= models.IntegerField(default=0)

	def __str__(self):
		return f"User: {self.user.name} GameID: {self.game.id}"


class Tournament(models.Model):
	ROLE = (
		'created', 'Created',
		'playing', 'Playing',
		'finished', 'Finished',
	)
	id = models.AutoField(primary_key=True)
	number_players = models.IntegerField(default=0)
	winner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='winner')
	players = models.ManyToManyField(User, blank=True, through='PlayerInTournament')
	match = models.ManyToManyField(Match, blank=True, related_name='matchTournament')
	status = models.CharField(max_length=10, choices=ROLE, default='created')
	create_at = models.DateTimeField(auto_now_add=True)
	rounds = models.IntegerField(default=0)
	bracket = models.ForeignKey('Bracket', on_delete=models.CASCADE, null=True, blank=True)
	def __str__(self):
		return self.id


class Bracket(models.Model):
	players = models.ManyToManyField(User, blank=True, through='PlayerInBracket')
	rounds = models.IntegerField(default=0)
	create_at = models.DateTimeField(auto_now_add=True)
	match = models.ManyToManyField(Match, blank=True, related_name='matchBracket')


class TournamentPlayer(models.Model):
	id = models.AutoField(primary_key=True)
	player = models.ForeignKey(User, on_delete=models.CASCADE)
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)

	def __str__(self):
		return f"User: {self.user.name} TournamentID: {self.tournament.id}"

