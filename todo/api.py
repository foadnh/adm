__author__ = 'foad'
from tastypie.resources import ModelResource
from todo.models import Task, Root
from tastypie.authorization import Authorization

class TasksResource(ModelResource):
	"""
	API Facet
	"""
	class Meta:
		queryset = Task.objects.all()
		resource_name = 'task'
		allowed_methods = ['post', 'get', 'patch', 'delete', 'put']
		always_return_data = True
		authorization= Authorization()

class RootsResource(ModelResource):
	"""
	API Facet
	"""
	class Meta:
		queryset = Root.objects.all()
		resource_name = 'root'
		allowed_methods = ['post', 'get', 'patch', 'delete', 'put']
		always_return_data = True
		authorization= Authorization()