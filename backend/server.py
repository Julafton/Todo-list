from flask import Flask, render_template, request, jsonify
from uuid import uuid4
from dotenv import find_dotenv, load_dotenv
import json, bcrypt, os

app = Flask(__name__, template_folder="../frontend", static_folder="../frontend")

dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

BACKEND_FOLDER_PATH = os.getenv("BACKEND_FOLDER_PATH")
os.chdir(BACKEND_FOLDER_PATH)

@app.route("/")
def index():
    return render_template("main/index.html")

@app.route("/profile")
def profile():
    return render_template("profile/index.html")

@app.route("/dashbord")
def Dashbord():
    return render_template("dashbord/index.html")

@app.route("/api/getusers/<token>")
def getusers(token):
    allowed_ip = os.getenv("ADMIN_IP")
    ip = request.remote_addr

    if ip in allowed_ip:
        with open(f"{BACKEND_FOLDER_PATH}/users/admin/admin.json", "r") as f:
            filedata = json.load(f)
            filetoken = filedata.get("token")

            if token != filetoken:
                return ""

        users = []

        for user in os.listdir(f"{BACKEND_FOLDER_PATH}/users/"):
            username = os.fsdecode(user)

            users.append(username)

        return jsonify(users)
    
    return "Error"

@app.route("/api/Deleteuser", methods=["POST"])
def DeleteUser():
    allowed_ip = os.getenv("ADMIN_IP")
    ip = request.remote_addr

    if request.method == "POST" and ip in allowed_ip:
        data = request.get_json("a")
        username = data.get("username")
        token = data.get("token")
        user = data.get("user")

        if username == "admin":
            with open(f"{BACKEND_FOLDER_PATH}/users/admin/admin.json", "r") as f:
                filedata = json.load(f)
                filetoken = filedata.get("token")

                if token != filetoken:
                    return ""
                
            try:
                os.remove(f"{BACKEND_FOLDER_PATH}/users/{user}/{user}.json")
            except:
                pass
            try:
                os.remove(f"{BACKEND_FOLDER_PATH}/users/{user}/todos.json")
            except:
                pass
            try:
                os.rmdir(f"{BACKEND_FOLDER_PATH}/users/{user}")
            except:
                pass

            return "200"
        
        return "Error"
    
    return "Error"


@app.errorhandler(404)
def notfound(e):
    return render_template("404/index.html")

