from django.db import models
from django.contrib.auth.models import AbstractBaseUser,PermissionsMixin,BaseUserManager
import random
import uuid
import string


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)

        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

    
class UserAccount(AbstractBaseUser,PermissionsMixin):
    email=models.EmailField(max_length=255,unique=True)
    first_name=models.CharField(max_length=255)
    last_name=models.CharField(max_length=255)
    is_active=models.BooleanField(default=True)
    is_staff=models.BooleanField(default=False)
    usn=models.CharField(max_length=255)


    objects = UserAccountManager()
    USERNAME_FIELD= 'email'
    REQUIRED_FIELDS=['first_name','last_name']

    def get_full_name(self):
        return self.first_name
   
    def get_short_name(self):
        return self.first_name
    
    def __str__(self):

        return self.email
    
class Project(models.Model):
        projectname = models.CharField(max_length=100)
        projectid = models.CharField(primary_key=True, max_length=20)
        teamlead_email = models.EmailField( null=True)

        # def save(self, *args, **kwargs):
        #     if not self.projectid:
        #         self.projectid = generate_project_id(self.projectname)
        #     super().save(*args, **kwargs)

        def __str__(self):
            return f"{self.projectid} - {self.projectname}"

class Project_TeamMember(models.Model):
        project = models.ForeignKey(Project, on_delete=models.CASCADE)
        team_member_email = models.EmailField(null=True)

        def __str__(self):
            return f"{self.project.projectid} - {self.team_member_email}"



# def generate_project_id(project_name):
#     # Extracting the first four characters if the project name is a single word
#     if ' ' not in project_name:
#         code = project_name[:4].upper()
#     else:
#         # Extracting two characters from the first word and two from the second word if there's a space
#         words = re.split(r'\s+', project_name)
#         code = (words[0][:3] + words[-1][:3]).upper()

#     # Checking if the code consists of only letters
#     if not code.isalpha():
#         # If not, generating a new code with only letters
#         code = ''.join(random.choices(string.ascii_uppercase, k=4))

#     return code

class Sprint(models.Model):
    sprint = models.CharField(primary_key=True, max_length=20, default=None)
    start_date = models.DateField()
    end_date = models.DateField()
    sprint_goal=models.TextField(null=True,default="okay")
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True)
    
class Epic(models.Model):
    EpicName = models.CharField( max_length=20, default=None)
    Epic_id = models.CharField(max_length=20, unique=True,primary_key=True)
    start_date = models.DateField()
    end_date = models.DateField()
    guide=models.CharField(max_length=30)

    

class issue(models.Model):
    IssueName = models.CharField(max_length=30)
    issue_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    # sprint = models.ForeignKey(Sprint, on_delete=models.SET_NULL, null=True, blank=True)
    projectId = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True)
    # is_addedTosprint=models.BooleanField(max_length=5)
    # status=models.CharField(max_length=30,default="TODO")
    # assignee=models.CharField(max_length=30,default=None)
    # assigned_by=models.CharField(max_length=30,default=None)
    # description=models.TextField(max_length=30,default=None)
    # assigned_epic=models.ForeignKey(Epic, on_delete=models.SET_NULL, null=True, blank=True,default=None)
