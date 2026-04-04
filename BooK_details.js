/**
 * Book Details Page JavaScript
 * Handles book display, validation, and borrowing functionality
 */

// Book data - In a real system, this would come from a server/database
// For demo purposes, we have a sample book
const currentBook = {
    id: 'BK001',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Classic Literature',
    isbn: '978-0-7432-7356-5',
    publicationYear: 1925,
    description: 'The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
    isAvailable: true
};

// Storage keys
const STORAGE_KEYS = {
    BORROWED_BOOKS: 'library_borrowed_books',
    ALL_BOOKS: 'library_all_books'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeBookDisplay();
    setupEventListeners();
    checkIfAlreadyBorrowed();
});

/**
 * Initialize book display with data
 */
function initializeBookDisplay() {
    // Check if we have book data from session storage (if coming from search)
    const selectedBook = sessionStorage.getItem('selectedBook');
    
    let bookToDisplay = currentBook;
    
    if (selectedBook) {
        try {
            const parsedBook = JSON.parse(selectedBook);
            if (parsedBook && parsedBook.id) {
                bookToDisplay = parsedBook;
            }
        } catch (e) {
            console.log('Using default book data');
        }
    }
    
    // Update all book information on the page
    document.getElementById('bookTitle').textContent = bookToDisplay.title;
    document.getElementById('bookAuthor').textContent = bookToDisplay.author;
    document.getElementById('bookCategory').textContent = bookToDisplay.category;
    document.getElementById('bookISBN').textContent = bookToDisplay.isbn;
    document.getElementById('bookYear').textContent = bookToDisplay.publicationYear;
    document.getElementById('bookDescription').textContent = bookToDisplay.description;
    
    // Update status display
    updateBookStatus(bookToDisplay.isAvailable);
    
    // Store current book globally
    window.currentBookData = bookToDisplay;
}

/**
 * Update book status display
 */
function updateBookStatus(isAvailable) {
    const statusSpan = document.getElementById('bookStatus');
    if (isAvailable) {
        statusSpan.innerHTML = '<span class="status-available">Available</span>';
    } else {
        statusSpan.innerHTML = '<span class="status-borrowed">Borrowed</span>';
    }
}

/**
 * Setup event listeners for buttons
 */
function setupEventListeners() {
    const borrowBtn = document.getElementById('borrowBtn');
    if (borrowBtn) {
        borrowBtn.addEventListener('click', handleBorrowBook);
    }
}

/**
 * Check if the current book is already borrowed by the user
 */
function checkIfAlreadyBorrowed() {
    const borrowedBooks = getBorrowedBooks();
    const currentBookData = window.currentBookData;
    
    if (currentBookData && borrowedBooks.some(book => book.id === currentBookData.id)) {
        // Book is already borrowed
        const borrowBtn = document.getElementById('borrowBtn');
        borrowBtn.disabled = true;
        borrowBtn.textContent = 'Already Borrowed';
        
        showAlert('You have already borrowed this book!', 'warning');
    }
}

/**
 * Get all borrowed books from localStorage
 */
function getBorrowedBooks() {
    const stored = localStorage.getItem(STORAGE_KEYS.BORROWED_BOOKS);
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            return [];
        }
    }
    return [];
}

/**
 * Save borrowed books to localStorage
 */
function saveBorrowedBooks(books) {
    localStorage.setItem(STORAGE_KEYS.BORROWED_BOOKS, JSON.stringify(books));
}

/**
 * Handle borrowing a book
 */
function handleBorrowBook() {
    const currentBookData = window.currentBookData;
    const borrowBtn = document.getElementById('borrowBtn');
    
    // Validation 1: Check if book exists
    if (!currentBookData) {
        showAlert('Book data not found. Please refresh the page.', 'error');
        return;
    }
    
    // Validation 2: Check if book is available
    if (!currentBookData.isAvailable) {
        showAlert('This book is currently not available for borrowing.', 'error');
        return;
    }
    
    // Validation 3: Check if user is logged in (session storage check)
    const currentUser = sessionStorage.getItem('currentUser');
    if (!currentUser) {
        showAlert('Please login to borrow books.', 'error');
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    
    // Validation 4: Check if user already has too many books (max 5)
    const borrowedBooks = getBorrowedBooks();
    if (borrowedBooks.length >= 5) {
        showAlert('You have reached the maximum limit of 5 borrowed books. Please return some books first.', 'error');
        return;
    }
    
    // Validation 5: Check if this specific book is already borrowed
    if (borrowedBooks.some(book => book.id === currentBookData.id)) {
        showAlert('You have already borrowed this book!', 'warning');
        borrowBtn.disabled = true;
        borrowBtn.textContent = 'Already Borrowed';
        return;
    }
    
    // Process the borrowing
    processBorrowing(currentBookData, borrowedBooks);
}

/**
 * Process the borrowing transaction
 */
function processBorrowing(book, currentBorrowedBooks) {
    // Calculate dates
    const today = new Date();
    const deadline = new Date();
    deadline.setDate(today.getDate() + 14); // 14 days borrowing period
    
    // Format dates
    const borrowedDate = formatDate(today);
    const returnDeadline = formatDate(deadline);
    
    // Create borrowed book record
    const borrowedBook = {
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        borrowedDate: borrowedDate,
        returnDeadline: returnDeadline,
        borrowedTimestamp: today.getTime()
    };
    
    // Add to borrowed books
    currentBorrowedBooks.push(borrowedBook);
    saveBorrowedBooks(currentBorrowedBooks);
    
    // Update book availability (in a real system, this would update the server)
    book.isAvailable = false;
    updateBookStatus(false);
    
    // Show success message
    showAlert(`Successfully borrowed "${book.title}"! Please return it by ${returnDeadline}.`, 'success');
    
    // Disable borrow button
    const borrowBtn = document.getElementById('borrowBtn');
    borrowBtn.disabled = true;
    borrowBtn.textContent = 'Borrowed Successfully';
    
    // Store that this book is now borrowed in session for this session
    sessionStorage.setItem(`borrowed_${book.id}`, 'true');
    
    // Optional: Redirect to borrowed books page after 2 seconds
    setTimeout(() => {
        if (confirm('Book borrowed successfully! Would you like to view your borrowed books?')) {
            window.location.href = 'borrowed_books.html';
        }
    }, 1500);
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Show alert message
 */
function showAlert(message, type) {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.textContent = message;
    alertDiv.className = `alert-message alert-${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (alertDiv.className.includes('alert-message')) {
            alertDiv.style.display = 'none';
            setTimeout(() => {
                alertDiv.style.display = '';
                alertDiv.className = 'alert-message';
            }, 300);
        }
    }, 5000);
}

/**
 * Validate date (check if deadline has passed)
 */
function isDeadlinePassed(deadlineDate) {
    const today = new Date();
    const deadline = new Date(deadlineDate);
    return today > deadline;
}

/**
 * Calculate late fee
 */
function calculateLateFee(deadlineDate) {
    if (!isDeadlinePassed(deadlineDate)) return 0;
    
    const today = new Date();
    const deadline = new Date(deadlineDate);
    const daysLate = Math.floor((today - deadline) / (1000 * 60 * 60 * 24));
    return daysLate * 0.50; // $0.50 per day
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { formatDate, isDeadlinePassed, calculateLateFee };
}