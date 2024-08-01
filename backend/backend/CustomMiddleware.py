from django.shortcuts import redirect
from django.http import HttpResponse


class CustomMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		self.urls_free = ['/api/auth/', '/api/login/', '/api/notAuthorized/', '/api/fake_login/', '/api/stats/']
		self.dynamic_urls_free = ['/api/fake_login']

	def __call__(self, request):
		if request.path in self.urls_free:
			return self.get_response(request)
		if request.user.is_authenticated:
			return self.get_response(request)
		if any(request.path.startswith(url) for url in self.dynamic_urls_free):
			return self.get_response(request)
		return HttpResponse('Not authorized.', status=401)

