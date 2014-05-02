from django.db import models
from django.contrib.auth.models import User, UserManager

# Create your models here.
class Task(models.Model):
    title = models.CharField(max_length=50)
    detail = models.TextField(null=True, blank=True)
    done = models.IntegerField(default=0)
    parent = models.IntegerField(null=True, blank=True)
    subs = models.CommaSeparatedIntegerField(null=True, blank=True, max_length=500)
    users = models.TextField(null=True, blank=True)

class Root(models.Model):
	taskId = models.IntegerField(null=True, blank=True)

class CustomUser(User):
	"""User with app settings."""
	rootTasks = models.TextField(null=True, blank=True)

	# Use UserManager to get the create_user method, etc.
	objects = UserManager()

class Property(models.Model):
	name = models.CharField(max_length=50)
	done = models.BooleanField(default=False)