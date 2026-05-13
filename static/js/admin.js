document.addEventListener("DOMContentLoaded", function () {

    const adminForm = document.querySelector(".admin-form");

    if (adminForm) {

        // ─── Add Book ───
        if (window.location.pathname.includes("add-book")) {
            adminForm.addEventListener("submit", function (e) {
                e.preventDefault();

                let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

                let dataToSend = {
                    title: document.getElementById("book_name").value.trim(),
                    author: document.getElementById("book_author").value.trim(),
                    isbn: document.getElementById("ISBN").value.trim(),
                    category: document.getElementById("book_category").value,
                    description: document.getElementById("book_description").value.trim()
                };

                fetch('/api/add-book/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify(dataToSend)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Book added successfully!");
                        window.location.href = "/admin-books/";
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("An error occurred while adding the book.");
                });
            });
        }

        if (window.location.pathname.includes("edit-book")) {
            adminForm.addEventListener("submit", function (e) {
                e.preventDefault();

                let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
                let urlParams = new URLSearchParams(window.location.search);
                let bookId = urlParams.get('id');

                let dataToSend = {
                    book_id: bookId,
                    title: document.getElementById("book_name").value.trim(),
                    author: document.getElementById("book_author").value.trim(),
                    isbn: document.getElementById("ISBN").value.trim(),
                    category: document.getElementById("book_category").value,
                    description: document.getElementById("book_description").value.trim()
                };

                fetch('/api/edit-book/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken
                    },
                    body: JSON.stringify(dataToSend)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Book updated successfully!");
                        window.location.href = "/admin-books/";
                    } else {
                        alert("Error: " + data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert("An error occurred while updating the book.");
                });
            });
        }
    }
});


function deleteBook(bookId, buttonElement) {
    var confirmed = confirm("Are you sure you want to delete this book?");

    if (confirmed) {
        let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/api/delete-book/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ book_id: bookId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                var row = buttonElement.parentNode.parentNode;
                row.parentNode.removeChild(row);
                alert("Book deleted successfully!");
            } else {
                alert("Error deleting book.");
            }
        });
    }
}