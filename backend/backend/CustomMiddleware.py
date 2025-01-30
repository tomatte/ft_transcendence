import re
from urllib.parse import urlparse
from django.shortcuts import redirect
from django.http import HttpResponse


class CustomMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		self.urls_free = ['/api/login', '/api/notAuthorized', '/api/stats']
		self.dynamic_urls_free = ['^/api/auth/[^/]+$']

	def __call__(self, request):
		path = urlparse(request.path).path
		path = path.rstrip("/")
		if path in self.urls_free:
			return self.get_response(request)
		if request.user.is_authenticated:
			return self.get_response(request)
		if any(re.match(pattern, path) for pattern in self.dynamic_urls_free):
			return self.get_response(request)
		return HttpResponse('Not authorized.', status=401)

