"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path
from .views import *

urlpatterns = [
    path('api/login/', login),
    path('api/register/', register),
    path('api/get+user+with+email/', get_user_id),
    path('api/get+all+posts/', get_all_post),
    path('api/create_post/', create_post),
    path('api/get+comments+with+post/', get_comments_for_post),
    path('api/create+comments+for+post/', create_comment_on_post),
    path('api/create+reply+comments+for+post/', create_reply_comment_on_post)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
