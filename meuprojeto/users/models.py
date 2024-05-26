from django.db import models


class Users(models.Model):
	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=25, unique=True)
	nickname = models.CharField(max_length=25)
	friends = models.ManyToManyField('self', blank=True)
	avatar = models.ImageField(upload_to='avatars/', blank=True)
	online = models.BooleanField(default=False)
	games = models.ManyToManyField('Games', blank=True)

	def __str__(self):
		return self.name


class GamesTemplate(models.Model):
	ROLE_CHOICES = (
		('ranqueada', 'ranqueada'),
		('normal', 'normal'),
	)

	id = models.AutoField(primary_key=True)
	name = models.CharField(max_length=10, choices=ROLE_CHOICES)

	def __str__(self):
		return self.name


class Games(models.Model):
	id = models.AutoField(primary_key=True)
	template = models.ForeignKey(GamesTemplate, on_delete=models.CASCADE)
	players = models.ManyToManyField(Users, blank=True, related_name='PlayerInGame')


class PlayerInGame(models.Model):
	ROLE_PLAYER = (
		('player1', 'player1'),
		('player2', 'player2'),
	)

	id = models.AutoField(primary_key=True)
	user = models.ForeignKey(Users, on_delete=models.CASCADE)
	game = models.ForeignKey(Games, on_delete=models.CASCADE)
	role = models.CharField(max_length=10, choices=ROLE_PLAYER)
	winner = models.BooleanField(default=False)

	def __str__(self):
		return f"User: {self.user.name} GameID: {self.game.id}"


class Friends(models.Model):
	id = models.AutoField(primary_key=True)
	user1 = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='user1')
	user2 = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='user2')

	class Meta:
		unique_together = ['user1', 'user2']

	def __str__(self):
		return f"{self.user1.name} - {self.user2.name}"
