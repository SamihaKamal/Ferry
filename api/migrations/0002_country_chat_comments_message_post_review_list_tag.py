# Generated by Django 5.0.1 on 2024-01-22 10:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='country name')),
                ('country_tag', models.CharField(max_length=50, null=True, verbose_name='country tag')),
            ],
        ),
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('to_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='to_user', to='api.user')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='from_user', to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment_body', models.TextField(verbose_name='comment text')),
                ('date', models.DateField(verbose_name='date')),
                ('likes_counter', models.IntegerField(verbose_name='likes')),
                ('replying_to', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.comments')),
                ('users', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment_body', models.CharField(max_length=250, verbose_name='comment body')),
                ('date', models.DateTimeField(verbose_name='date')),
                ('chat', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.chat')),
                ('from_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='message_from_user', to='api.user')),
                ('to_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='message_to_user', to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('caption', models.TextField(verbose_name='caption')),
                ('likes_counter', models.IntegerField(verbose_name='likes')),
                ('country_tag', models.CharField(max_length=50, null=True, verbose_name='country tag')),
                ('comments', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.comments')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='Review',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('review_body', models.TextField(verbose_name='review text')),
                ('likes_counter', models.IntegerField(verbose_name='likes')),
                ('country_tag', models.CharField(max_length=50, verbose_name='country tag')),
                ('comments', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.comments')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='List',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='list name')),
                ('comments', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.comments')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.user')),
                ('posts', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.post')),
                ('review', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.review')),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tag_text', models.CharField(max_length=100, verbose_name='tag name')),
                ('lists', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.list')),
                ('post', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.post')),
                ('review', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.review')),
            ],
        ),
    ]
