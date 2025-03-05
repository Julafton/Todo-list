let usercount = 0;

class userclass {
    constructor(name) {
        this.name = name;

        let a = document.createElement("a");
        a.textContent = name;

        let br = document.createElement("br");
        let hr = document.createElement("hr");

        let usersdiv = document.querySelector(".users");

        a.addEventListener("click", () => {
            usercount--;
            document.getElementById("usersH1").textContent = `Registered users: ${usercount}`;
            a.style.display = "none";
            br.style.display = "none";
            hr.style.display = "none";

            fetch("/api/Deleteuser", {
                method: "POST",
                "Content-Type": "Application/Json",
                body: JSON.stringify({
                    "username": localStorage.getItem("username"),
                    "token": localStorage.getItem("token"),
                    "user": this.name,
                })
            });
        });

        usersdiv.appendChild(a);
        usersdiv.appendChild(br);
        usersdiv.appendChild(hr);
    }
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
                usercount = data.length;
                document.getElementById("usersH1").textContent = `Registered users: ${usercount}`;

                data.forEach((user) => {
                    new userclass(user);
                });
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