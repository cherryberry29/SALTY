from django.contrib import admin
from djapp.models import *
from django import forms 

# Register your models here.
class IssueAdminForm(forms.ModelForm):
    class Meta:
        model = issue
        fields = '__all__'
        widgets = {
            'projectId': forms.TextInput(),  # Renders as a text input field
        }

class IssueAdmin(admin.ModelAdmin):
    form = IssueAdminForm
admin.site.register(UserAccount)
admin.site.register(Project)
admin.site.register(Project_TeamMember)
admin.site.register(issue)
admin.site.register(Sprint)
admin.site.register(Epic)

