# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
# Register your models here.
#admin.site.register(User, UserAdmin)
admin.site.register(User)
