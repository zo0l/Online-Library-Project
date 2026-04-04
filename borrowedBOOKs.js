/**
 * Borrowed Books Page JavaScript
 * Handles display, return functionality, and validation of borrowed books
 */

// Storage key
const STORAGE_KEYS = {
    BORROWED_BOOKS: 'library_borrowed_books'
};

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadAndDisplayBorrowedBooks();
});

/**
 * Load borrowed books from localStorage and display them
 */
function loadAndDisplayBorrowedBooks() {
    const borrowedBooks = getBorrowedBooks();
    const tableBody = document.getElementById('borrowedTableBody');
    
    if (!tableBody) return;
    
    // Clear loading message
    tableBody.innerHTML = '';
    
    if (borrowedBooks.length === 0) {
        // Show empty state
        tableBody.innerHTML = `
            <tr class="empty-state">
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <p>📚 You haven't borrowed any books yet.</p>
                    <p style="margin-top: 10px;"><a href="search.html" style="color: #5B1E4A;">Browse our collection</a> to borrow your first book!</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Sort books by deadline (closest deadline first)
    borrowedBooks.sort((a, b) => {
        return new Date(a.returnDeadline) - new Date(b.returnDeadline);
    });
    
    // Display each borrowed book
    borrowedBooks.forEach((book, index) => {
        const row = createBookRow(book, index);
        tableBody.appendChild(row);
    });
}

/**
 * Create a table row for a borrowed book
 */
function createBookRow(book, index) {
    const row = document.createElement('tr');
    
    // Check if deadline has passed
    const isLate = isDeadlinePassed(book.returnDeadline);
    const lateFee = calculateLateFee(book.returnDeadline);
    
    // Style for late books
    if (isLate) {
        row.style.backgroundColor = '#fff3f3';
    }
    
    // Create cells
    const titleCell = document.createElement('td');
    titleCell.textContent = book.title;
    
    const authorCell = document.createElement('td');
    authorCell.textContent = book.author;
    
    const isbnCell = document.createElement('td');
    isbnCell.textContent = book.isbn;
    
    const borrowedDateCell = document.createElement('td');
    borrowedDateCell.textContent = book.borrowedDate;
    
    const deadlineCell = document.createElement('td');
    deadlineCell.innerHTML = isLate ? 
        `<span style="color: #c62828; font-weight: bold;">${book.returnDeadline} (LATE - $${lateFee.toFixed(2)})</span>` : 
        book.returnDeadline;
    
    const actionCell = document.createElement('td');
    const returnBtn = document.createElement('button');
    returnBtn.textContent = 'Return Book';
    returnBtn.className = 'return-btn';
    returnBtn.setAttribute('data-book-id', book.id);
    returnBtn.setAttribute('data-book-title', book.title);
    returnBtn.addEventListener('click', function() {
        handleReturnBook(book.id, book.title);
    });
    actionCell.appendChild(returnBtn);
    
    row.appendChild(titleCell);
    row.appendChild(authorCell);
    row.appendChild(isbnCell);
    row.appendChild(borrowedDateCell);
    row.appendChild(deadlineCell);
    row.appendChild(actionCell);
    
    return row;
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
            console.error('Error parsing borrowed books:', e);
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
 * Handle returning a book
 */
function handleReturnBook(bookId, bookTitle) {
    // Validation 1: Confirm return with user
    const confirmReturn = confirm(`Are you sure you want to return "${bookTitle}"?\n\nMake sure the book is in good condition.`);
    
    if (!confirmReturn) {
        return;
    }
    
    // Get current borrowed books
    let borrowedBooks = getBorrowedBooks();
    
    // Validation 2: Check if book exists in borrowed list
    const bookIndex = borrowedBooks.findIndex(book => book.id === bookId);
    
    if (bookIndex === -1) {
        showTemporaryMessage('Book not found in your borrowed list.', 'error');
        return;
    }
    
    // Validation 3: Check for late fee
    const bookToReturn = borrowedBooks[bookIndex];
    const isLate = isDeadlinePassed(bookToReturn.returnDeadline);
    const lateFee = calculateLateFee(bookToReturn.returnDeadline);
    
    if (isLate) {
        const payFee = confirm(`This book is ${Math.ceil((new Date() - new Date(bookToReturn.returnDeadline)) / (1000 * 60 * 60 * 24))} days late.\n\nLate fee: $${lateFee.toFixed(2)}\n\nDo you want to proceed with returning?`);
        if (!payFee) {
            return;
        }
    }
    
    // Process return
    borrowedBooks.splice(bookIndex, 1);
    saveBorrowedBooks(borrowedBooks);
    
    // In a real system, update book availability in server
    updateBookAvailabilityInStorage(bookId, true);
    
    // Show success message
    showTemporaryMessage(`Successfully returned "${bookTitle}"!${isLate ? ` Late fee of $${lateFee.toFixed(2)} has been recorded.` : ''}`, 'success');
    
    // Refresh the table
    loadAndDisplayBorrowedBooks();
}

/**
 * Update book availability in a separate storage (simulating server update)
 */
function updateBookAvailabilityInStorage(bookId, isAvailable) {
    // This simulates updating the book's availability status
    // In a real application, this would be a server call
    const returnedBookKey = `book_${bookId}_returned`;
    sessionStorage.setItem(returnedBookKey, new Date().toISOString());
    
    // Also clear the borrowed flag from session storage if it exists
    sessionStorage.removeItem(`borrowed_${bookId}`);
}

/**
 * Check if deadline has passed
 */
function isDeadlinePassed(deadlineDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineDate);
    deadline.setHours(0, 0, 0, 0);
    return today > deadline;
}

/**
 * Calculate late fee based on days past deadline
 */
function calculateLateFee(deadlineDate) {
    if (!isDeadlinePassed(deadlineDate)) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(deadlineDate);
    deadline.setHours(0, 0, 0, 0);
    
    const daysLate = Math.floor((today - deadline) / (1000 * 60 * 60 * 24));
    return daysLate * 0.50; // $0.50 per day
}

/**
 * Show temporary message at the top of the page
 */
function showTemporaryMessage(message, type) {
    // Create message element if it doesn't exist
    let messageDiv = document.getElementById('tempMessage');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'tempMessage';
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            left: 20px;
            max-width: 400px;
            margin: 0 auto;
            padding: 15px;
            border-radius: 8px;
            z-index: 1000;
            text-align: center;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideDown 0.3s ease;
        `;
        document.body.appendChild(messageDiv);
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translateY(-100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes fadeOut {
                from {
                    opacity: 1;
                }
                to {
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Set message style based on type
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else if (type === 'error') {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    } else {
        messageDiv.style.backgroundColor = '#fff3cd';
        messageDiv.style.color = '#856404';
        messageDiv.style.border = '1px solid #ffeeba';
    }
    
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            messageDiv.style.display = 'none';
            messageDiv.style.animation = '';
        }, 300);
    }, 3000);
}

/**
 * Get statistics about borrowed books (for potential dashboard use)
 */
function getBorrowedStats() {
    const borrowedBooks = getBorrowedBooks();
    const now = new Date();
    
    const stats = {
        totalBorrowed: borrowedBooks.length,
        lateReturns: 0,
        totalLateFees: 0,
        returningSoon: 0 // books due in 3 days or less
    };
    
    borrowedBooks.forEach(book => {
        if (isDeadlinePassed(book.returnDeadline)) {
            stats.lateReturns++;
            stats.totalLateFees += calculateLateFee(book.returnDeadline);
        }
        
        const deadline = new Date(book.returnDeadline);
        const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
        if (daysUntilDeadline <= 3 && daysUntilDeadline > 0) {
            stats.returningSoon++;
        }
    });
    
    return stats;
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        getBorrowedBooks, 
        saveBorrowedBooks, 
        isDeadlinePassed, 
        calculateLateFee,
        getBorrowedStats 
    };
}