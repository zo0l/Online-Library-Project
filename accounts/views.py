from django.shortcuts import render

def login_page(request):
    return render(request, 'auth/login.html')


def signup_page(request):
    return render(request, 'auth/signup.html')


def admin_login_page(request):
    return render(request, 'auth/admin_login.html')
