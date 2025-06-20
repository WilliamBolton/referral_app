# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser, AbstractBaseUser, BaseUserManager, PermissionsMixin
# Create your models here.

class UserManager(BaseUserManager):
    """ Model to manage users"""
    def create_user(self, email, password=None, first_name=None, last_name=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email")
        
        email = self.normalize_email(email)
        user = self.model(email=email,first_name=first_name, last_name=last_name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email ,password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    """ Model for User (overrides djangos standard user)"""
    email = models.EmailField(max_length=254, unique=True, blank=False)
    first_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)
    medical_specialty = models.CharField(max_length=50, null=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def get_full_name(self) -> str:
        return f"({self.first_name} {self.last_name})"
    
    def __str__(self) -> str:
        return f"{self.email}, {self.medical_specialty}"