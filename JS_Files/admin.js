// js/admin.js

document.addEventListener("DOMContentLoaded", function () {



    let currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
        alert("Access Denied! Please login as an admin.");
        window.location.href = "../Authentication/admin_login.html";
        return;
    }




    const addBookForm = document.querySelector(".admin-form");

    if (addBookForm && window.location.pathname.includes("add-book.html")) {
        addBookForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let newBook = {
                id: Date.now(),
                title: document.getElementById("book_name").value.trim(),
                author: document.getElementById("book_author").value.trim(),
                isbn: document.getElementById("ISBN").value.trim(),
                category: document.getElementById("book_category").value,
                description: document.getElementById("book_description").value.trim(),
                status: "Available"
            };

            let books = getBooks();
            books.push(newBook);
            saveBooks(books);

            alert("Book added successfully!");
            window.location.href = "admin-books.html";
        });
    }



    const booksTableBody = document.querySelector("table tbody");

    if (booksTableBody && window.location.pathname.includes("admin-books.html")) {
        displayAdminBooks();
    }

    function displayAdminBooks() {
        let books = getBooks();
        booksTableBody.innerHTML = "";

        if (books.length === 0) {
            booksTableBody.innerHTML = "<tr><td colspan='7' style='text-align:center;'>No books available. Add some books first!</td></tr>";
            return;
        }

        books.forEach((book, index) => {
            let tr = document.createElement("tr");
            let statusColor = book.status === "Available" ? "green" : "orange";

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.category}</td>
                <td>${book.isbn}</td>
                <td style="color: ${statusColor}; font-weight: bold;">${book.status}</td>
                <td>
                    <button onclick="deleteBook(${book.id})" style="background-color: #d9534f; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">Delete</button>
                    <a href="edit-book.html?id=${book.id}" style="background-color: #0275d8; color: white; text-decoration: none; padding: 5px 10px; border-radius: 4px; margin-left: 5px; font-size: 14px;">Edit</a>
                </td>
            `;
            booksTableBody.appendChild(tr);
        });
    }

    // -----------------------------------------
    // 4. حذف كتاب (Delete Book)
    // -----------------------------------------
    window.deleteBook = function (bookId) {
        if (confirm("Are you sure you want to delete this book?")) {
            let books = getBooks();
            let updatedBooks = books.filter(book => book.id !== bookId);
            saveBooks(updatedBooks);
            displayAdminBooks();
        }
    };



    const editBookForm = document.querySelector(".admin-form");

    if (editBookForm && window.location.pathname.includes("edit-book.html")) {

        const urlParams = new URLSearchParams(window.location.search);
        const bookId = parseInt(urlParams.get("id"));

        let books = getBooks();
        let bookToEdit = books.find(b => b.id === bookId);

        if (!bookToEdit) {
            alert("Book not found!");
            window.location.href = "admin-books.html";
            return;
        }

        document.getElementById("book_name").value = bookToEdit.title;
        document.getElementById("book_author").value = bookToEdit.author;
        document.getElementById("ISBN").value = bookToEdit.isbn;
        document.getElementById("book_category").value = bookToEdit.category;
        document.getElementById("book_description").value = bookToEdit.description;

        editBookForm.addEventListener("submit", function (e) {
            e.preventDefault();

            bookToEdit.title = document.getElementById("book_name").value.trim();
            bookToEdit.author = document.getElementById("book_author").value.trim();
            bookToEdit.isbn = document.getElementById("ISBN").value.trim();
            bookToEdit.category = document.getElementById("book_category").value;
            bookToEdit.description = document.getElementById("book_description").value.trim();


            saveBooks(books);

            alert("Book updated successfully!");
            window.location.href = "admin-books.html";
        });
    }



    if (window.location.pathname.includes("admin-dashboard.html")) {
        displayDashboardStats();
    }

    function displayDashboardStats() {
        let books = getBooks();
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];


        const totalBooksElement = document.getElementById("totalBooksCount");
        const totalUsersElement = document.getElementById("totalUsersCount");
        const activeLoansElement = document.getElementById("activeLoansCount");

        if (totalBooksElement) totalBooksElement.innerText = books.length;
        if (totalUsersElement) totalUsersElement.innerText = users.filter(u => u.role !== "admin").length;
        if (activeLoansElement) activeLoansElement.innerText = borrowedBooks.length;


        const recentBooksTable = document.getElementById("recentBooksTable");
        if (recentBooksTable) {

            while (recentBooksTable.rows.length > 1) {
                recentBooksTable.deleteRow(1);
            }


            let lastFiveBooks = books.slice(-5).reverse();

            if (lastFiveBooks.length === 0) {
                let tr = document.createElement("tr");
                tr.innerHTML = `<td colspan="4" style="text-align:center;">No books available yet.</td>`;
                recentBooksTable.appendChild(tr);
            } else {
                lastFiveBooks.forEach(book => {
                    let tr = document.createElement("tr");

                    let statusClass = book.status === "Available" ? "available" : "borrowed";

                    tr.innerHTML = `
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.category}</td>
                        <td class="${statusClass}">${book.status}</td>
                    `;
                    recentBooksTable.appendChild(tr);
                });
            }
        }

        const activityBox = document.getElementById("recentActivityBox");
        if (activityBox) {
            activityBox.innerHTML = "";

            let recentLoans = borrowedBooks.slice(-3).reverse();
            recentLoans.forEach(record => {
                let p = document.createElement("p");
                p.innerHTML = `🔄 <strong>${record.username}</strong> borrowed <em>${record.bookTitle}</em>`;
                activityBox.appendChild(p);
            });

            let recentlyAddedBooks = books.slice(-3).reverse();
            recentlyAddedBooks.forEach(book => {
                let p = document.createElement("p");
                p.innerHTML = `📘 New book <strong>${book.title}</strong> was added`;
                activityBox.appendChild(p);
            });

            if (recentLoans.length === 0 && recentlyAddedBooks.length === 0) {
                activityBox.innerHTML = "<p>No recent activity.</p>";
            }
        }
    }

});