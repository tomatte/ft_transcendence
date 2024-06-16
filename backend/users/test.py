from django.test import TestCase, Client
from django.urls import reverse
from users.models import User

class MyUserViewTest(TestCase):
	def setUp(self):
		self.client = Client()
		users = [
			{'username': 'user0', 'password': '12345', 'nickname': 'user0'},
			{'username': 'user1', 'password': '12345', 'nickname': 'user1'},
			{'username': 'user2', 'password': '12345', 'nickname': 'user2'},
			{'username': 'user3', 'password': '12345', 'nickname': 'user3'},
		]
		for user in users:
			User.objects.create_user(**user)

	# def test_my_user_view(self):
	# 	self.client.login(username='user0', password='12345')
	# 	response = self.client.get(reverse('my_user'))
	# 	self.assertEqual(response.status_code, 200)
	# 	self.assertEqual(response.json()['name'], 'user0')

	# def test_my_user_view_not_logged(self):
	# 	response = self.client.get(reverse('my_user'))
	# 	self.assertEqual(response.status_code, 302)

	# def test_get_user_view(self):
	# 	self.client.login(username='user0', password='12345')
	# 	response = self.client.get(reverse('get_user'), {'id': 3})
	# 	self.assertEqual(response.status_code, 200)
	# 	self.assertEqual(response.json()['nickname'], 'user2')

	# def test_all_users_view(self):
	# 	self.client.login(username='user0', password='12345')
	# 	response = self.client.post(reverse('all_users'))
	# 	self.assertEqual(response.status_code, 200)

	# 	response_names = [user['nickname'] for user in response.json()]
	# 	for name in ['user0', 'user1', 'user2', 'user3']:
	# 		self.assertIn(name, response_names)

	# def test_add_friend_view(self):
	# 	self.client.login(username='user0', password='12345')
	# 	response = self.client.post(reverse('add_friend'), {'friend_id': 3})
	# 	self.assertEqual(response.status_code, 200)

	# 	response = self.client.post(reverse('add_friend'), {'friend_id': 3})
	# 	self.assertEqual(response.status_code, 400)

	def test_get_request_send_view(self):
		self.client.login(username='user0', password='12345')
		self.client.post(reverse('add_friend'), {'friend_id': 3})
		self.client.post(reverse('add_friend'), {'friend_id': 2})
		response = self.client.get(reverse('get_pending_friends'))
		print('\n\n\n\n')
		print(response.json())
		print('\n\n\n\n')
		# response_names = [user['to_user__nickname'] for user in response.json()]
		self.assertEqual(response.status_code, 200)

		response_ids = [user['id'] for user in response.json()]
		self.assertEqual(response_ids, [])
