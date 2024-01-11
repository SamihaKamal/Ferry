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
        userName = data.get('email','')
        try:
            for i in users:
                if i.email == userName:
                    return JsonResponse({'message': 'Name exists'})
                else:
                    return JsonResponse({'error': 'user does not exist'})
        except:
            return JsonResponse({'error', 'User does not exist'})