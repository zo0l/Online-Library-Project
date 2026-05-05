from django.shortcuts import render, redirect



# ─── Home ───
def index(request):
    return render(request, 'index.html')


# ─── Authentication Pages ───
def login_page(request):
    return render(request, 'auth/login.html')


def signup_page(request):
    return render(request, 'auth/signup.html')


def admin_login_page(request):
    return render(request, 'auth/admin_login.html')


# ─── Admin Pages ───
def admin_dashboard(request):
    if request.session.get('role') != 'admin':
        return redirect('admin_login')
    return render(request, 'admin_pages/admin-dashboard.html')


def admin_books(request):
    if request.session.get('role') != 'admin':
        return redirect('admin_login')
    return render(request, 'admin_pages/admin-books.html')


def add_book(request):
    if request.session.get('role') != 'admin':
        return redirect('admin_login')
    return render(request, 'admin_pages/add-book.html')


def edit_book(request):
    if request.session.get('role') != 'admin':
        return redirect('admin_login')
    return render(request, 'admin_pages/edit-book.html')


# ─── User Pages ───

def user_dashboard(request):
    if request.session.get('role') != 'user':
        return redirect('login')
    return render(request, 'user_pages/user_dashboard.html')


def search_books(request):
    if request.session.get('role') != 'user':
        return redirect('login')
    return render(request, 'user_pages/search.html')


def book_details(request):
    if request.session.get('role') != 'user':
        return redirect('login')
    return render(request, 'user_pages/book_details.html')


def borrowed_books(request):
    if request.session.get('role') != 'user':
        return redirect('login')
    return render(request, 'user_pages/borrowed_books.html')
