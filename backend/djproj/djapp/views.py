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
from django.views.decorators.http import require_POST

@csrf_exempt 
def ReactViews(request):
    if request.method == 'GET':
        

        project_id = request.GET.get('projectId')

        try:
            pid1 = Project.objects.get(projectid=project_id)
            issues = issue.objects.filter(projectId=pid1,sprint="null")
            serializer = IssueSerializer(issues, many=True)

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
        issue_name = data.get('IssueName') 
        pid=data.get('projectId') 
        sprint=data.get('sprint') 
        assigned_epic=data.get('assigned_epic')
        issueType=data.get('IssueType')

        pid1 = Project.objects.get(projectid =pid)
        if sprint!="null":
            sprint=Sprint.objects.get(sprint=sprint)

        if issue_name:
            try:
                new_issue = issue.objects.create(IssueName=issue_name, projectId=pid1,sprint=sprint,assigned_epic=assigned_epic,IssueType=issueType)

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
        try:
            project_ins = Project.objects.get(projectid=projectid)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Project not found'}, status=404)
        
        if Project_TeamMember.objects.filter(team_member_email=email,project=project_ins).exists() or project_ins.teamlead_email == email :
            return JsonResponse({'error': 'Email is already associated with this project'}, status=400)

        else:
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
        project_ins = Project.objects.get(projectid=project_id)
        team_member = Project_TeamMember.objects.create(team_member_email=email,project=project_ins)
        team_member.save()
        return JsonResponse({'message': 'Invitation processed successfully'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    

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
    
@csrf_exempt
def create_issue(request):
    print("i got the issue")
    if request.method == 'POST':
        print("im inside post")
        data = json.loads(request.body)
        pid1 = Project.objects.get(projectid=data.get('ProjectId'))
        if data.get('Sprint') !="":
            sprint=Sprint.objects.get(sprint=data.get('Sprint'))
        else:
            sprint=None
        print("sprint",sprint)
        if data.get('Assigned_epic') !="":
             epic=Epic.objects.get(EpicName=data.get('Assigned_epic'))
        else:
            epic=None
        print("epic",epic)
        new_issue = issue.objects.create(
            IssueName=data.get('IssueName'),
            IssueType = data.get('IssueType'),
            sprint = sprint,
            projectId=pid1,
            status=data.get('Status', 'TODO'),
            assignee=data.get('Assignee',''),
            assigned_by=data.get('Assigned_by',""),
            description=data.get('Description',""),
            assigned_epic=epic
        )
        return JsonResponse({'message': 'Issue created successfully'})
    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

@csrf_exempt
def create_epic(request):
    print("i got the epic")
    if request.method == 'POST':
        print("im inside epc post")
        data = json.loads(request.body)
        pid1 = Project.objects.get(projectid=data.get('ProjectId'))
        new_epic = Epic.objects.create(
            EpicName = data.get('epicName', 'TODO'),
            projectId=pid1,
            status=data.get('Status', 'TODO'),
            assignee=data.get('Assignee',''),
            assigned_by=data.get('Assigned_by',""),
            description=data.get('Description',""),
            start_date=data.get('StartDate',""),
            end_date=data.get('DueDate',""),
        )
        return JsonResponse({'message': 'Issue created successfully'})
    else:
        return JsonResponse({'error': 'Only POST method allowed'}, status=405)

@csrf_exempt
def filters_function(request):
    print("I'm getting the function call..")
    if request.method == 'GET':
        projectid = request.GET.get('projectid')
        filter_type = request.GET.get('filter')
        status = request.GET.get('status')
        current_user = request.GET.get('currentUser')
        print(projectid, filter_type, status, current_user)

        if not projectid:
            return JsonResponse({"error": "Project ID is required"}, status=400)
        
        issues = []
        
        if projectid == 'allprojects':
                issues = list(issue.objects.filter(assignee=current_user).values())
        else:
            if filter_type == 'all_issues':
                issues = list(issue.objects.filter(projectId_id=projectid).values())
                
            elif filter_type == 'assigned_to_me':
                issues = list(issue.objects.filter(projectId_id=projectid, assignee=current_user).values())
                
            elif filter_type == 'unassigned':
                issues = list(issue.objects.filter(projectId_id=projectid, assignee='').values())
               
            elif filter_type == 'epics':
                issues = list(Epic.objects.filter(projectId_id=projectid).values())
                
            elif filter_type == 'Status':
                issues = list(issue.objects.filter(projectId_id=projectid, status=status).values())
                
            else:
                return JsonResponse({"error": "Invalid filter type"}, status=400)

        return JsonResponse(issues, safe=False)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)



@csrf_exempt
def update_issue(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            issue_obj = issue.objects.get(issue_id=data['issue_id'])
            issue_obj.IssueType = data.get('IssueType', issue_obj.IssueType)
            issue_obj.description = data.get('description', issue_obj.description)
            issue_obj.status = data.get('status', issue_obj.status)
            issue_obj.assignee = data.get('assignee', issue_obj.assignee)
            issue_obj.assigned_by = data.get('assigned_by', issue_obj.assigned_by)
            issue_obj.assigned_epic_id = data.get('assigned_epic_id', issue_obj.assigned_epic_id)
            issue_obj.sprint_id = data.get('sprint_id', issue_obj.sprint_id)
            issue_obj.projectId_id = data.get('projectId_id', issue_obj.projectId_id)
            issue_obj.file_field = data.get('file_field', issue_obj.file_field)
            issue_obj.save()
            return JsonResponse({'status': 'success'})
        except issue.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'Issue not found'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
@csrf_exempt
def create_sprint(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        project_id = data.get('project')
        sprint_name = data.get('sprint')

        try:
            pid1 = Project.objects.get(projectid=project_id)
        except Project.DoesNotExist:
            return JsonResponse({'message': 'Project not found'}, status=404)

        try:
            sprint_instance = Sprint.objects.get(sprint=sprint_name, project=pid1)
            print("statussssss", data.get('status'))

            sprint_instance.start_date = data.get('start_date')
            sprint_instance.end_date = data.get('end_date')
            sprint_instance.sprint_goal = data.get('sprint_goal')
            sprint_instance.status = data.get('status')
            sprint_instance.save()

            return JsonResponse({'message': 'Sprint updated successfully'})

        except Sprint.DoesNotExist:
            return JsonResponse({'message': 'Sprint not found'}, status=404)

    return JsonResponse({'message': 'Invalid request method'}, status=400)


@csrf_exempt
def update_sprintName(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            sprint_name = data.get('sprintName', None)
            pid1 = Project.objects.get(projectid=data.get("projectid"))

            if sprint_name:
                sprint = Sprint.objects.create(
                    sprint=sprint_name,project=pid1
                )

                return JsonResponse({"message": "Sprint name is required"})
            else:
                return JsonResponse({"message": "Sprint name is required"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format in request body"}, status=400)
    else:
        return JsonResponse({"message": "Only POST requests are allowed"}, status=405)
    

@csrf_exempt
def countsprints(request):
    if request.method == 'GET':
        project_id = request.GET.get('projectId')
        pid1 = Project.objects.get(projectid=project_id)
        if project_id:
            try:
                sprints = Sprint.objects.filter(project_id=pid1)
                sprints_count = sprints.count()
                serialized_sprints = SprintSerializer( sprints,many=True) 
                
                return JsonResponse({"count": sprints_count, "sprints": serialized_sprints.data}, status=200)
            except Exception as e:
                return JsonResponse({"error": str(e)}, status=500)
        else:
            return JsonResponse({"error": "Project ID is required"}, status=400)
    else:
        return JsonResponse({"error": "Only GET requests are allowed"}, status=405)

@csrf_exempt
def issuesOfSprint(request):
    if request.method == 'GET':
        project_id = request.GET.get('projectId')
        sprint = request.GET.get('sprintName')
        
        pid1 = Project.objects.get(projectid=project_id)
        sprint1 = Sprint.objects.get(sprint=sprint)
        print(pid1,sprint)
        try:
            issues = issue.objects.filter(projectId=pid1,sprint=sprint1)
            print("querysettt",issues)
            serializer = IssueSerializer(issues, many=True)
            print(serializer.data)
            return JsonResponse(serializer.data, safe=False)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    else:
        return JsonResponse({"error": "Project ID is required"}, status=400)

@csrf_exempt
def update_issueStatus(request):
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            issue_name = data.get('issue', None)
            new_status = data.get('status', None)
            
            pid1 = Project.objects.get(projectid=data.get("projectId"))
            print(data,issue_name,new_status)

            if issue_name:
                Issue = issue.objects.get(IssueName=issue_name,projectId=pid1)
                print(" motto",Issue)
                Issue.status = new_status
                Issue.save()

                return JsonResponse({"message": "Issue status updated"})
            else:
                return JsonResponse({"message": "issue name is required"}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({"message": "Invalid JSON format in request body"}, status=400)
    else:
        return JsonResponse({"message": "Only POST requests are allowed"}, status=405)
@csrf_exempt
def delete_sprint(request):
    print("inside delete")
    if request.method == 'GET':
        try:
            project_id = request.GET.get('projectId')
            sprint_name = request.GET.get('sprintName')
            pid1 = Project.objects.get(projectid=project_id)
            sprintInstance = Sprint.objects.get(sprint=sprint_name, project=pid1)
            sprintInstance.delete()
            return JsonResponse({'message': 'Sprint deleted successfully'}, status=200)
        except Sprint.DoesNotExist:
            return JsonResponse({'error': 'Sprint not found'}, status=404)
        except Project.DoesNotExist:
            return JsonResponse({'error': 'Project not found'}, status=404)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
    

