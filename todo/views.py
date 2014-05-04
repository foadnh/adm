from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.template import RequestContext

def home(request):
	context = RequestContext(request)
	if request.method == 'POST':
		username = request.POST['username']
		password = request.POST['password']
		user = authenticate(username=username, password=password)
		if user:
			if user.is_active:
				login(request, user)
				return HttpResponseRedirect('/')
			else:
				return HttpResponse("Your Rango account is disabled.")
		else:
			return HttpResponse("Invalid login details supplied.")
	else:
		return render_to_response('todo/index.html', {}, context)

@login_required
def logout_user(request):
	logout(request)
	return HttpResponseRedirect('/')