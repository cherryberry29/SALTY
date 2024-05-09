# Generated by Django 4.2.2 on 2024-05-09 16:27

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Epic',
            fields=[
                ('EpicName', models.CharField(default=None, max_length=20)),
                ('Epic_id', models.CharField(max_length=20, primary_key=True, serialize=False, unique=True)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('guide', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('projectname', models.CharField(max_length=100)),
                ('projectid', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('teamlead_email', models.EmailField(max_length=254, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Sprint',
            fields=[
                ('sprint', models.CharField(default=None, max_length=20, primary_key=True, serialize=False)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('sprint_goal', models.TextField(default='okay', null=True)),
                ('project', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='djapp.project')),
            ],
        ),
        migrations.CreateModel(
            name='Project_TeamMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('team_member_email', models.EmailField(max_length=254, null=True)),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='djapp.project')),
            ],
        ),
        migrations.CreateModel(
            name='issue',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('IssueName', models.CharField(default='', max_length=30)),
                ('issue_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('status', models.CharField(default='', max_length=30)),
                ('assignee', models.CharField(default='', max_length=30)),
                ('assigned_by', models.CharField(default='', max_length=30)),
                ('description', models.TextField(default='', max_length=30)),
                ('assigned_epic', models.ForeignKey(blank=True, default='', null=True, on_delete=django.db.models.deletion.SET_NULL, to='djapp.epic')),
                ('projectId', models.ForeignKey(blank=True, default='null', null=True, on_delete=django.db.models.deletion.SET_NULL, to='djapp.project')),
                ('sprint', models.ForeignKey(blank=True, default='null', null=True, on_delete=django.db.models.deletion.SET_NULL, to='djapp.sprint')),
            ],
        ),
        migrations.CreateModel(
            name='UserAccount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('usn', models.CharField(max_length=255)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
