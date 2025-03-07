let users = [];

class userclass {
    constructor(name) {
        this.name = name;

        let a = document.createElement("a");
        a.textContent = name;

        let br = document.createElement("br");
        let hr = document.createElement("hr");

        let usersdiv = document.querySelector(".users");

        a.addEventListener("click", () => {
            document.getElementById("userinput").value = this.name;
        });

        this.a = a;
        this.br = br;
        this.hr = hr;

        usersdiv.appendChild(a);
        usersdiv.appendChild(br);
        usersdiv.appendChild(hr);
        users.unshift(this);
    }
}

function WarnUser() {
    let username = document.getElementById("userinput");
    let message = document.getElementById("messageinput");

    users.forEach((user) => {
        if (user.name = username.value) {
            fetch("/api/WarnUser", {
                method: "POST",
                "Content-Type": "Application/Json",
                body: JSON.stringify({
                    "username": localStorage.getItem("username"),
                    "token": localStorage.getItem("token"),
                    "user": username.value,
                    "message": message.value,
                }),
            })
            .then((response) => response.text())
            .then((data) => {
                if (data == "200") {
                    message.value = "";
                }
            })
        }
    });
}

function DeleteUser() {
    let username = document.getElementById("userinput");

    fetch("/api/Deleteuser", {
        method: "POST",
        "Content-Type": "Application/Json",
        body: JSON.stringify({
            "username": localStorage.getItem("username"),
            "token": localStorage.getItem("token"),
            "user": username.value,
        }),
    })
    .then((response) => response.text())
    .then((data) => {
         if (data == "200") {
            users.forEach((user) => {
                if (user.name == username.value) {
                    users.splice(users.indexOf(user), users.indexOf(user) + 1);
                    user.a.style.display = "none";
                    user.br.style.display = "none";
                    user.hr.style.display = "none";
                }
            });

            document.getElementById("usersH1").textContent = `Registered users: ${users.length}`;
         }
    });
}

window.onload = () => {
    let username = localStorage.getItem("username");

    if (username == "admin") {
        let uservalid = checkuser();

        if (uservalid) {
            document.querySelector(".dashborddiv").style.display = "block";

            fetch(`/api/getusers/${localStorage.getItem("token")}`)
            .then((response) => response.json())
            .then((data) => {
                data.forEach((user) => {
                    new userclass(user);
                });

                document.getElementById("usersH1").textContent = `Registered users: ${users.length}`;
            });
        }
        else {
            window.location.href = "/";
        }
    }
    else {
        window.location.href = "/";
    }
}