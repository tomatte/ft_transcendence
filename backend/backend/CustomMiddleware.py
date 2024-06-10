from django.shortcuts import redirect

class CustomMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		self.urls_free = ['/api/autenticate', '/api/login/', '/api/notAuthorized/']

	def __call__(self, request):
		if request.path in self.urls_free:
			return self.get_response(request)
		if not request.user.is_authenticated:
			return redirect('/api/notAuthorized/')
		return self.get_response(request)
