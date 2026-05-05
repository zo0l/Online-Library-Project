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

            let csrfToken = document.querySelector("input[name='csrfmiddlewaretoken']").value;

            let dataToSend = {
                username: username,
                email: email,
                password: password,
                role: role
            };

            fetch("/api/signup/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify(dataToSend)
            })
            .then(response => response.json())
            .then(result => {
                alert(result.message);
                if (result.success) {
                    if (role === "admin") {
                        window.location.href = "/admin-login/";
                    } else {
                        window.location.href = "/login/";
                    }
                }
            });
        });
    }

    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) { 
            e.preventDefault();

            let username = document.querySelector("input[name='username']").value.trim();
            let password = document.querySelector("input[name='password']").value.trim();

            if (username === "" || password === "") {
                return alert("Please fill in all fields");
            }

            let csrfToken = document.querySelector("input[name='csrfmiddlewaretoken']").value;
            let isAdminLogin = window.location.pathname.includes("admin-login");

            let dataToSend = {
                username: username,
                password: password,
                is_admin_login: isAdminLogin
            };

            fetch("/api/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify(dataToSend)
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert("Login successful");
                    if (result.role === "admin") {
                        window.location.href = "/admin-dashboard/";
                    }else {
                        window.location.href = "/user-dashboard/";
                    }
                } else {
                    alert(result.message);
                }
            });
        });
    }

});

