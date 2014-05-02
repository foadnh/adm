from django.shortcuts import render

# Create your views here.
# from todo.models import Tasks

def home(request):
	context = {}
	return render(request, 'todo/index.html', context)