$(document).ready(function () {

    const user = JSON.parse(localStorage.getItem("user"))

    if (user == null) {
        console.log("Nadie logeado")
        const btnLogin = document.getElementById("btnLogin")
        btnLogin.addEventListener("click", function () {

            const userName = document.getElementById("username").value
            const passWord = document.getElementById("password").value

            if (userName && passWord) {
                Login(userName, passWord)
            }
            else {
                alert("Please provide a valid user and password")
            }

        })
    }
    else {
        console.log("Existe un usuario en el localStorage:")
        console.log(user)
        const SuperSecretToken = "11122223334445556677899"
        const redirecturl = `http://localhost:3001/postlogin?username=${user.userName}&token=${SuperSecretToken}`
        console.log("Redirection URL: " + redirecturl)
        window.location.href = redirecturl
    }




})

function Login(username, password) {
    const url = `http://localhost:3000/users?userName=${username}&PassWord=${password}`
    const SuperSecretToken = "11122223334445556677899"

    CallApi(url, "GET", {}).then(prom => {

        let isExist = false
        prom.forEach(element => {
            isExist = true
            console.log(element)
            localStorage.setItem("user", JSON.stringify(element))
        });

        if (isExist) {
            const redirecturl = `http://localhost:3001/postlogin?username=${username}&token=${SuperSecretToken}`
            console.log("Redirection URL: " + redirecturl)
            window.location.href = redirecturl
        }
        else {
            alert("User or password are incorrect");
        }
    })

}


function CallApi(url, method, data) {

    let config = {};
    const header = {
        'Content-Type': 'application/json'
    }


    if (method == "GET") {
        config = {
            method: method,
            headers: header
        }
    }
    else {
        config = {
            method: method,
            headers: header,
            body: JSON.stringify(data)
        }

    }

    return fetch(url, config).then(response => {
        return response.json()
    })
}




//   //Login
