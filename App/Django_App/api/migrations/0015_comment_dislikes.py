# Generated by Django 5.1.1 on 2024-11-01 19:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_alter_comment_likes'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='disLikes',
            field=models.ManyToManyField(blank=True, related_name='disLiked_comments', to='api.user'),
        ),
    ]