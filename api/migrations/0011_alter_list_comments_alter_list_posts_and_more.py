# Generated by Django 5.0.1 on 2024-02-29 21:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_user_image_alter_comments_post_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='list',
            name='comments',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.comments'),
        ),
        migrations.AlterField(
            model_name='list',
            name='posts',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.post'),
        ),
        migrations.AlterField(
            model_name='list',
            name='review',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.review'),
        ),
        migrations.AlterField(
            model_name='list',
            name='tags',
            field=models.ManyToManyField(blank=True, to='api.tag'),
        ),
    ]
