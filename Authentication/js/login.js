//login

document.querySelector(".login-form").onsubmit = function(e) {

    e.preventDefault();

    let username = document.querySelector("input[name='username']").value;
    let password = document.querySelector("input[name='password']").value;


     if (username.length < 3 ) {
        alert("No user with this username");
    }
    else if (password.length < 6 ) {
        alert("Password is incorrect");
    }
    else {
       
      
            window.location.href = "../user pages/user_dashboard.html";
             alert("Login successful");
        }

};
