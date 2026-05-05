from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.cache import never_cache
import json
from .models import User

def index_page(request):
    return render(request, 'index.html')

def login_page(request):
    return render(request, 'auth/login.html')


def signup_page(request):
    return render(request, 'auth/signup.html')


def admin_login_page(request):
    return render(request, 'auth/admin_login.html')



    
#signupAPI
def signup_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        username = data['username']
        email = data['email']
        password = data['password']
        role = data['role']

        if User.objects.filter(username=username).exists():
            return JsonResponse({
                'success': False, 'message': 'Username already exists'
                })

        if User.objects.filter(email=email).exists():
            return JsonResponse({
                'success': False, 'message': 'Email already exists'
                })

        new_user = User(username=username, email=email, password=password, role=role)
        new_user.save()

        return JsonResponse({
            'success': True, 'message': 'Account created successfully'
            })


#loginAPI
def login_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        username = data['username']
        password = data['password']
        is_admin_login = data['is_admin_login']

        user = User.objects.filter(username=username, password=password).first()

        if user is None:
            return JsonResponse({'success': False, 'message': 'Invalid username or password'})

        if is_admin_login and user.role != 'admin':
            return JsonResponse({'success': False, 'message': 'You are not an admin'})

        if not is_admin_login and user.role != 'user':
            return JsonResponse({'success': False, 'message': 'Admins should login from Admin Login page'})

        request.session['username'] = user.username
        request.session['role'] = user.role

        return JsonResponse({'success': True, 'role': user.role})

#logoutAPI  
def logout_view(request):
    request.session.flush()
    return redirect('login')