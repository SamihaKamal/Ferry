# Generated by Django 5.0.1 on 2024-01-27 16:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_post_date_review_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comments',
            name='date',
            field=models.DateField(null=True, verbose_name='date'),
        ),
        migrations.AlterField(
            model_name='post',
            name='date',
            field=models.DateField(null=True, verbose_name='date'),
        ),
    ]