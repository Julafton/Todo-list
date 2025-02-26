
class todo {
    constructor(text) {
        this.text = text;
    }

    Add() {
        let div = document.createElement("div");
        div.classList.add("todo");
        let p = document.createElement("p");
        p.textContent = this.text;
        let button = document.createElement("button");
        button.textContent = "Remove";
        button.addEventListener("click", () => {
            this.Remove();
        })
        div.appendChild(p);
        div.appendChild(button);
        this.div = div;
        document.querySelector(".todos").appendChild(div);
        todoarray.unshift(this);
        document.getElementById("countP").textContent = `You have ${todoarray.length} items`;
        let uservalid = checkuser();

        if (uservalid) {
            fetch("/api/todos", {
                method: "POST",
                "Content-Type": "Application/json",
                body: JSON.stringify({
                    "username": localStorage.getItem("username"),
                    "token": localStorage.getItem("token"),
                    "todos": todoarray,
                }),
            });
        }
    }

    Remove() {
        this.div.style.display = "none";
        todoarray.splice(todoarray.indexOf(this), 1);
        document.getElementById("countP").textContent = `You have ${todoarray.length} items`;
        let uservalid = checkuser();

        if (uservalid) {
            fetch("/api/todos", {
                method: "POST",
                "Content-Type": "Application/json",
                body: JSON.stringify({
                    "username": localStorage.getItem("username"),
                    "token": localStorage.getItem("token"),
                    "todos": todoarray,
                }),
            });
        }
    }
}

let todoarray = [];

function additem() {
    let uservalid = checkuser();

    if (!uservalid && localStorage.getItem("popup") == null) {
        popup("OPEN");
        localStorage.setItem("popup", true);
    }
    let text = document.getElementById("iteminput").value;

    let item = new todo(text);
    item.Add();
}

function popup(action) {
    let popupdiv = document.querySelector(".popupdiv");

    if (action == "OPEN") {
        popupdiv.style.visibility = "visible";
    }
    else if (action == "CLOSE") {
        popupdiv.style.visibility = "hidden";
    }
}

window.onload = () => {
    let uservalid = checkuser();

    if (uservalid) {
        fetch("/api/GETtodos", {
            method: "POST",
            "Content-Type": "Application/Json",
            body: JSON.stringify({
                "username": localStorage.getItem("username"),
                "token": localStorage.getItem("token"),
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            
            if (data != "404" && data != "Error" && data != "No todos" && data != "Account not found") {
                data.forEach((item) => {
                    let todoitem = new todo(item.text);
                    
                    let div = document.createElement("div");
                    div.classList.add("todo");
                    let p = document.createElement("p");
                    p.textContent = todoitem.text;
                    let button = document.createElement("button");
                    button.textContent = "Remove";
                    button.addEventListener("click", () => {
                        todoitem.Remove();
                    })
                    div.appendChild(p);
                    div.appendChild(button);
                    todoitem.div = div;
                    document.querySelector(".todos").appendChild(div);
                    todoarray.unshift(todoitem);
                    document.getElementById("countP").textContent = `You have ${todoarray.length} items`;
                });
            }
        })
    }
    else {
        localStorage.removeItem("popup");
    }
}