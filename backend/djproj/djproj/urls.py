
from django.contrib import admin
from django.urls import path


from django.urls import path, include, re_path
from django.views.generic import TemplateView

urlpatterns = [
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('admin/', admin.site.urls),
    path('auth/', include('djoser.social.urls')),
    path('djapp/', include('djapp.urls')),

    
]
urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]