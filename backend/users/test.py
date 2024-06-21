from django.test import TransactionTestCase, Client
from django.urls import reverse
from users.models import User

class MyUserViewTest(TransactionTestCase):
	def setUp(self):
		self.client = Client()
		self.create_user()

	def tearDown(self):
		User.objects.all().delete()

	@classmethod
	def create_user(self):
		users = [
			{'username': 'user1', 'password': '12345', 'nickname': 'user1'},
			{'username': 'user2', 'password': '12345', 'nickname': 'user2'},
			{'username': 'user3', 'password': '12345', 'nickname': 'user3'},
			{'username': 'user4', 'password': '12345', 'nickname': 'user4'},
		]
		for user in users:
			User.objects.create_user(**user)


	# def test_my_user_view(self):
	# 	self.client.login(username='user1', password='12345')

	# 	response = self.client.get(reverse('my_user'))
	# 	self.assertEqual(response.status_code, 200)
	# 	self.assertEqual(response.json()['name'], 'user1')


	# def test_my_user_view_not_logged(self):
	# 	response = self.client.get(reverse('my_user'))
	# 	self.assertEqual(response.status_code, 302)

	# def test_get_user_view(self):
	# 	self.client.login(username='user1', password='12345')

	# 	response = self.client.post(reverse('get_user'), {'user_id': 3})
	# 	self.assertEqual(response.status_code, 405)

	# 	response = self.client.get(reverse('get_user'), {'user_id': 3})
	# 	self.assertEqual(response.status_code, 200)
	# 	self.assertEqual(response.json()['nickname'], 'user3')


	# def test_all_users_view(self):
	# 	self.client.login(username='user1', password='12345')
	# 	response = self.client.post(reverse('all_users'))
	# 	self.assertEqual(response.status_code, 200)
	# 	response_names = [user['nickname'] for user in response.json()]
	# 	for name in ['user1', 'user2', 'user3', 'user4']:
	# 		self.assertIn(name, response_names)


	# def test_add_friend_view(self):
	# 	self.client.login(username='user1', password='12345')

	# 	response = self.client.get(reverse('add_friend'))
	# 	self.assertEqual(response.status_code, 405)

	# 	response = self.client.post(reverse('add_friend'), {'friend_id': 3})
	# 	self.assertEqual(response.status_code, 200)

	# 	response = self.client.post(reverse('add_friend'), {'friend_id': 3})
	# 	self.assertEqual(response.status_code, 400)


	# def test_accpet_friend_request_view(self):
	# 	self.client.login(username='user1', password='12345')
	# 	self.client.post(reverse('add_friend'), {'friend_id': 1})
	# 	self.client.post(reverse('add_friend'), {'friend_id': 2})

	# 	response = self.client.post(reverse('response_friend'), {'friend_id': 1, 'status': 'accepted'})
	# 	self.assertEqual(response.status_code, 200)


	# def test_get_request_received_view(self):
	# 	for username in ['user1', 'user3', 'user4']:
	# 		self.client.login(username=username, password='12345')
	# 		self.client.post(reverse('add_friend'), {'friend_id': 2})

	# 	self.client.login(username='user2', password='12345')
	# 	response = self.client.post(reverse(('get_receive_friends')))

	# 	self.assertEqual(response.status_code, 200)
	# 	response_names = [names['from_user__nickname'] for names in response.json()]
	# 	self.assertEqual(len(response_names), 3)

	# 	for name in ['user1', 'user3', 'user4']:
	# 		self.assertIn(name, response_names)


	# def test_get_request_send_view(self):
	# 	self.client.login(username='user1', password='12345')
	# 	self.client.post(reverse('add_friend'), {'friend_id': 2})
	# 	self.client.post(reverse('add_friend'), {'friend_id': 3})

	# 	response = self.client.get(reverse('get_pending_friends'))
	# 	response_names = [user['to_user__nickname'] for user in response.json()]

	# 	self.assertEqual(response.status_code, 200)
	# 	self.assertEqual(len(response_names), 2)
	# 	for name in ['user2', 'user3']:
	# 		self.assertIn(name, response_names)


	# def test_response_friend_request_view(self):
	# 	self.client.login(username='user3', password='12345')
	# 	self.client.post(reverse('add_friend'), {'friend_id': 1})

	# 	self.client.login(username='user2', password='12345')
	# 	self.client.post(reverse('add_friend'), {'friend_id': 1})

	# 	self.client.login(username='user1', password='12345')
	# 	response = self.client.post(reverse('response_friend'), {'friend_id': 3, 'status': 'accepted'})

	# 	self.assertEqual(response.status_code, 200)


	def test_get_list_friends_view(self):
		self.client.login(username='user1', password='12345')
		for i in range(2, 5):
			self.client.post(reverse('add_friend'), {'friend_id': i})

		for i in range(2, 4):
			self.client.login(username=f'user{i}',	password='12345')
			self.client.post(reverse('response_friend'), {'friend_id': 1, 'status': 'accepted'})

		self.client.login(username='user1', password='12345')
		response = self.client.post(reverse('get_list_friends'), {'user_id': 1})
		response_names = [user['to_user__nickname'] for user in response.json()]

		for name in ['user2', 'user3']:
			self.assertIn(name, response_names)

		self.assertNotIn('user4', response_names)


	def test_update_avatar(self):
		self.client.login(username='user', password='12345')
		self.client.post(reverse('uptade_nickname'), {'avatar': 'avatar.jpg'})

		

		# response = self.client.post(reverse('remove_friend'), {'friend_id': 2})
		# self.assertEqual(response.status_code, 200)

