function checkuser() {
    let username = localStorage.getItem("username");
    let token = localStorage.getItem("token");

    if (username != null && token != null) {
        fetch("/api/checkuser", {
            method: "POST",
            "Content-Type": "Application/json",
            body: JSON.stringify({
                "username": username,
                "token": token,
            }),
        })
        .then((response) => response.text())
        .then((data) => {
            if (data == "404") {
                localStorage.removeItem("username");
                localStorage.removeItem("token");
                window.location.reload();
            }
        });

        return true;
    }

    return false;
}