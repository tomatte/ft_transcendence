# from django.test import TransactionTestCase, Client
# from django.urls import reverse
# from users.models import User
# from tournament.models import Match, MatchPlayer

# class MyUserViewTest(TransactionTestCase):
# 	def setUp(self):
# 		self.client = Client()
# 		self.create_user()
# 		self.client.login(username='test_user1', password='12345')

# 	@classmethod
# 	def create_user(self):
# 		users = [
# 			{'username': 'test_user1', 'password': '12345', 'nickname': 'test_user1', 'winners': 2, 'losses': 1, 'avatar': "http://github/wagratom"},
# 			{'username': 'test_user2', 'password': '12345', 'nickname': 'test_user2', 'winners': 1, 'losses': 2},
# 			{'username': 'test_user3', 'password': '12345', 'nickname': 'test_user3'},
# 			{'username': 'test_user4', 'password': '12345', 'nickname': 'test_user4'},
# 		]
# 		for user in users:
# 			User.objects.create_user(**user)

# 	def send_friend_peding_for_test_user1(self):
# 		for user in ['test_user2', 'test_user3', 'test_user4']:
# 			self.client.login(username=f'{user}', password='12345')
# 			response = self.client.post(reverse('add_friend'), {'username': 'test_user1'})
# 			self.assertEqual(response.status_code, 200)

# 	def accpet_friend_peding_for_test_user1(self):
# 		self.client.login(username='test_user1', password='12345')
# 		for user in ['test_user3', 'test_user4']:
# 			response = self.client.post(reverse('response_friend'), {'username': f'{user}', 'status': 'Accepted'})
# 			self.assertEqual(response.status_code, 200)

# 	##############################################
# 	#		Route Name: my_user
# 	##############################################
# 	def test_my_user_route(self):
# 		response = self.client.get(reverse('my_user'))
# 		self.assertEqual(response.status_code, 200)
# 		expected_response = {
# 			"username": 'test_user1',
# 			"nickname": 'test_user1',
# 			"avatar": 'http://github/wagratom'
# 		}
# 		self.assertDictEqual(response.json(), expected_response)

# 	def test_my_user_route_erros(self):
# 		#Test invalid method
# 		response = self.client.post(reverse('my_user'))
# 		self.assertEqual(response.status_code, 405)
# 		self.client.login(username='test_user1', password='12345')

# 		#test user not loged
# 		self.client.logout()
# 		response = self.client.get(reverse('my_user'))
# 		self.assertEqual(response.status_code, 401)


# 	###############################################
# 	##		Route Name: get_user
# 	###############################################
# 	def test_get_user_route(self):
# 		response = self.client.post(reverse('get_user'), {'username': 'test_user2'})
# 		self.assertEqual(response.status_code, 200)
# 		expected_response = {
# 			"username": 'test_user2',
# 			"nickname": 'test_user2',
# 			"avatar": ''
# 		}
# 		self.assertDictEqual(response.json(), expected_response)

# 	def test_get_user_route_error(self):
# 		## test invalid mehod
# 		response = self.client.get(reverse('get_user'))
# 		self.assertEqual(response.status_code, 405)

# 		## test invalid username
# 		response = self.client.post(reverse('get_user'), {'username': 'fake'})
# 		self.assertEqual(response.status_code, 404)

# 		## test invalid parameter in post
# 		response = self.client.post(reverse('get_user'), {'errado': 'fake'})
# 		self.assertEqual(response.status_code, 400)

# 	###############################################
# 	##		Route Name: all_users
# 	###############################################
# 	def test_all_users_route(self):
# 		response = self.client.get(reverse('get_all_users'))
# 		self.assertEqual(response.status_code, 200)
# 		response_names = [user['nickname'] for user in response.json()]
# 		for name in ['test_user1', 'test_user2', 'test_user3', 'test_user4']:
# 			self.assertIn(name, response_names)

# 	def test_all_users_route_error(self):
# 		## invalid method
# 		response = self.client.post(reverse('get_all_users'))
# 		self.assertEqual(response.status_code, 405)


# 	##############################################
# 	#		Route Name: add_friend
# 	##############################################
# 	def test_add_friend_route(self):
# 		response = self.client.post(reverse('add_friend'), {'username': 'test_user2'})
# 		self.assertEqual(response.status_code, 200)

# 		response = self.client.post(reverse('add_friend'), {'username': 'test_user3'})
# 		self.assertEqual(response.status_code, 200)

# 	def test_add_friend_route_error(self):
# 		## test invalid method
# 		response = self.client.get(reverse('add_friend'))
# 		self.assertEqual(response.status_code, 405)

# 		## test invalid username
# 		response = self.client.post(reverse('add_friend'), {'username': 'fake'})
# 		self.assertEqual(response.status_code, 404)

# 		## test invalid parameter in post
# 		response = self.client.post(reverse('add_friend'), {'not-existend': 'fake'})
# 		self.assertEqual(response.status_code, 400)

# 	##############################################
# 	#		Route Name: response_friend ACCEPT
# 	##############################################
# 	def test_response_friend_route(self):
# 		self.send_friend_peding_for_test_user1()
# 		self.accpet_friend_peding_for_test_user1()
# 		response = self.client.get(reverse('get_list_friends'))
# 		self.assertEqual(response.status_code, 200)
# 		response_names = [user['nickname'] for user in response.json()]
# 		self.assertListEqual(['test_user3', 'test_user4'], response_names)
# 		self.assertNotIn('test_user2', response_names)

# 	def test_response_friend_route_erro(self):
# 		##test invalid method
# 		response = self.client.get(reverse('response_friend'))
# 		self.assertEqual(response.status_code, 405)
# 		response = self.client.post(reverse('response_friend'), {'username': 'fake', 'status': 'Accepted'})
# 		self.assertEqual(response.status_code, 404)
# 		response = self.client.post(reverse('response_friend'))
# 		self.assertEqual(response.status_code, 400)
# 		response = self.client.post(reverse('response_friend'), {'invalid': 'test_user2', 'status': 'Accepted'})
# 		self.assertEqual(response.status_code, 400)

# 	##############################################
# 	#		Route Name: friend_request_received
# 	##############################################
# 	def test_response_friend_route(self):
# 		self.send_friend_peding_for_test_user1()
# 		self.client.login(username='test_user1', password='12345')
# 		response = self.client.get(reverse('get_receive_friends'))
# 		self.assertEqual(response.status_code, 200)
# 		response_names = [user['from_user__nickname'] for user in response.json()]
# 		self.assertListEqual(['test_user2', 'test_user3', 'test_user4'], response_names)

# 	def test_response_friend_route_not_pedding(self):
# 		self.client.login(username='test_user2', password='12345')
# 		response = self.client.get(reverse('get_receive_friends'))
# 		self.assertEqual(response.status_code, 200)
# 		response_names = [user['from_user__nickname'] for user in response.json()]
# 		self.assertListEqual([], response_names)


# 	def test_response_friend_error(self):
# 		## test invalid method
# 		response = self.client.post(reverse('get_receive_friends'))
# 		self.assertEqual(response.status_code, 405)

