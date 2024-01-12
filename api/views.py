import json
from django.shortcuts import render
from django.http import JsonResponse
from .models import *

# Create your views here.
def login(request):
    users = User.objects.all()
    users_data = [{'id':users.id , 'name':users.name, 'email':users.email, 'password':users.password} for users in users]
    if request.method == 'GET':
        return JsonResponse({
            'Users': users_data
        })
        
    if request.method == 'POST':
        data = json.loads(request.body)
        userEmail = data.get('email')
        userPassword = data.get('password')
        try:
            for i in users:
                if i.email == userEmail and i.password == userPassword:
                    return JsonResponse({'message': 'User exists'}, status=200)
                else:
                    return JsonResponse({'error': 'Incorrect email or password'}, status=401)
        except:
            return JsonResponse({'error', 'User does not exist'}, status=400)