//Methods for interaction here..

$(document).ready(function () {

    GetAllCustomers()


    $('#exampleModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal

        var elmId = button.attr("id");

        const btnUpdate = document.getElementById("btnSubmit");

        if (elmId === "btnNewCustomer") {
            console.log("New Customer")
            btnUpdate.value = "new"
            ClearModal()

        }
        else if (elmId === "btnUpdate") {

            btnUpdate.value = "update"
            ClearModal()

            //load data of user into Form
            var customerId = button.data('whatever')

            console.log("Updating Customer " + customerId)

            //Populate Edit Form
            GetCustomerById(customerId,true)
        }

    })

    const btnUpdate = document.getElementById("btnSubmit");
    btnUpdate.addEventListener("click", function () {

        let action = btnUpdate.value;

        const customerId = document.getElementById("Id").value;
        const Name = document.getElementById("Name").value;
        const Email = document.getElementById("Email").value;
        const Adress = document.getElementById("Address").value;
        const CreateAt = document.getElementById("createAt").innerHTML;

        if (action === "update") {

            //Create object here...
            const customer = {
                id: customerId,
                name: Name,
                email: Email,
                address: Adress,
                createAt: CreateAt //Date.now().toString()
            }

            console.log("Update Customer Object:")
            console.log(customer)

            //Call update here...
            UpdateCustomer(customer)

            //Refresh List
            GetAllCustomers()

            $('#exampleModal').modal('toggle');

        }
        else if (action === "new") {
            //Call new here...
            //Create object here...

            if (Name && Email && Email) {

                const customer = {
                    name: Name,
                    email: Email,
                    address: Adress,
                    createAt: new Date(Date.now()).toLocaleString().split(',')[0]
                }

                CreateCustomer(customer)
                GetAllCustomers();
                $('#exampleModal').modal('toggle');
            }
            else {

                alert("Fields are null or empty")

            }
        }
    })


    $('#exampleModal2').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal

        var customerId = button.data('whatever')
       
        GetCustomerById(customerId,false);
        PopulateIteration();


    })


  
    //Customer interactions
    const btnIteration = document.getElementById("btnSubmititeration");

    btnIteration.addEventListener("click",function(){
        
        const iterationType = document.getElementById("iterationList").value
        const note = document.getElementById("note").value

    
        if(note && iterationType) {
            
            //Get Customer here...
            const customer = JSON.parse(localStorage.getItem("customer"))

            //Get User Here..
            const user = JSON.parse(localStorage.getItem("user"))

            //Create Object Here...
            const iteration = {
                createAt:new Date(Date.now()).toLocaleString().split(',')[0],
                note:note,
                type:iterationType,
                status:"Open",
                closeAt:"",
                closeNote:"",
                user:{
                    id:user.id,
                    name:user.name
                },
                customer:{
                    id:customer.id,
                    name:customer.name,
                    email:customer.email,
                    address:customer.address
                }
            }
           
            console.log(iteration)
            CreateCustomerIteration(iteration)
            alert("Iteration was created successfully");
            $('#exampleModal2').modal('toggle');
            ClearModal();
        }
        else {
           alert("Note and iteration type are required")
        }
    })
})



