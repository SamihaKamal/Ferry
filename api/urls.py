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
    path('api/get+user+image/', get_user_image),
    path('api/get+user/', get_user_data),
    path('api/get+all+posts/', get_all_post),
    path('api/get+user+posts/', get_posts_by_user),
    path('api/get+country+posts/', get_posts_from_country),
    path('api/create_post/', create_post),
    path('api/get+comments+with+post/', get_comments_for_post),
    path('api/get+user+comments/', get_comments_by_user),
    path('api/create+comments+for+post/', create_comment_on_post),
    path('api/create+reply+comments+for+post/', create_reply_comment_on_post),
    path('api/create+chat/', create_chat),
    path('api/get+user+chats/', get_user_chats),
    path('api/get+messages+from+chat/', get_messages_from_chat),
    path('api/create+message/', create_message),
    path('api/get+countries/', get_countries),
    path('api/get+country+from+id/', get_country_from_id),
    path('api/get+country+image/', get_country_image),
    path('api/get+user+lists/', get_user_lists),
    path('api/save+post+to+list/', save_post_to_list),
    path('api/save+comment+to+list/', save_comment_to_list),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
