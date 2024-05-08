from django.contrib import admin
from djapp.models import *

# Register your models here.
admin.site.register(UserAccount)
admin.site.register(Project)
admin.site.register(Project_TeamMember)

