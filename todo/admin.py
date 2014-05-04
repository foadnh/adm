from django.contrib import admin
from todo.models import Task, Root, CustomUser, Property, Assign, Log

# Register your models here.
admin.site.register(Task)
admin.site.register(Root)
admin.site.register(Property)
admin.site.register(Assign)
admin.site.register(Log)
# admin.site.register(CustomUser)
