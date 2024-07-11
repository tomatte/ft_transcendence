from django.shortcuts import redirect
from django.http import HttpResponse


class CustomMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		self.urls_free = ['/api/auth', '/api/login/', '/api/notAuthorized/']

	def __call__(self, request):
		if request.path in self.urls_free:
			return self.get_response(request)
		if request.user.is_authenticated:
			return self.get_response(request)
		return HttpResponse('Not authorized. Suma daqui mermão', status=401)

