from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
	"""User model with additional fields."""
	nickname = models.CharField(max_length=25)
	avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
	friends = models.ManyToManyField('self', through='Friendship', symmetrical=False)
	winners = models.IntegerField(default=0)
	losses = models.IntegerField(default=0)
	def __str__(self):
		return self.nickname


class Friendship(models.Model):
	from_user = models.ForeignKey('User', related_name='sent_requests', on_delete=models.CASCADE)
	to_user = models.ForeignKey('User', related_name='received_requests', on_delete=models.CASCADE)
	status = models.CharField(max_length=20, choices=(
		('pending', 'Pending'),
		('accepted', 'Accepted'),
		('rejected', 'Rejected')
	))
	created_at = models.DateTimeField(auto_now_add=True)

	class Meta:
		unique_together = ('from_user', 'to_user')

	def __str__(self):
		return f"{self.from_user} -> {self.to_user} ({self.status})"

