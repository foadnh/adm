from django.contrib import admin
from todo.models import Task, Root, CustomUser, Property

# Register your models here.
admin.site.register(Task)
admin.site.register(Root)
admin.site.register(Property)
# admin.site.register(CustomUser)
