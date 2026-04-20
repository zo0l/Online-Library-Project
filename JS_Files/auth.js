// js/auth.js

document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.querySelector(".signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let username = document.querySelector("input[name='username']").value.trim();
            let email = document.querySelector("input[name='email']").value.trim();
            let password = document.querySelector("input[name='password']").value.trim();
            let confirm = document.querySelector("input[name='confirm_password']").value.trim();
            let roleInput = document.querySelector("input[name='role']:checked");

            if (!/[a-zA-Z]/.test(username) || !/\d/.test(username)) {
                return alert("Username must contain letters and numbers");
            }
            if (email === "") {
                return alert("Please enter your email");
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return alert("Invalid email format");
            }
            if (password.length < 6 || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$_%^&*]/.test(password)) {
                return alert("Password must be 6+ and include capital letter, number and special character");
            }
            if (password !== confirm) {
                return alert("Passwords do not match");
            }
            if (!roleInput) {
                return alert("Please select an account type (Admin or User)");
            }

            let role = roleInput.value;

            let users = getUsers();
            let userExists = users.some(u => u.username === username || u.email === email);
            if (userExists) {
                return alert("Username or Email already exists!");
            }

            let newUser = {
            username: username,
            email: email,
            password: password,
            role: role
      };
            users.push(newUser);
            saveUsers(users);

            alert("Registration successful! Please login.");
            window.location.href = "login.html";
        });
    }



    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let username = document.querySelector("input[name='username']").value.trim();
            let password = document.querySelector("input[name='password']").value.trim();

            let users = getUsers();
            let foundUser = users.find(u => u.username === username && u.password === password);

            if (!foundUser) {
                return alert("Invalid username or password");
            }

            let isPageAdminLogin = window.location.pathname.includes("admin_login.html");
            if (isPageAdminLogin && foundUser.role !== "admin") {
                return alert("Access denied. You are not an admin.");
            }
            if (!isPageAdminLogin && foundUser.role !== "user") {
                return alert("Admins should login from the Admin Login page.");
            }

            setCurrentUser(foundUser);
            alert("Login successful!");


            if (foundUser.role === "admin") {
                window.location.href = "../admin pages/admin-dashboard.html";
            } else {
                window.location.href = "../user pages/user_dashboard.html";
            }
        });
    }



    const logoutLinks = document.querySelectorAll("a");

    logoutLinks.forEach(link => {
        let linkText = link.innerText.toLowerCase().trim();
        if (linkText === "logout" || linkText === "log out") {

            link.addEventListener("click", function(e) {
                e.preventDefault();
                localStorage.removeItem("currentUser");
                window.location.href = this.href;
            });

        }
    });

});