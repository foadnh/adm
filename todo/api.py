__author__ = 'foad'
from tastypie.resources import ModelResource
from todo.models import Task, Root, Property, Log
from tastypie.authorization import Authorization
from django.contrib.auth.models import User

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

class PropertiesResource(ModelResource):
	"""
	API Facet
	"""
	class Meta:
		queryset = Property.objects.all()
		resource_name = 'property'
		allowed_methods = ['post', 'get', 'patch', 'delete', 'put']
		always_return_data = True
		authorization= Authorization()

class UsersResource(ModelResource):
	"""
	API Facet
	"""
	class Meta:
		queryset = User.objects.all()
		resource_name = 'user'
		allowed_methods = ['post', 'get', 'patch', 'delete', 'put']
		always_return_data = True
		authorization= Authorization()
		fields = ['id', 'username', 'first_name', 'last_name']

class LogsResource(ModelResource):
	"""
	API Facet
	"""
	class Meta:
		queryset = Log.objects.all()
		resource_name = 'log'
		allowed_methods = ['post', 'get', 'patch', 'delete', 'put']
		always_return_data = True
		authorization= Authorization()