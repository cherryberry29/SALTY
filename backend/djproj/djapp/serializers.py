from djoser.serializers import UserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import *
User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'password','first_name','last_name')
class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = issue
        fields = '__all__'
class SprintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sprint
        fields = ['sprint', 'start_date', 'end_date', 'sprint_goal', 'project','status']