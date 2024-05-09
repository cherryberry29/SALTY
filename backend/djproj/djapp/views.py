from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from rest_framework import status
from rest_framework.response import Response
from django.middleware.csrf import get_token
from djproj.settings import EMAIL_HOST_USER
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer
from django.core.mail import send_mail
from .serializers import *
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import generics
import json
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

@csrf_exempt 
def ReactViews(request):
    if request.method == 'GET':
        print("whyyyyyyyyyyyyyyyyyyyyy")
        # data = json.loads(request.body)
        # project_id=data.get('projectId')

        project_id = request.GET.get('projectId')
        print("heljoooo " + project_id)
        try:
            print("inside try block")
            pid1 = Project.objects.get(projectid=project_id)
            issues = issue.objects.filter(projectId=pid1)
            serializer = IssueSerializer(issues, many=True)
            print(serializer.data)
            # issue_data = [
            #     {
            #         'issueid': issue.issue_id,
            #         'issuename': issue.IssueName,
                    
            #     } 
            #     for issue in issues
            # ]
            # print(issue_data)

            return JsonResponse(serializer.data,safe=False)
        except Project.DoesNotExist:
            return JsonResponse({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)
        except issue.DoesNotExist:
            return JsonResponse({"error": "Issues not found for this project"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@csrf_exempt      
def add_issue(request):
  
    if request.method == 'POST':
        data = json.loads(request.body)
        issue_name = data.get('issueName') 
        pid=data.get('projectId') 
        pid1 = Project.objects.get(projectid =pid)
        print("heereee "+issue_name)
        print(pid)
        print(pid1)
        if issue_name:
            try:
                print("hhhhhh")
                new_issue = issue.objects.create(IssueName=issue_name, projectId=pid1)
                print(new_issue)
                
                print("after")
                return JsonResponse({'success': True, 'message': 'Issue added successfully', 'issue_id': new_issue.issue_id})
            except Exception as e:
                return JsonResponse({'success': False, 'message': str(e)})
        else:
            return JsonResponse({'success': False, 'message': 'Issue name is required'})
    else:
        return JsonResponse({'success': False, 'message': 'Invalid request method'})

@csrf_exempt 
def create_project(request):
    print("before")
    if request.method == 'POST':
        # Parse request body as JSON
        data = json.loads(request.body)
        project_name = data.get('projectname')
        teamlead = data.get('teamlead')
        projectid = data.get('projectid')


        if project_name:
            project = Project(projectid=projectid,projectname=project_name, teamlead_email=teamlead)
            project.save()
            
            # Create a dictionary with all parameters
            response_data = {
                'message': 'Project created successfully',
                'projectid': project.projectid,
                'projectname': project.projectname,
                'teamlead_email': project.teamlead_email,
            }
            
            return JsonResponse(response_data, status=201)
        else:
            return JsonResponse({'error': 'Project name is required'}, status=400)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
@csrf_exempt
def csrf_token(request):
   
    csrf_token = get_token(request)
    print(csrf_token)
    
    return JsonResponse({'csrfToken': csrf_token})
@csrf_exempt
def generate_invitation_token(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        projectid = data.get('projectid')  # Get projectid from the request data
        serializer = URLSafeTimedSerializer('your-secret-key')
        token = serializer.dumps(email)

        # Include projectid in the invitation link
        invitation_link = f'http://localhost:3000/accept-invitation?projectid={projectid}&token={token}'

        subject = "Join Project"
        message = f"Welcome! You're invited to join the project with ID {projectid}. Click the link below to accept:\n{invitation_link}"
        
        send_mail(subject, message, EMAIL_HOST_USER, [email], fail_silently=True)
        print("sent")
        return JsonResponse({'token': token})
       
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    

@csrf_exempt
def verify_invitation_token(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        token = data.get('token')
        print(token,"verify")
        serializer = URLSafeTimedSerializer('your-secret-key')
        try:
            email = serializer.loads(token, max_age=18000)  # Token expires in 5 hour
            return JsonResponse({'email': email})
        except SignatureExpired:
            return JsonResponse({'error': 'Token has expired'}, status=400)
        except BadSignature:
            return JsonResponse({'error': 'Invalid token'}, status=400)

@csrf_exempt
def process_invitation_token(request):
    if request.method == 'POST':
        # Extract email, project ID, and invitation token from the request data
        data = json.loads(request.body)
        email = data.get('email')
        project_id = data.get('projectid')
        print(project_id)
        try:
            project_ins = Project.objects.get(projectid=project_id)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Project not found'}, status=404)

        if Project_TeamMember.objects.filter(team_member_email=email,project=project_ins).exists() or project_ins.teamlead_email == email :
            return JsonResponse({'error': 'Email is already associated with this project'}, status=400)
    
        team_member = Project_TeamMember.objects.create(team_member_email=email,project=project_ins)
        
        team_member.save()

        return JsonResponse({'message': 'Invitation processed successfully'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
from django.http import JsonResponse
from .models import Project, Project_TeamMember

def project_list(request):
    if request.method == 'GET':
        print("in project list views.py")
        email = request.GET.get('email', None)
        if email:
            # Retrieve projects where the email matches the team lead
            projects_lead = Project.objects.filter(teamlead_email=email)

            # Retrieve projects where the email matches a team member
            projects_member = Project_TeamMember.objects.filter(team_member_email=email).values('project')  # Retrieve project IDs

            # Combine both lists of projects
            projects = list(projects_lead) + list(Project.objects.filter(pk__in=projects_member))

            # Create a list of project data including team lead information
            project_data = [
                {
                    'projectid': project.projectid,
                    'projectname': project.projectname,
                    'teamlead_email': project.teamlead_email
                } 
                for project in projects
            ]

            return JsonResponse(project_data, safe=False)
        else:
            return JsonResponse({'error': 'Email parameter is missing'}, status=400)
    else:
        return JsonResponse({'error': 'Only GET requests are allowed'}, status=405)

@csrf_exempt
def get_team_members(request):
    if request.method == 'GET':
        project_id = request.GET.get('projectid')
        if project_id:
            try:
                # Fetch all team members for the specified project from the database
                team_members_emails = Project_TeamMember.objects.filter(project__projectid=project_id).values_list('team_member_email', flat=True)
                
                # Fetch user details for team members
                team_members = UserAccount.objects.filter(email__in=team_members_emails).values('email', 'first_name', 'last_name')

                # Convert queryset to list of dictionaries
                team_members_list = list(team_members)

                return JsonResponse({'team_members': team_members_list})
            except Exception as e:
                return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)
        else:
            return JsonResponse({'error': 'Project ID is required'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def get_sprints(request):
    if request.method == 'GET':
        project_id = request.GET.get('projectid')
        # print("pid", project_id)
        if project_id:
            sprints = Sprint.objects.filter(project__projectid=project_id).values('sprint', 'start_date', 'end_date')
            sprint_list = list(sprints)
            # print(sprint_list)
            return JsonResponse({'sprint_in_project': sprint_list})
        else:
            return JsonResponse({'error': 'Project ID is required'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


