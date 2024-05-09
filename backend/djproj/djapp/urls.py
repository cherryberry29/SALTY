from django.urls import path
from .views import *

urlpatterns = [
    path('create/', create_project, name='create_project'),
    path('add/', add_issue, name='add_issue'),
    path('generate_invitation_token/', generate_invitation_token, name='generate_invitation_token'),
    path('verify_invitation_token/', verify_invitation_token, name='verify_invitation_token'),
    path('process_invitation_token/', process_invitation_token, name='process_invitation_token'),
    path('project_list/', project_list, name='project_list'),
    path('get_team_members/', get_team_members, name="get_team_members"),
    path('get_sprints/', get_sprints, name="get_sprints"),
    # path('project_dropdown_data/', project_dropdown_data, name="project_dropdown_data" ),
    path('csrf_token/', csrf_token, name='csrf_token'),   
    path('create_issue/', create_issue, name='create_issue'),
]

