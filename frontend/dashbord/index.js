let usercount = 0;

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

                let usersdiv = document.querySelector(".users");

                data.forEach((user) => {
                    let a = document.createElement("a");
                    a.textContent = user;

                    a.addEventListener("click", () => {
                        usercount--;
                        document.querySelector(this).style.display = "none";
                    });

                    usersdiv.appendChild(a);
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