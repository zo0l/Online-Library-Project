//signup

document.querySelector(".signup-form").onsubmit = function(e) {

    e.preventDefault();

    let username = document.querySelector("input[name='username']").value.trim();
    let email = document.querySelector("input[name='email']").value.trim();
    let password = document.querySelector("input[name='password']").value.trim();
    let confirm = document.querySelector("input[name='confirm_password']").value.trim();
    let role = document.querySelector("input[name='role']:checked");

    if (!/[a-zA-Z]/.test(username) || !/\d/.test(username)) {
        alert("Username must contain letters and numbers");
    }

    else if (email === "") {
        alert("Please enter your email");
    }

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Invalid email format");
    }

    else if (password.length < 6 || !/[A-Z]/.test(password) || !/\d/.test(password) || !/[!@#$_%^&*]/.test(password)) {

        alert("Password must be 6+ and include capital letter, number and special character");
    }


    else if (password !== confirm) {
        alert("Passwords do not match");
    }

    else {
        if (role && role.value === "user") {
            window.location.href = "login.html";

        } else if(role && role.value === "admin") {
            window.location.href = "admin_login.html";

        }else{
            alert("Select user type");
        }
    }

};
