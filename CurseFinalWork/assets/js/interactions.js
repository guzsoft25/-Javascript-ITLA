$(document).ready(function(){
   
     //remove localStorage
     localStorage.removeItem("iteration")
         
     //Load all the Interactions
     GetAllInteractions();

    $('#exampleModal').on('show.bs.modal', function (event) {

       var button = $(event.relatedTarget) // Button that triggered the modal
       var elmId = button.attr("id");

      //load data of user into Form
       var iterationId = button.data('whatever')
      
       getIterationById(iterationId,true)
    })


    $('#exampleModal2').on('show.bs.modal', function (event) {

        var button = $(event.relatedTarget) // Button that triggered the modal
        //var elmId = button.attr("id");
 
       //load data of user into Form
        var iterationId = button.data('whatever')
       
        //Get Iteration from Api Service
        getIterationById(iterationId,false)

        const iteration = JSON.parse(localStorage.getItem("iteration"))

        document.getElementById("txtIterationId").value = iteration.id
        document.getElementById("txtCustomerName").value = iteration.customer.name
        document.getElementById("txtIterationType").value = iteration.type
        document.getElementById("txtIterationStatus").value = iteration.status
        document.getElementById("txtIterationNote").value = iteration.note
        document.getElementById("txtCloseDate").value = iteration.closeAt
        document.getElementById("txtCloseNote").value = iteration.closeNote
        document.getElementById("txtCreatedBy").value = iteration.user.name

     })

     const removeBtn2 = document.getElementById("btnCloseModal2")

     removeBtn2.addEventListener("click",function(){
           console.log("Removing Iteration")
           localStorage.removeItem("iteration")
           clearModal()
          })

          
    const removeBtn = document.getElementById("btnCloseModal")

    removeBtn.addEventListener("click",function(){
           console.log("Removing Iteration")
           localStorage.removeItem("iteration")
         
         })

   
   const completeBtn = document.getElementById("btnSubmit")

   completeBtn.addEventListener("click",function(){
       const iteration = JSON.parse(localStorage.getItem("iteration"))

       const  completionNote = document.getElementById("completeNote").value

       if(completionNote){
        
        iteration.closeNote = completionNote
        iteration.closeAt = new Date(Date.now()).toLocaleString().split(',')[0]
        iteration.status = "Completed"
        
        //Call Update Iteration Here...
        UpdateIteration(iteration)

        //Call Get all Iteration Here
        GetAllInteractions()

        //Clear Modal
        clearModal()

        //Close Modal
        $('#exampleModal').modal('toggle');

       }
       else {
        alert("Please provide a completion note")
       }

      
   })
})


