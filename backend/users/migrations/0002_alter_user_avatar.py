# Generated by Django 5.0.6 on 2024-08-01 21:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='avatar',
            field=models.ImageField(blank=True, default='../assets/images/players/avatars/default.webp', null=True, upload_to='api/images/avatars/'),
        ),
    ]