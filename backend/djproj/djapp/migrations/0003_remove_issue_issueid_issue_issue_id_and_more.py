# Generated by Django 4.2.2 on 2024-05-08 14:25

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('djapp', '0002_epic_sprint_issue'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='issue',
            name='IssueId',
        ),
        migrations.AddField(
            model_name='issue',
            name='issue_id',
            field=models.UUIDField(default=uuid.uuid4, editable=False, unique=True),
        ),
        migrations.AlterField(
            model_name='issue',
            name='assigned_by',
            field=models.CharField(default=None, max_length=30),
        ),
        migrations.AlterField(
            model_name='issue',
            name='assigned_epic',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_NULL, to='djapp.epic'),
        ),
        migrations.AlterField(
            model_name='issue',
            name='assignee',
            field=models.CharField(default=None, max_length=30),
        ),
        migrations.AlterField(
            model_name='issue',
            name='description',
            field=models.TextField(default=None, max_length=30),
        ),
        migrations.AlterField(
            model_name='issue',
            name='status',
            field=models.CharField(default='TODO', max_length=30),
        ),
    ]
