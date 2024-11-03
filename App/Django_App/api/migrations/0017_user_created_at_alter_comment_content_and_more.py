# Generated by Django 5.1.1 on 2024-11-02 10:56

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0016_remove_comment_dislikes_comment_dislikes'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='created_at',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
        migrations.AlterField(
            model_name='comment',
            name='content',
            field=models.TextField(max_length=500),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='content',
            field=models.TextField(max_length=280),
        ),
    ]
