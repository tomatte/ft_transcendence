from channels.generic.websocket import WebsocketConsumer
from ManipulateTournament import ManipulateTournament
from tournament.models import Tournament
from users.models import User
import json

################################################################################
#							websocket
################################################################################


class Add_player_tournament(WebsocketConsumer):
	def connect(self):
		pass

	def receive(self, *, text_data):
		try:
			data = json.loads(text_data)
			tournament = Tournament.objects.get(pk=data['tournament_id'])
			player = User.objects.get(pk=data['player_id'])
			tournament.players.add(player)
			self.send(text_data=json.dumps({'status': 'success'}))

		except User.DoesNotExist as e:
			self.send(text_data=json.dumps({'status': 'error', 'message': 'Player does not exist'}))
		except Tournament.DoesNotExist as e:
			self.send(text_data=json.dumps({'status': 'error', 'message': 'Tournament does not exist'}))

	def disconnect(self, code):
		pass


class Remove_player_tournament(WebsocketConsumer):
	def connect(self):
		pass

	def receive(self, *, text_data):
		try:
			data = json.loads(text_data)

			tournament = Tournament.objects.get(pk=data['tournament_id'])
			player = User.objects.get(pk=data['player_id'])
			tournament.players.remove(player)

		except User.DoesNotExist as e:
			self.send(text_data=json.dumps({'status': 'error', 'message': 'Player does not exist'}))
		except Tournament.DoesNotExist as e:
			self.send(text_data=json.dumps({'status': 'error', 'message': 'Tournament does not exist'}))

	def disconnect(self, message):
		pass


class Create_Bracket(WebsocketConsumer):
	def connect(self):
		pass

	def receive(self, *, text_data):
		try:
			data = json.loads(text_data)
			tournament = Tournament.objects.get(pk=data['tournament_id'])
			ManipulateTournament.create_bracket(tournament, data['round'])
			self.send(text_data=json.dumps({'status': 'success'}))

		except Tournament.DoesNotExist as e:
			self.send(text_data=json.dumps({'status': 'error', 'message': 'Tournament does not exist'}))
		except User.DoesNotExist as e:
			self.send(text_data=json.dumps({'status': 'error', 'message': 'User does not exist'}))

	def disconnect(self, code):
		pass


class Start_tournament(WebsocketConsumer):
	def connect(self):
		pass

	def receive(self, *, text_data):

		try:
			data = json.loads(text_data)
			tournament = Tournament.objects.get(pk=data['tournament_id'])
			ManipulateTournament.is_tournament_to_ready(tournament)
			tournament.status = 'active'
			tournament.save()
			ManipulateTournament.create_bracket(tournament, 1)
			self.send(text_data=json.dumps({'status': 'success'}))

		except Tournament.DoesNotExist as e:
			self.send(text_data=json.dumps({'status': 'error', 'message': 'Tournament does not exist'}))
		except User.DoesNotExist as e:
			self.send(text_data=json.dumps({'status': 'error', 'message': 'User does not exist'}))

	def disconnect(self, code):
		pass


class Finish_tournament(WebsocketConsumer):
	def connect(self):
		pass

	def receive(self, *, text_data):
		try:
			data = json.loads(text_data)
			tournament = Tournament.objects.get(pk=data['tournament_id'])
			ManipulateTournament.is_tournament_finished(tournament)
			tournament.status = 'finished'
			tournament.save()
			self.send(text_data=json.dumps({'status': 'success'}))

		except Tournament.DoesNotExist as e:
			self.send(text_data=json.dumps({'status': 'error', 'message': 'Tournament does not exist'}))
		except User.DoesNotExist as e:
			self.send(text_data=json.dumps({'status': 'error', 'message': 'User does not exist'}))

	def disconnect(self, code):
		pass
