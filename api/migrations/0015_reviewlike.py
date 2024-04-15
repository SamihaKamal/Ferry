# Generated by Django 5.0.1 on 2024-04-14 21:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_review_review_title'),
    ]

    operations = [
        migrations.CreateModel(
            name='ReviewLike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('review', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='api.review')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.user')),
            ],
        ),
    ]
