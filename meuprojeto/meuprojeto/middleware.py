from django.shortcuts import redirect

class AuthenticationMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		# One-time configuration and initialization.

	def __call__(self, request):
		if request.path == '/login/' or request.path == '/register/':
			return self.get_response(request)
		if not request.user.is_authenticated:
			return redirect('login')
		response = self.get_response(request)
		return response
