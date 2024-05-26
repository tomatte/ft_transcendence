from django.db import migrations


def create_users(apps, schema_editor):
	user = apps.get_model('users', 'User')
	user.bluk_create(
		[
			{'name': 'user1', 'name': 'intra1', 'nickname': 'nickname1', 'online': True},
			{'name': 'user2', 'name': 'intra2', 'nickname': 'nickname2', 'online': True},
			{'name': 'user3', 'name': 'intra3', 'nickname': 'nickname3', 'online': True},
			{'name': 'user4', 'name': 'intra4', 'nickname': 'nickname4', 'online': True},
			{'name': 'user5', 'name': 'intra5', 'nickname': 'nickname5', 'online': True},
			{'name': 'user6', 'name': 'intra6', 'nickname': 'nickname6', 'online': True},
			{'name': 'user7', 'name': 'intra7', 'nickname': 'nickname7', 'online': True},
			{'name': 'user8', 'name': 'intra8', 'nickname': 'nickname8', 'online': True},
			{'name': 'user9', 'name': 'intra9', 'nickname': 'nickname9', 'online': True},
			{'name': 'user10', 'name': 'intra10', 'nickname': 'nickname10', 'online': True},
			{'name': 'user11', 'name': 'intra11', 'nickname': 'nickname11', 'online': False},
		]
	)


def create_template(apps, schema_editor):
	template = apps.get_model('users', 'GamesTemplate')
	template.bluk_create(
		[
			{'name': 'ranqueada'},
			{'name': 'normal'},
		]
	)


def create_games(apps, schema_editor):
	User = apps.get_model('users', 'User')
	GamesTemplate = apps.get_model('users', 'GamesTemplate')
	Game = apps.get_model('users', 'Game')
	PlayerInGame = apps.get_model('users', 'PlayerInGame')

	users = list(User.objects.all())
	template = GamesTemplate.objects.get(name='ranqueada')

	for i in range(0, 10, 2):
		game_instance = Game.objects.create(template=template)
		PlayerInGame.objects.create(game=game_instance, user=users[i], role='player1', winner=True)
		PlayerInGame.objects.create(game=game_instance, user=users[i + 1], role='player2', winner=False)


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_rename_games_game_rename_users_user'),
    ]

    operations = [
    ]
