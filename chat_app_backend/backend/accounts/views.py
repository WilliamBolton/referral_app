# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from accounts.models import User
from django.contrib import messages
from accounts.tokenauthentication import JWTAuthentication
from .serializers import UserSerializer, LoginSerializer
from rest_framework import status
from django.contrib.auth import authenticate
from django.http import JsonResponse

# Create your views here.

@api_view(['POST'])
def resigter_user(request):
    """Registers a new user"""
    try:
        email=request.data['email'],
        password=request.data['password'],
        first_name=request.data['first_name'],
        last_name=request.data.get('last_name', ''),
        medical_specialty=request.data.get('medical_specialty', '')
        user = User.objects.create_user(
            email=email[0],
            password=password[0],
            first_name=first_name[0],
            last_name=last_name[0],
            medical_specialty=medical_specialty,
        )
        user.save()
        print('User registered')
        return Response(request.data, status=201)
    except:
        return Response("Invalid registration information", status=400)

@api_view(['POST'])
def login_user(request):
    """Logs in a user and returns a token for authentication"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        token = JWTAuthentication.generate_token(data=request.data)
        response = JsonResponse({
            'message': 'Login successful',
            'token': token,
            'email': request.data['email'],
        })

        # Set the token and email in the cookie
        response.set_cookie('token', token, max_age=3600)
        response.set_cookie('email', request.data['email'], max_age=3600)  # Set cookie expiry time

        return response
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)