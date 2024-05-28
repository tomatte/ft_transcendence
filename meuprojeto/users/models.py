from django.db import models


class User(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=25, unique=True, blank=False, null=False)
	nickname = models.CharField(max_length=25, default='', blank=True)
	avatar = models.ImageField(upload_to='avatars/', blank=True)
	online = models.BooleanField(default=False)
	friends = models.ManyToManyField('self', blank=True)

	def __str__(self):
		return self.name


class Match(models.Model):
	ROLE_CHOICES = (
		('ranked', 'ranked'),
		('normal', 'normal'),
	)
	id = models.AutoField(primary_key=True)
	template = models.CharField(max_length=10, choices=ROLE_CHOICES)
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
	id = models.AutoField(primary_key=True)
	players = models.ManyToManyField(User, blank=True, through='PlayerInTournament')
	match = models.ManyToManyField(Match, blank=True, related_name='matchTournament')

	def __str__(self):
		return self.name


class PlayerInTournament(models.Model):
	id = models.AutoField(primary_key=True)
	player = models.ForeignKey(User, on_delete=models.CASCADE)
	tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
	round_number = models.IntegerField(default=0)
	score = models.IntegerField(default=0)

	def __str__(self):
		return f"User: {self.user.name} TournamentID: {self.tournament.id}"

