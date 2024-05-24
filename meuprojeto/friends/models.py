from django.db import models

# Create your models here.
class Users(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=25)
    friends = models.ManyToManyField('self', blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    online = models.BooleanField(default=False)
    chats = models.ManyToManyField('Chats', blank=True)
    games = models.ManyToManyField('Games', blank=True)
    def __str__(self):
        return self.name


class Friends(models.Model):
    id = models.AutoField(primary_key=True)
    user1 = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='user2')
    def __str__(self):
        return self.user1.name + ' - ' + self.user2.name


class Chats(models.Model):
    id = models.AutoField(primary_key=True)
    messages = models.ManyToManyField('Messages', blank=True)
    def __str__(self):
        return str(self.id)


class Messages(models.Model):
    id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(Users, on_delete=models.CASCADE)
    content = models.TextField()
    def __str__(self):
        return self.sender.name + ' - ' + self.content


class Models_Games(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=25)
    def __str__(self):
        return self.name


class Games(models.Model):
    id = models.AutoField(primary_key=True)
    modelo = models.ForeignKey(Models_Games, on_delete=models.CASCADE)
    players = models.ManyToManyField(Users, blank=True)
    def __str__(self):
        return self.name

