from django.contrib import admin
from todo.models import Task, Root, CustomUser

# Register your models here.
admin.site.register(Task)
admin.site.register(Root)
admin.site.register(CustomUser)