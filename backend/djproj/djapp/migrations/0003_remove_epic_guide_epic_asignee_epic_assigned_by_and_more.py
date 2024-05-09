# Generated by Django 4.2.2 on 2024-05-09 18:20

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('djapp', '0002_issue_issuetype_issue_file_field'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='epic',
            name='guide',
        ),
        migrations.AddField(
            model_name='epic',
            name='asignee',
            field=models.CharField(default=None, max_length=80),
        ),
        migrations.AddField(
            model_name='epic',
            name='assigned_by',
            field=models.CharField(default=None, max_length=80),
        ),
        migrations.AddField(
            model_name='epic',
            name='discription',
            field=models.TextField(default='', max_length=300),
        ),
        migrations.AddField(
            model_name='epic',
            name='file_field',
            field=models.FileField(default='default_file.txt', upload_to='uploads/'),
        ),
        migrations.AddField(
            model_name='epic',
            name='status',
            field=models.CharField(default=None, max_length=20),
        ),
        migrations.AlterField(
            model_name='epic',
            name='Epic_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]
