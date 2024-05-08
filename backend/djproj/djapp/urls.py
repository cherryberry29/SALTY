
from django.urls import path
from .views import *

from django.urls import path, include, re_path


urlpatterns = [
  
    path('create/', create_project, name='create_project'),
    path('generate_invitation_token/',  generate_invitation_token, name='generate_invitation_token'),
    path('verify_invitation_token/',verify_invitation_token, name='verify_invitation_token'),
    path('process_invitation_token/',process_invitation_token, name='process_invitation_token'),
    path('project_list/',project_list, name='project_list'),


    path('csrf_token/', csrf_token, name='csrf_token'),


    
    
]
