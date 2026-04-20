document.addEventListener("DOMContentLoaded", function () {


    let currentUser = getCurrentUser();
    if (!currentUser || currentUser.role === "admin") {
        alert("Access Denied! Please login as an user.");
        window.location.href = "../Authentication/login.html";
        return;
    }


    if (window.location.pathname.includes("user_dashboard.html")) {

        const usernameInput = document.querySelector("input[name='username']");
        const emailInput = document.querySelector("input[name='email']");

        if (usernameInput) usernameInput.value = currentUser.username;
        if (emailInput) emailInput.value = currentUser.email;
    }


    const searchForm = document.getElementById("search");
    const searchResultsTable = document.querySelector("table tbody");

    if (window.location.pathname.includes("search.html")) {

        let allBooks = getBooks();

        function displaySearchResults(booksToDisplay) {
            if (!searchResultsTable) return;
            searchResultsTable.innerHTML = "";

            if (booksToDisplay.length === 0) {
                searchResultsTable.innerHTML = "<tr><td colspan='6' style='text-align:center;'>No books found matching your search.</td></tr>";
                return;
            }

            booksToDisplay.forEach((book, index) => {
                let tr = document.createElement("tr");
                let statusColor = book.status === "Available" ? "green" : "#d9534f";

                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td style="text-transform: capitalize;">${book.category}</td>
                    <td style="color: ${statusColor}; font-weight:bold;">${book.status}</td>
                    <td>
                        <a href="book_details.html?id=${book.id}">
                            <button style="background-color:#7A2E63; color:white; border:none; padding:6px 12px; cursor:pointer; border-radius:4px;">View Details</button>
                        </a>
                    </td>
                `;
                searchResultsTable.appendChild(tr);
            });
        }

        displaySearchResults(allBooks);

        if (searchForm) {
            searchForm.addEventListener("submit", function (e) {
                e.preventDefault();

                let searchTitle = document.querySelector("input[name='title']").value.toLowerCase().trim();
                let searchAuthor = document.querySelector("input[name='author']").value.toLowerCase().trim();
                let searchCategory = document.querySelector("select[name='category']").value.toLowerCase();

                let filteredBooks = allBooks.filter(book => {
                    let matchTitle = book.title.toLowerCase().includes(searchTitle);
                    let matchAuthor = book.author.toLowerCase().includes(searchAuthor);
                    let matchCategory = (searchCategory === "") || (book.category.toLowerCase() === searchCategory);

                    return matchTitle && matchAuthor && matchCategory;
                });

                displaySearchResults(filteredBooks);
            });
        }
    }


    if (window.location.pathname.includes("book_details.html")) {


        const urlParams = new URLSearchParams(window.location.search);
        const bookId = urlParams.get('id');

        let allBooks = getBooks();
        let currentBook = allBooks.find(b => b.id == bookId);

        const borrowBtn = document.getElementById("borrowBtn");
        const alertMsg = document.getElementById("alertMessage");

        if (currentBook) {
            document.getElementById("bookTitle").innerText = currentBook.title;
            document.getElementById("bookAuthor").innerText = currentBook.author;
            document.getElementById("bookCategory").innerText = currentBook.category;
            document.getElementById("bookISBN").innerText = currentBook.isbn || "N/A";
            document.getElementById("bookDescription").innerText = currentBook.description || "No description available.";
            document.getElementById("bookStatus").innerText = currentBook.status;

            if (currentBook.status === "Borrowed") {
                document.getElementById("bookStatus").style.color = "red";
                borrowBtn.innerText = "Already Borrowed";
                borrowBtn.disabled = true;
                borrowBtn.style.backgroundColor = "#ccc";
            } else {
                document.getElementById("bookStatus").style.color = "green";
            }


            borrowBtn.addEventListener("click", function () {
                let currentUser = getCurrentUser();
                currentBook.status = "Borrowed";
                localStorage.setItem("books", JSON.stringify(allBooks));

                let borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
                let newLoan = {
                    id: Date.now(),
                    userId: currentUser.id,
                    username: currentUser.username,
                    bookId: currentBook.id,
                    bookTitle: currentBook.title,
                    borrowDate: new Date().toLocaleDateString(),
                    returnDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
                };

                borrowedBooks.push(newLoan);
                localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

                alertMsg.innerText = "Success! You have borrowed this book.";
                alertMsg.style.color = "green";
                borrowBtn.innerText = "Borrowed Successfully";
                borrowBtn.disabled = true;
                borrowBtn.style.backgroundColor = "#ccc";
                document.getElementById("bookStatus").innerText = "Borrowed";
                document.getElementById("bookStatus").style.color = "red";

                alert("Book borrowed successfully! Check 'My Borrowed Books' page.");
            });

        } else {
            document.querySelector(".details-container").innerHTML = "<h2>Book not found!</h2><a href='search.html'>Back to Search</a>";
        }
    }


    if (window.location.pathname.includes("borrowed_books.html")) {
        const borrowedTableBody = document.getElementById("borrowedTableBody");

        function displayBorrowedBooks() {
            let currentUser = getCurrentUser();
            let allBorrowedRecords = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

            let userBooks = allBorrowedRecords.filter(record => record.userId === currentUser.id);

            if (!borrowedTableBody) return;
            borrowedTableBody.innerHTML = "";

            if (userBooks.length === 0) {
                borrowedTableBody.innerHTML = "<tr><td colspan='6' style='text-align:center;'>You haven't borrowed any books yet.</td></tr>";
                return;
            }

            userBooks.forEach(record => {
                let tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${record.bookTitle}</td>
                    <td>-</td> <td>-</td>
                    <td>${record.borrowDate}</td>
                    <td style="color: #d9534f; font-weight: bold;">${record.returnDeadline}</td>
                    <td>
                        <button class="return-btn" data-id="${record.id}" data-bookid="${record.bookId}" 
                            style="background-color:#5B1E4A; color:white; border:none; padding:5px 10px; cursor:pointer; border-radius:4px;">
                            Return Book
                        </button>
                    </td>
                `;
                borrowedTableBody.appendChild(tr);
            });

            attachReturnEvents();
        }

        function attachReturnEvents() {
            const returnBtns = document.querySelectorAll(".return-btn");
            returnBtns.forEach(btn => {
                btn.addEventListener("click", function () {
                    const loanId = this.getAttribute("data-id");
                    const bookId = this.getAttribute("data-bookid");

                    if (confirm("Are you sure you want to return this book?")) {
                        let allBooks = getBooks();
                        let bookIndex = allBooks.findIndex(b => b.id == bookId);
                        if (bookIndex !== -1) {
                            allBooks[bookIndex].status = "Available";
                            localStorage.setItem("books", JSON.stringify(allBooks));
                        }

                        let allBorrowedRecords = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
                        let updatedRecords = allBorrowedRecords.filter(record => record.id != loanId);
                        localStorage.setItem("borrowedBooks", JSON.stringify(updatedRecords));

                        displayBorrowedBooks();
                        alert("Book returned successfully!");
                    }
                });
            });
        }

        displayBorrowedBooks();
    }

    const logoutLinks = document.querySelectorAll("a");

    logoutLinks.forEach(link => {
        let linkText = link.innerText.toLowerCase().trim();
        if (linkText === "logout" || linkText === "log out") {

            link.addEventListener("click", function (e) {
                e.preventDefault();
                localStorage.removeItem("currentUser");
                window.location.href = this.href;
            });

        }
    });
});