@app.route("/api/checkuser", methods=["POST"])
def checkuser():
    if request.method == "POST":
        data = request.get_json("a")
        username = data.get("username")
        token = data.get("token")

        if os.path.exists(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json"):
            with open(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json", "r") as f:
                filedata = json.load(f)
                filetoken = filedata.get("token")

                if token == filetoken:
                    return "200"
                
                return "404"
    
    return "404"

@app.route("/auth/login", methods=["POST"])
def login():
    if request.method == "POST":
        data = request.get_json("a")
        username = data.get("username")
        password = data.get("password")

        if len(username) >= 3 and len(password) >= 3:
            if os.path.exists(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json"):
                with open(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json", "r") as f:
                    filedata = json.load(f)
                    fileusername = filedata.get("username")
                    filepassword = bytes(filedata.get("password").encode())
                    token = filedata.get("token")

                    if username == fileusername and bcrypt.checkpw(bytes(password.encode()), filepassword):
                        return token

                    return "Password and username does not match"
        
            return "Account not found"
        
        return "Username or password is too short"
    
    return "Error"
    
@app.route("/auth/register", methods=["POST"])
def register():
    if request.method == "POST":
        data = request.get_json("a")
        username = data.get("username")
        password = bytes(data.get("password").encode())

        if len(username) >= 3 and len(password) >= 3:
            if not os.path.exists(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json"):
                os.mkdir(f"{BACKEND_FOLDER_PATH}/users/{username}")
                with open(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json", "w") as f:
                    data = {"username": username, "password": str(bcrypt.hashpw(password, bcrypt.gensalt())).replace("'", "", 1).replace("b", "", 1)[:-1], "token": str(uuid4())}
                    json.dump(data, f)

                    return "200"
             
                return "Error"
            else:
                return "Username already exists"
        else:
            return "Username or password is to short"
            
    return "Error"

@app.route("/auth/changeusername", methods=["POST"])
def changeusername():
    if request.method == "POST":
        data = request.get_json("a")
        username = data.get("username")
        newusername = data.get("newusername")
        token = data.get("token")

        if len(newusername) >= 3:
            if os.path.exists(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json"):
                if not os.path.exists(f"{BACKEND_FOLDER_PATH}/users/{newusername}/{newusername}.json"):
                    with open(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json", "r") as f:
                        data = json.load(f)
                        filetoken = data.get("token")

                        if token != filetoken:
                            return "404"

                        data.update({"username": newusername})

                    with open(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json", "w") as f:
                        json.dump(data, f)

                    os.rename(f"{BACKEND_FOLDER_PATH}/users/{username}", f"{BACKEND_FOLDER_PATH}/users/{newusername}")
                    os.rename(f"{BACKEND_FOLDER_PATH}/users/{newusername}/{username}.json", f"{BACKEND_FOLDER_PATH}/users/{newusername}/{newusername}.json")

                    return "200"
                
                return "Username is taken"
            
            return "Account not found"
        
        return "Username is to short"
    
    return "Error"

@app.route("/auth/resetpassword", methods=["POST"])
def resetpassword():
    if request.method == "POST":
        data = request.get_json("a")
        username = data.get("username")
        token = data.get("token")
        password = bytes(data.get("password").encode())

        if len(password) >= 3:
            if os.path.exists(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json"):
                with open(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json", "r") as f:
                    data = json.load(f)
                    filetoken = data.get("token")

                    if token != filetoken:
                        return "404"
                    
                    data.update({"password": str(bcrypt.hashpw(password, bcrypt.gensalt())).replace("'", "", 1).replace("b", "", 1)[:-1]})

                with open(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json", "w") as f:
                    json.dump(data, f)

                    return "200"

                return "Error"
        
            return "Account not found"
        
        return "Password is to short"
    
    return "Error"

@app.route("/auth/delete", methods=["POST"])
def deleteaccount():
    if request.method == "POST":
        data = request.get_json("a")
        username = data.get("username")
        token = data.get("token")

        if os.path.exists(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json"):
            with open(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json", "r") as f:
                filedata = json.load(f)
                filetoken = filedata.get("token")

                if token != filetoken:
                    return "Error"
                
            try:
                os.remove(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json")
            except:
                pass
            try:
                os.remove(f"{BACKEND_FOLDER_PATH}/users/{username}/todos.json")
            except:
                pass
            try:
                os.rmdir(f"{BACKEND_FOLDER_PATH}/users/{username}")
            except:
                pass
    
            return "200"
                     
        return "Account not found"
    
    return "Error"

@app.route("/api/todos", methods=["POST"])
def handletodos():
    if request.method == "POST":
        data = request.get_json("a")
        username = data.get("username")
        token = data.get("token")
        todos = data.get("todos")

        if os.path.exists(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json"):
            with open(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json", "r") as f:
                filedata = json.load(f)
                filetoken = filedata.get("token")

                if token == filetoken:
                    with open(f"{BACKEND_FOLDER_PATH}/users/{username}/todos.json", "w") as f:
                        json.dump(todos, f)
                
                        return "200"
            
            return "Error"
        
        return "Account not found"
    
    return "Error"

@app.route("/api/GETtodos", methods=["POST"])
def gettodos():
    if request.method == "POST":
        data = request.get_json("a")
        username = data.get("username")
        token = data.get("token")

        if os.path.exists(f"{BACKEND_FOLDER_PATH}/users/{username}"):
            if os.path.exists(f"{BACKEND_FOLDER_PATH}/users/{username}/todos.json"):
                with open(f"{BACKEND_FOLDER_PATH}/users/{username}/{username}.json", "r") as f:
                    filedata = json.load(f)
                    filetoken = filedata.get("token")

                    if token == filetoken:
                        with open(f"{BACKEND_FOLDER_PATH}/users/{username}/todos.json", "r") as f:
                            filedata = json.load(f)

                            return jsonify(filedata)

                        return "Error"
                
                return "Error"
            
            return "No todos"
        
        return "Account not found"
    
    return "Error"

if __name__ == "__main__":
    app.run(os.getenv("IP"), port=os.getenv("PORT"), debug=True)