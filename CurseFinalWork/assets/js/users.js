$(document).ready(function () {


    GetAllUsers()

    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal

        var elmId = button.attr("id");

        if (elmId === "btnNewUser") {
            console.log("Nuevo usuario")
        }
        else if (elmId === "btnUpdate") {

            //load data of user into Form
            var userId = button.data('whatever')

            console.log("Modificar usuario " + userId)
        }

    })

    $("#btnDelete").on('click', function () {

        let userId = $("#btnDelete").attr('value')
        swal({
            title: "Are you sure ?",
            text: "You want to delete user: " + userId,
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    swal("User was deleted successfully", {
                        icon: "success",
                    });
                } else {
                    swal("Operation canceled!");
                }
            });
    })

})

function GetAllUsers(){
  
    let url = 'http://localhost:3000/users'

    CallApi(url,"GET",{}).then(promiseUsers => {
        promiseUsers.forEach(user => {
            
            const role = user.Role === 1 ? "Administrator":"User"

            $('#userTable tr[class=autoRow]').remove()

            const data = `<tr class="autoRow">
            <th scope="row">${user.id}</th>
            <td>${user.name}</td>
            <td>${user.userName}</td>
            <td>${role}</td>
            <td>
               <button type="button" class="btn btn-primary" value="${user.id}" id="btnUpdate" data-toggle="modal" data-target="#exampleModal" data-whatever="${user.id}" ><i class="fas fa-edit"></i></button>
               <button type="button" class="btn btn-danger" value="${user.id}" id="btnDelete"><i class="far fa-trash-alt"></i></button>
            </td>
       </tr>`
        $('#userTable tr:last').after(data);
         console.log(data)
        });
    });
}


function GetUserById(id){
    
}

function CallApi(url,method,data){

    let config = {};
    const header = {
         'Content-Type':'application/json'
    }


     if(method == "GET") {
         config = {
             method:method,
             headers:header
         }
     }
     else {
       config = {
           method:method,
           headers:header,
           body:JSON.stringify(data)
       }

     }

     return fetch(url,config).then(response => {
          return response.json()
     })
}