# Generated by Django 5.0.4 on 2024-05-09 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('djapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='issue',
            name='IssueName',
            field=models.CharField(default='', max_length=30),
        ),
        migrations.AlterField(
            model_name='issue',
            name='assigned_by',
            field=models.CharField(default='', max_length=30),
        ),
        migrations.AlterField(
            model_name='issue',
            name='assignee',
            field=models.CharField(default='', max_length=30),
        ),
        migrations.AlterField(
            model_name='issue',
            name='description',
            field=models.TextField(default='', max_length=30),
        ),
    ]
