from django.shortcuts import render, redirect, get_object_some_shortcut
from django.http import JsonResponse
from .models import Book, BorrowedBook
from accounts.models import User
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import datetime, timedelta


# ─── Home Page ───
def index(request):
    return render(request, 'index.html')


# ─── Admin Views ───

def admin_dashboard(request):
    if request.session.get('role') != 'admin':
        return redirect('admin_login')

    context = {
        'total_books': Book.objects.count(),
        'total_users': User.objects.filter(role='user').count(),
        'borrowed_count': BorrowedBook.objects.count(),
        'recent_activity': BorrowedBook.objects.select_related('user', 'book').order_by('-id')[:5]
    }
    return render(request, 'admin_pages/admin-dashboard.html', context)


def admin_books(request):
    if request.session.get('role') != 'admin':
        return redirect('admin_login')
    books = Book.objects.all()
    return render(request, 'admin_pages/admin-books.html', {'books': books})


def add_book(request):
    if request.session.get('role') != 'admin':
        return redirect('admin_login')
    return render(request, 'admin_pages/add-book.html')


# ─── User Views ───

def user_dashboard(request):
    if request.session.get('role') != 'user':
        return redirect('login')

    username = request.session.get('username')
    user = User.objects.get(username=username)
    return render(request, 'user_pages/user_dashboard.html', {'user': user})


def search_books(request):
    if request.session.get('role') != 'user':
        return redirect('login')

    query_title = request.GET.get('title', '')
    query_author = request.GET.get('author', '')
    query_category = request.GET.get('category', '')

    books = Book.objects.all()
    if query_title:
        books = books.filter(title__icontains=query_title)
    if query_author:
        books = books.filter(author__icontains=query_author)
    if query_category:
        books = books.filter(category=query_category)

    return render(request, 'user_pages/search.html', {'books': books})


def book_details(request):
    if request.session.get('role') != 'user':
        return redirect('login')

    book_id = request.GET.get('id')
    book = get_object_or_404(Book, id=book_id)
    return render(request, 'user_pages/book_details.html', {'book': book})


def borrowed_books(request):
    if request.session.get('role') != 'user':
        return redirect('login')

    username = request.session.get('username')
    user = User.objects.get(username=username)
    my_loans = BorrowedBook.objects.filter(user=user).select_related('book')

    return render(request, 'user_pages/borrowed_books.html', {'loans': my_loans})


# ─── API Endpoints (للتعامل مع AJAX) ───

@csrf_exempt
def api_add_book(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            Book.objects.create(
                title=data['title'],
                author=data['author'],
                isbn=data['isbn'],
                category=data['category'],
                description=data['description']
            )
            return JsonResponse({'success': True, 'message': 'Book added successfully'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})


@csrf_exempt
def api_borrow_book(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        book_id = data.get('book_id')
        username = request.session.get('username')

        user = User.objects.get(username=username)
        book = Book.objects.get(id=book_id)

        if book.status == "Available":
            # تحديث حالة الكتاب
            book.status = "Borrowed"
            book.save()

            # إنشاء سجل الاستعارة (موعد التسليم بعد 14 يوم مثلاً)
            deadline = datetime.now() + timedelta(days=14)
            BorrowedBook.objects.create(
                user=user,
                book=book,
                return_deadline=deadline
            )
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'message': 'Book is already borrowed'})


@csrf_exempt
def api_return_book(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        loan_id = data.get('loan_id')
        loan = BorrowedBook.objects.get(id=loan_id)
        book = loan.book
        book.status = "Available"
        book.save()
        loan.delete()

        return JsonResponse({'success': True})


@csrf_exempt
def api_delete_book(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        book_id = data.get('book_id')
        Book.objects.filter(id=book_id).delete()
        return JsonResponse({'success': True})
