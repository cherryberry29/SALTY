from django.urls import path
from .views import *

urlpatterns = [
    path('create/', create_project, name='create_project'),
    path('add/', add_issue, name='add_issue'),
    path('generate_invitation_token/',  generate_invitation_token, name='generate_invitation_token'),
    path('verify_invitation_token/', verify_invitation_token, name='verify_invitation_token'),
    path('process_invitation_token/', process_invitation_token, name='process_invitation_token'),
    path('project_list/', project_list, name='project_list'),
    path('issues/', ReactViews, name='project-issues'),
    path('create_issue/', create_issue, name='create_issue'),
    path('create_epic/', create_epic, name='create_epic'),
    path('get_team_members/', get_team_members, name="get_team_members"),
    path('get_sprints/', get_sprints, name="get_sprints"),
    path('csrf_token/', csrf_token, name='csrf_token'),
    path('create_issue/', create_issue, name='create_issue'),
    path('filters_function/', filters_function, name='filters_function'),
    path('update_issue/', update_issue, name='update_issue'),
]
