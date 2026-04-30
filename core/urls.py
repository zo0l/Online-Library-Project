from django.urls import path
from . import views

urlpatterns = [
   
    path('', views.index, name='index'),

   
    path('login/', views.login_page, name='login'),
    path('signup/', views.signup_page, name='signup'),
    path('admin-login/', views.admin_login_page, name='admin_login'),

   
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-books/', views.admin_books, name='admin_books'),
    path('add-book/', views.add_book, name='add_book'),
    path('edit-book/', views.edit_book, name='edit_book'),

    path('user-dashboard/', views.user_dashboard, name='user_dashboard'),
    path('search/', views.search_books, name='search_books'),
    path('book-details/', views.book_details, name='book_details'),
    path('borrowed-books/', views.borrowed_books, name='borrowed_books'),
]