function GetAllInteractions() {

   const url = "http://localhost:3000/interactions"


    CallApi(url,"GET",{}).then(prom=>{

        $("#mainCards").empty()

          prom.forEach(element => {
               
               //Icon for iteration type
               let iterationTypeIcon = ""
               switch (element.type) {
                   case "Meeting":
                      iterationTypeIcon = "fa fa-commenting"
                       break;
                    case "Call":
                       iterationTypeIcon = "fa fa-phone"
                      break;

                    case "Support":
                       iterationTypeIcon = "fa fa-user-md"
                     break;

                   default:
                       iterationTypeIcon = "fa fa-spinner"
                     break;
               }
               
               //Icon for Iteration Status
               let iterationStatusIcon = ""
               let iterationStatusColor = ""
               let isActionButtonsDisabled = ""

               switch (element.status) {
                   case "Open":
                    iterationStatusColor = "color:blue"
                    iterationStatusIcon = "fa fa-square"
                    isActionButtonsDisabled = ""
                    break;
                   
                    case "Completed":
                        iterationStatusColor = "color:green"
                        iterationStatusIcon = "fa fa-check"
                        isActionButtonsDisabled = "disabled"
                        break;
                   
                    case "Canceled":
                        iterationStatusColor = "color:red"
                        iterationStatusIcon = "fa fa-ban"
                        isActionButtonsDisabled = "disabled"
                        break;
               }

               //Create html Div
               let uiElements = `<div class="col-xl-6 col-sm-6 col-12"> 
                                <div class="card">
                                    <div class="card-content">
                                    <h6 style="${iterationStatusColor};">${element.type} - (${element.status})</h6>
                                    <div class="card-body">
                                        <div class="media d-flex">
                                        <div class="align-self-center">
                                            <i class="${iterationTypeIcon} primary font-large-3 float-left"></i>
                                        </div>
                                        <div class="media-body text-right">
                                            <i class="${iterationStatusIcon}" style="${iterationStatusColor}; font-size:25px;" aria-hidden="true"></i>
                                            <h5>${element.customer.email}</h5>
                                            <h6>${element.note}</h6>
                                            <button class="btn btn-success" id="btnComplete${element.id}" data-toggle="modal" data-target="#exampleModal" data-whatever="${element.id}" ${isActionButtonsDisabled}><i class="fa fa-check" aria-hidden="true"></i></button>
                                            <button class="btn btn-danger" id="btnCancel${element.id}" ${isActionButtonsDisabled}><i class="fa fa-times" aria-hidden="true"></i></button>
                                            <button class="btn btn-primary" id="btnInfo${element.id}" data-toggle="modal" data-target="#exampleModal2" data-whatever="${element.id}" ><i class="fa fa-info-circle" aria-hidden="true"></i></button>
                                            
                                        </div>
                                        
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>`

          $("#mainCards").append(uiElements)
        
          const btnCancelIteration = document.getElementById(`btnCancel${element.id}`)
          
          btnCancelIteration.addEventListener("click",function(){

              //Populate LocalStorage Iteration
              getIterationById(element.id,false)

              swal({
                title: "Are you sure ?",
                text: "You want to cancelate iteration: " + element.id,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {

                        //Call Current Iteration Here.
                        const iteration = JSON.parse(localStorage.getItem("iteration"))
                        
                        //Get Canceled User
                        const user = JSON.parse(localStorage.getItem("user"))

                       //Set Cancelated values Here
                       iteration.closeNote = `Canceled by user ${user.name} - (${user.userName})`
                       iteration.closeAt = new Date(Date.now()).toLocaleString().split(',')[0]
                       iteration.status = "Canceled"

                       //Update Iteration Here..
                       UpdateIteration(iteration)

                       //Remove LocalStorage Here..
                       localStorage.removeItem("iteration")

                       //Call Get All Iteration Here..
                       GetAllInteractions()

                    } else {
                        //Remove LocalStorage Here..
                       localStorage.removeItem("iteration")

                    }
                });

          })
               
          });
    })

}


function getIterationById(id,isPopulate) {
   
    let url = `http://localhost:3000/interactions/${id}`

    CallApi(url, "GET", {}).then(prom => {
     
        let id = prom.id
        let type = prom.type
        let note = prom.note
        let createAt = prom.createAt
        let status = prom.status
        let closeAt = prom.closeAt
        let closeNote = prom.closeNote
        let user = prom.user
        let customer = prom.customer

        if(isPopulate){
           document.getElementById("Id").value = id;
        }


        //Create Object Here...
        /*
        const iteration = {
            id:id,
            createAt: createAt, //new Date(Date.now()).toLocaleString().split(',')[0],
            note:note,
            type:type,
            status:status,
            closeAt:closeAt,
            closeNote:closeNote,
            user:user,
            customer:customer
        }
        */
        console.log(prom)

        //Create Local Storage Here....
        localStorage.setItem("iteration", JSON.stringify(prom))
        

    })
}


function UpdateIteration(iteration) {
    let url = `http://localhost:3000/interactions/${iteration.id}`

    CallApi(url, "PUT", iteration).then(prom => {
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



function clearModal() {
    document.getElementById("completeNote").value = ""
    document.getElementById("Id").value = ""

    document.getElementById("txtIterationId").value = ""
    document.getElementById("txtCustomerName").value = ""
    document.getElementById("txtIterationType").value = ""
    document.getElementById("txtIterationStatus").value = ""
    document.getElementById("txtIterationNote").value = ""
    document.getElementById("txtCloseDate").value = ""
    document.getElementById("txtCloseNote").value = ""
    document.getElementById("txtCreatedBy").value = ""
}