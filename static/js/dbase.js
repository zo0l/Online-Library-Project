if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify([]));
}
if (!localStorage.getItem("books")) {
    localStorage.setItem("books", JSON.stringify([]));
}
if (!localStorage.getItem("borrowedBooks")) {
    localStorage.setItem("borrowedBooks", JSON.stringify([]));
}


function getUsers() {
    return JSON.parse(localStorage.getItem("users"));
}

function saveUsers(usersArray) {
    localStorage.setItem("users", JSON.stringify(usersArray));
}


function getBooks() {
    return JSON.parse(localStorage.getItem("books"));
}

function saveBooks(booksArray) {
    localStorage.setItem("books", JSON.stringify(booksArray));
}


function getBorrowedBooks() {
    return JSON.parse(localStorage.getItem("borrowedBooks"));
}

function saveBorrowedBooks(borrowedArray) {
    localStorage.setItem("borrowedBooks", JSON.stringify(borrowedArray));
}


function setCurrentUser(userObject) {
    localStorage.setItem("currentUser", JSON.stringify(userObject));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
}

function logout() {
    localStorage.removeItem("currentUser");
}