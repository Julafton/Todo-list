
function login() {
    let inputs = document.querySelectorAll("input");
    let username = inputs[0];
    let password = inputs[1];

    fetch("/auth/login", {
        method: "POST",
        "Content-Type": "Application/Json",
        body: JSON.stringify({
            "username": username.value,
            "password": password.value,
        }),
    })
    .then((response) => response.text())
    .then((data) => {
        if (data != "Error" && data != "Password and username does not match" && data != "Account not found" && data != "Username or password is too short") {
            localStorage.setItem("username", username.value);
            localStorage.setItem("token", data);
            changepage("profile");
        }
        else {
            let p = document.querySelectorAll("p")[0];

            p.style.color = "red";
            p.textContent = data;
        }

        username.value = "";
        password.value = "";
    });
}

function register() {
    let inputs = document.querySelectorAll("input");
    let username = inputs[2];
    let password = inputs[3];

    fetch("/auth/register", {
        method: "POST",
        "Content-Type": "Application/Json",
        body: JSON.stringify({
            "username": username.value,
            "password": password.value,
        }),
    })
    .then((response) => response.text())
    .then((data) => {
        if (data == "200") {
            changepage("login");
        }
        else {
            let p = document.querySelectorAll("p")[1];

            p.style.color = "red";
            p.textContent = data;
        }

        username.value = "";
        password.value = "";
    });
}

function changeusername() {
    let newusername = document.getElementById("newusernameinput");

    fetch("/auth/changeusername", {
        method: "POST",
        "Content-Type": "Application/Json",
        body: JSON.stringify({
            "username": localStorage.getItem("username"),
            "newusername": newusername.value,
            "token": localStorage.getItem("token"),
        }),
    })
    .then((response) => response.text())
    .then((data) => {
        if (data == "200") {
            alert("Username changed!");
            localStorage.setItem("username", newusername.value);
            document.getElementById("nameP").textContent = localStorage.getItem("username");
        }
        else {
            alert(data);
        }

        newusername.value = "";
    });
}

function changepassword() {
    let newpassword = document.getElementById("newpasswordinput"); 

    fetch("/auth/resetpassword", {
        method: "POST",
        "Content-Type": "Application/Json",
        body: JSON.stringify({
            "username": localStorage.getItem("username"),
            "token": localStorage.getItem("token"),
            "password": newpassword.value,
        }),
    })
    .then((response) => response.text())
    .then((data) => {
        if (data == "200") {
            alert("Password changed!");
        }
        else {
            alert(data);
        }

        newpassword.value = "";
    });
}

function logout() {
    localStorage.clear();
    changepage("login");
}

function toggledelete() {
    let div = document.querySelector(".confirmdiv");
    if (div.style.display == "block") {
        div.style.display = "none";
    }
    else if (div.style.display == "") {
        div.style.display = "block";
    }
}

function deleteaccount() {
    let uservalid = checkuser();

    if (uservalid) {
        fetch("/auth/delete", {
            method: "POST",
            "Content-Type": "Application/Json",
            body: JSON.stringify({
                "username": localStorage.getItem("username"),
                "token": localStorage.getItem("token"),
            }),
        })
        .then((response) => response.text())
        .then((data) => {
            if (data == "200") {
                toggledelete();
                alert("Deleted!");
                logout();
            }
        });
    }
}

function changepage(page) {
    let div = document.querySelectorAll("div");
    div[1].style.display = "none";
    div[2].style.display = "none";
    div[3].style.display = "none";

    if (page == "login")
        div[1].style.display = "block";
    else if (page == "register")
        div[2].style.display = "block";
    else if (page == "profile") {
        let uservalid = checkuser();

        if (uservalid) {
            document.getElementById("nameP").textContent = localStorage.getItem("username");
            div[3].style.display = "block";
        }
    }
}

window.onload = () => {
    let uservalid = checkuser();
    
    if (uservalid)
        changepage("profile");
}