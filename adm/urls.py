from django.conf.urls import patterns, include, url
from tastypie.api import Api
from todo.api import TasksResource, RootsResource, PropertiesResource, UsersResource, LogsResource

from django.contrib import admin
admin.autodiscover()

v1_api = Api(api_name='v1')
v1_api.register(TasksResource())
v1_api.register(RootsResource())
v1_api.register(PropertiesResource())
v1_api.register(UsersResource())
v1_api.register(LogsResource())

urlpatterns = patterns('',
	# Examples:
	# url(r'^$', 'adm.views.home', name='home'),
	# url(r'^blog/', include('blog.urls')),

	url(r'^admin/', include(admin.site.urls)),
	(r'^api/', include(v1_api.urls)),

	url(r'^$', 'todo.views.home', name = 'home'),
	url(r'^logout/$', 'todo.views.logout_user', name = 'logout'),
)