//Submit Methods
function GetAllCustomers() {

    let url = 'http://localhost:3000/customers'

    CallApi(url, "GET", {}).then(promiseUsers => {

        $('#customerTable tr[class=autoRow]').remove()

        promiseUsers.forEach(customer => {

            const data = `<tr class="autoRow">
            <th scope="row" class="register-id">${customer.id}</th>
            <td>${customer.name}</td>
            <td class="register-email">${customer.email}</td>
            <td>${customer.address}</td>
            <td>${customer.createAt}</td>
            <td>
               <button type="button" class="btn btn-primary" value="${customer.id}" id="btnUpdate" data-toggle="modal" data-target="#exampleModal" data-whatever="${customer.id}" ><i class="fas fa-edit"></i></button>
               <button type="button" class="btn btn-success" value="${customer.id}" id="btnNewInteraction" data-toggle="modal" data-target="#exampleModal2" data-whatever="${customer.id}" ><i class="fas fa-commenting"></i></button>
               <button type="button" class="btn btn-danger" value="${customer.id}" id="btnDelete${customer.id}"><i class="far fa-trash-alt"></i></button>
            </td>
       </tr>`
            $('#customerTable tr:last').after(data);

            const btnDelete = document.getElementById(`btnDelete${customer.id}`);

            btnDelete.addEventListener("click", function () {
                console.log("Entre al metodo eliminar");

                swal({
                    title: "Are you sure ?",
                    text: "You want to delete customer: " + customer.id,
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {

                            //delete logic
                            DeleteCustomerById(customer.id)
                            GetAllCustomers()
                        } else {
                            ClearModal()

                        }
                    });
            })

        });
    });
}

function DeleteCustomerById(id) {
    let url = `http://localhost:3000/customers/${id}`

    CallApi(url, "DELETE", {}).then(prom => {
        console.log(prom)

    })
}

function GetCustomerById(id,isPopulate) {
    let url = `http://localhost:3000/customers/${id}`

    CallApi(url, "GET", {}).then(prom => {
        console.log(prom)

        let customerId = prom.id
        let name = prom.name
        let email = prom.email
        let address = prom.address
        let createAt = prom.createAt

        if(isPopulate){
           document.getElementById("Id").value = customerId;
           document.getElementById("Name").value = name;
           document.getElementById("Email").value = email;
           document.getElementById("Address").value = address;
           document.getElementById("createAt").innerHTML = createAt;
        }

        //Create Local Storage Here....
        const c_customer = {
            id: customerId,
            name: name,
            email: email,
            address: address
        }

        localStorage.setItem("customer", JSON.stringify(c_customer))
        

    }).catch(function (e) {
        console.log(e);

        Swal.fire({
            icon: 'error',
            title: 'Customer not found',
            text: `The customer of id ${id} was not found`,
            footer: 'Please validate your internet connection'
        })
    });

}

function UpdateCustomer(customer) {
    let url = `http://localhost:3000/customers/${customer.id}`

    CallApi(url, "PUT", customer).then(prom => {
        console.log(prom)
    })
}

function CreateCustomer(customer) {

    //evaluate if username already exist
    if (!FindTableEmail(customer.email)) {
        let url = "http://localhost:3000/customers"

        CallApi(url, "POST", customer).then(prom => {
            console.log(prom)
        })
    }
    else {
        alert(`Customer email ${customer.email} is already in use`)
    }

}


function CreateCustomerIteration(iteration) {
        let url = "http://localhost:3000/interactions"

        CallApi(url, "POST", iteration).then(prom => {
            console.log(prom)

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



function PopulateIteration() {
    const url = "http://localhost:3000/interactionTypes"

    console.log("Populate iteration");
    $('#iterationList option').remove()

    CallApi(url, "GET", {}).then(prom => {

        console.log(prom);

        prom.forEach(iteration => {
        
            $('#iterationList').append($('<option>', {
                value: iteration.type,
                text: iteration.type
            }));
        });
    })

}


//DOM Utilities
function ClearModal() {
    document.getElementById("Id").value = "";
    document.getElementById("Name").value = "";
    document.getElementById("Email").value = "";
    document.getElementById("Address").value = "";
    document.getElementById("createAt").innerHTML = "";

    document.getElementById("note").innerHTML = "";
    document.getElementById("note").innerHTML = "";

}


function FindTableEmail(email) {
    let alreadyExist = false

    let table = document.querySelectorAll("#customerTable td.register-email");

    for (const iterator of table) {
        let currentEmail = iterator.innerHTML;

        console.log("Current email: " + currentEmail);
        console.log("Parameter email: " + email);

        if (currentEmail == email) {
            alreadyExist = true;
            break;
        }
        else {
            alreadyExist = false
            continue;
        }
    }

    console.log("customer email already Exist? " + alreadyExist)
    return alreadyExist
}