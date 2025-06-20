"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
#from django.conf.urls import url - does not work in django post v4
from django.urls import include, re_path, path
from django.contrib import admin
from accounts.views import login_user, resigter_user
from ai_chat.views import get_ai_messages
from chat.views import get_messages, get_specific_user
from chat.views import get_user_list
from referral.views import create_patients, create_referral, get_patients, get_referrals, mark_referral_as_completed

urlpatterns = [
    re_path('admin/', admin.site.urls),
    re_path('register/', resigter_user, name="register"),
    re_path('login/', login_user, name="login"),
    re_path('api/users/', get_user_list, name="users"),
    path('api/messages/', get_messages, name="messages"),
    path('api/specific_user/', get_specific_user, name='specific_user'),
    path('api/referrals/', get_referrals, name='referrals'),
    path('api/mark_referral_as_completed/', mark_referral_as_completed, name='mark_referral_as_completed'),
    re_path('api/patients/', get_patients, name='patients'),
    path('create_patients/', create_patients, name='create_patients'),
    path('api/create_referral/', create_referral, name='create_referral'),
    path('api/ai_messages/', get_ai_messages, name='get_ai_messages'),
]
