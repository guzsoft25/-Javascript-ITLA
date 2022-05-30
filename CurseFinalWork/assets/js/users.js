$(document).ready(function () {
  

    GetAllUsers()

    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal

        var elmId = button.attr("id");

        const btnUpdate = document.getElementById("btnSubmit");

        if (elmId === "btnNewUser") {
            console.log("Nuevo usuario")
            btnUpdate.value = "new"
            ClearModal()

        }
        else if (elmId === "btnUpdate") {

            btnUpdate.value = "update"
            ClearModal()

            //load data of user into Form
            var userId = button.data('whatever')

            console.log("Modificando usuario " + userId)

            //Populate Edit Form
            GetUserById(userId)
        }

    })
 

    const btnUpdate = document.getElementById("btnSubmit");


    btnUpdate.addEventListener("click", function () {

        let action = btnUpdate.value;


        const UserId = document.getElementById("Id").value
        const Name = document.getElementById("Name").value
        const UserName = document.getElementById("User").value
        const Password = document.getElementById("Password").value

        if (action === "update") {

            //Create object here...
            const user = {
                id: UserId,
                name: Name,
                userName: UserName,
                PassWord: Password
            }
            console.log("Update User Object:")
            console.log(user)

            //Call update here...
            UpdateUser(user)

            //Refresh List
            GetAllUsers()

            $('#exampleModal').modal('toggle');

        }
        else if (action === "new") {
            //Call new here...
            //Create object here...

            if (Name && UserName && Password) {
                const user = {
                    name: Name,
                    userName: UserName,
                    PassWord: Password
                }
                CreateUser(user)
                GetAllUsers();
                $('#exampleModal').modal('toggle');
            }
            else {
                
               alert("Fields are null or empty")

            }
        }
    })

})

function GetAllUsers() {

    let url = 'http://localhost:3000/users'

    CallApi(url, "GET", {}).then(promiseUsers => {

        $('#userTable tr[class=autoRow]').remove()
        promiseUsers.forEach(user => {

            const role = user.Role === 1 ? "Administrator" : "User"
            const data = `<tr class="autoRow">
            <th scope="row" class="register-id">${user.id}</th>
            <td>${user.name}</td>
            <td class="register-userName">${user.userName}</td>
            <td>${role}</td>
            <td>
               <button type="button" class="btn btn-primary" value="${user.id}" id="btnUpdate" data-toggle="modal" data-target="#exampleModal" data-whatever="${user.id}" ><i class="fas fa-edit"></i></button>
               <button type="button" class="btn btn-danger" value="${user.id}" id="btnDelete${user.id}"><i class="far fa-trash-alt"></i></button>
            </td>
       </tr>`
            $('#userTable tr:last').after(data);

            const btnDelete = document.getElementById(`btnDelete${user.id}`);

            btnDelete.addEventListener("click", function () {
                console.log("Entre al metodo eliminar");

                swal({
                    title: "Are you sure ?",
                    text: "You want to delete user: " + user.id,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {

                            //delete logic
                            DeleteUserById(user.id)
                            GetAllUsers()
                            //swal("User was deleted successfully", {
                            //icon: "success",
                            //});


                        } else {
                            //swal("Operation canceled!");
                            ClearModal()

                        }
                    });
            })

        });
    });
}

function GetUserById(id) {
    let url = `http://localhost:3000/users/${id}`

    CallApi(url, "GET", {}).then(prom => {
        console.log(prom)

        let userId = prom.id
        let name = prom.name
        let userName = prom.userName
        let PassWord = prom.PassWord
        let Role = prom.Role

        document.getElementById("Id").value = userId;
        document.getElementById("Name").value = name;
        document.getElementById("User").value = userName;
        document.getElementById("Password").value = PassWord;


    }).catch(function (e) {
        console.log(e);

        Swal.fire({
            icon: 'error',
            title: 'User not found',
            text: `The user of id ${id} was not found`,
            footer: 'Please validate your internet connection'
        })
    });

}

function DeleteUserById(id) {
    let url = `http://localhost:3000/users/${id}`

    CallApi(url, "DELETE", {}).then(prom => {
        console.log(prom)

    })
}

function UpdateUser(user) {
    let url = `http://localhost:3000/users/${user.id}`

    CallApi(url, "PUT", user).then(prom => {
        console.log(prom)
    })
}

function CreateUser(user) {

    //evaluate if username already exist
    if (!FindTableUserName(user.userName)) {
        let url = "http://localhost:3000/users"

        CallApi(url, "POST", user).then(prom => {
            console.log(prom)
        })
    }
    else {
        alert(`User name ${user.userName} is already in use`)
    }

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


//DOM Function
function ClearModal() {
    document.getElementById("Id").value = "";
    document.getElementById("Name").value = "";
    document.getElementById("User").value = "";
    document.getElementById("Password").value = "";
}


function FindTableUserName(userName) {
    let alreadyExist = false

    let table = document.querySelectorAll("#userTable td.register-userName");

    for (const iterator of table) {
        let currentuserName = iterator.innerHTML;

        console.log("Current UserName: " + currentuserName);
        console.log("Parameter UserName: " + userName);

        if (currentuserName == userName) {
            alreadyExist = true;
            break;
        }
        else {
            alreadyExist = false
            continue;
        }
    }

    console.log("User Name already Exist? " + alreadyExist)
    return alreadyExist
}