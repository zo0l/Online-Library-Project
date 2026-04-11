document.addEventListener('DOMContentLoaded', () => {

    // welcome (in user_dashboard.html)
    const welcomeSection = document.querySelector('#address h2');
    if (welcomeSection && window.location.pathname.includes('user_dashboard.html')) {
        
        welcomeSection.innerText = `!Welcome to your own dashboard`;
    }

    // search
    const searchForm = document.getElementById('search');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            const title = searchForm.querySelector('input[name="title"]').value;
            const author = searchForm.querySelector('input[name="author"]').value;
            const category = searchForm.querySelector('select[name="category"]').value;

            // if empty
            if (!title && !author && !category) {
                e.preventDefault();
                alert('Please enter the search details (title, author, or category) first.');
            }
        });
    }

    // book_details
    
    // borrow
    const borrowForm = document.querySelector('form[action="borrowed_books.html"]');
    
    if (borrowForm) {
        borrowForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const bookTitle = document.querySelector('h2').innerText;
            const bookAuthor = "Robert Martin";
            const today = new Date();
            const borrowDate = today.toISOString().split('T')[0];
            
            const deadlineDate = new Date(today);
            deadlineDate.setDate(deadlineDate.getDate() + 14);
            const returnDeadline = deadlineDate.toISOString().split('T')[0];

            const newBorrowedBook = {
                title: bookTitle,
                author: bookAuthor,
                date: borrowDate,
                deadline: returnDeadline
            };

            // LocalStorage
            let borrowedBooks = JSON.parse(localStorage.getItem('userBooks')) || [];

            const isAlreadyBorrowed = borrowedBooks.some(book => book.title === bookTitle);

            if (!isAlreadyBorrowed) {
                borrowedBooks.push(newBorrowedBook);
                localStorage.setItem('userBooks', JSON.stringify(borrowedBooks));
                alert(`A book was borrowed "${bookTitle}" Successfully!`);
                window.location.href = "borrowed_books.html"; 
            } else {
                alert("This book is already on your borrowing list.!");
                window.location.href = "borrowed_books.html";
            }
        });
    }

    // display
    const borrowedTableBody = document.querySelector('table tbody');

    if (borrowedTableBody && window.location.pathname.includes('borrowed_books.html')) {
        const storedBooks = JSON.parse(localStorage.getItem('userBooks')) || [];

        if (storedBooks.length > 0) {
            borrowedTableBody.innerHTML = '';

            storedBooks.forEach((book, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.date}</td>
                    <td>${book.deadline}</td>
                    <td><button onclick="returnBook(${index})" style="padding: 5px 10px; background-color: #d9534f; color: white; border: none; border-radius: 3px; cursor: pointer;">return</button></td>
                `;
                borrowedTableBody.appendChild(row);
            });
        } else {
            borrowedTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">There are no books available for loan at the moment.</td></tr>';
        }
    }


    // return book
    function returnBook(index) {
        let borrowedBooks = JSON.parse(localStorage.getItem('userBooks')) || [];
        if (confirm("Do you want to return this book?")) {
            borrowedBooks.splice(index, 1);
            localStorage.setItem('userBooks', JSON.stringify(borrowedBooks));
            location.reload();
        }
    }


    // borrowed_books
    const borrowedTable = document.querySelector('table tbody');
    if (borrowedTable && window.location.pathname.includes('borrowed_books.html')) {
        const books = JSON.parse(localStorage.getItem('borrowedBooks')) || [];
        
        if (books.length > 0) {
            borrowedTable.innerHTML = ''; // delete
            books.forEach(book => {
                const row = `
                    <tr>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.date}</td>
                        <td>${book.deadline}</td>
                    </tr>
                `;
                borrowedTable.innerHTML += row;
            });
        }
    }

    // exit
    const logoutLink = document.querySelector('nav a[href*="login.html"]'); 
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            if (!confirm('Are you sure you want to log out?')){
                e.preventDefault();
            }
        });
    }
});
