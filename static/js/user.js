document.addEventListener("DOMContentLoaded", function () {


    const borrowBtn = document.getElementById("borrowBtn");

    if (borrowBtn) {
        borrowBtn.addEventListener("click", function() {
            const urlParams = new URLSearchParams(window.location.search);
            const bookId = urlParams.get('id');

            let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

            fetch('/api/borrow-book/', {
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
                    alert("Book borrowed successfully!");
                    window.location.href = "/borrowed-books/";
                } else {
                    alert("Cannot borrow: " + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred while borrowing.");
            });
        });
    }
});


function returnBook(loanId, buttonElement) {
    if (confirm("Are you sure you want to return this book?")) {

        let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        fetch('/api/return-book/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify({ loan_id: loanId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Book returned successfully!");
                window.location.reload();
            } else {
                alert("Error returning book.");
            }
        });
    }
}