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


class Game(models.Model):
	ROLE_CHOICES = (
		('ranked', 'ranked'),
		('normal', 'normal'),
	)
	id = models.AutoField(primary_key=True)
	template = models.CharField(max_length=10, choices=ROLE_CHOICES)
	players = models.ManyToManyField(User, blank=True, through='PlayerInGame')
	create_at = models.DateTimeField(auto_now_add=True)
	duration = models.DurationField(null=True, blank=True)


class PlayerInGame(models.Model):
	ROLE_CHOICES = (
		('player1', 'player1'),
		('player2', 'player2'),
	)

	id = models.AutoField(primary_key=True)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	game = models.ForeignKey(Game, on_delete=models.CASCADE)
	role = models.CharField(max_length=10, choices=ROLE_CHOICES)
	winner = models.BooleanField(default=False)
	points = models.IntegerField(default=0)

	def __str__(self):
		return f"User: {self.user.name} GameID: {self.game.id}"
