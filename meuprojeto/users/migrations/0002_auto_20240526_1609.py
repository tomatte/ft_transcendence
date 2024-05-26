from django.db import migrations, transaction


def create_users(apps, schema_editor):
	user = apps.get_model('users', 'User')
	users = [
		{'name': 'user1', 'nickname': 'nickname1', 'online': True},
		{'name': 'user2', 'nickname': 'nickname2', 'online': True},
		{'name': 'user3', 'nickname': 'nickname3', 'online': True},
		{'name': 'user4', 'nickname': 'nickname4', 'online': True},
		{'name': 'user5', 'nickname': 'nickname5', 'online': True},
		{'name': 'user6', 'nickname': 'nickname6', 'online': True},
		{'name': 'user7', 'nickname': 'nickname7', 'online': True},
		{'name': 'user8', 'nickname': 'nickname8', 'online': True},
		{'name': 'user9', 'nickname': 'nickname9', 'online': True},
		{'name': 'user10', 'nickname': 'nickname10', 'online': True},
		{'name': 'user11', 'nickname': 'nickname11', 'online': False},
		{'name': 'user12', 'nickname': 'nickname12', 'online': False},
	]

	with transaction.atomic():
		for temp in users:
			user.objects.create(**temp)


def create_template(apps, schema_editor):
	template = apps.get_model('users', 'GamesTemplate')
	with transaction.atomic():
		template.objects.create(name='ranked')
		template.objects.create(name='normal')


def create_games(apps, schema_editor):
	User = apps.get_model('users', 'User')
	GamesTemplate = apps.get_model('users', 'GamesTemplate')
	Game = apps.get_model('users', 'Game')
	PlayerInGame = apps.get_model('users', 'PlayerInGame')

	users = list(User.objects.all())
	template = GamesTemplate.objects.get(name='ranked')

	with transaction.atomic():
		for i in range(0, 10, 2):
			game_instance = Game.objects.create(template=template)
			PlayerInGame.objects.create(game=game_instance, user=users[i], role='player1', winner=True)
			PlayerInGame.objects.create(game=game_instance, user=users[i + 1], role='player2', winner=False)


def add_friends(apps, schema_editor):
	User = apps.get_model('users', 'User')
	with transaction.atomic():
		user1 = User.objects.get(name='user1')
		user2 = User.objects.get(name='user2')
		user3 = User.objects.get(name='user3')
		user4 = User.objects.get(name='user4')
		user5 = User.objects.get(name='user5')

		user1.friends.add(user2, user3)
		user2.friends.add(user1, user3, user4, user5)


class Migration(migrations.Migration):
	dependencies = [
		('users', '0001_initial'),
	]

	operations = [
		migrations.RunPython(create_users),
		migrations.RunPython(create_template),
		migrations.RunPython(create_games),
		migrations.RunPython(add_friends),
	]
