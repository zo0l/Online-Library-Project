from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login_page, name='login'),
    path('signup/', views.signup_page, name='signup'),
    path('admin-login/', views.admin_login_page, name='admin_login'),
    path('', views.index_page, name='index'),
    path('api/signup/', views.signup_api, name='signup_api'),
    path('api/login/', views.login_api, name='login_api'),
    path('logout/', views.logout_view, name='logout'),

]