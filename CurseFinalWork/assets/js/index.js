$(document).ready(function(){

    const logOut = document.getElementById("btnLogout")   
    
    
    logOut.addEventListener("click",function(){
        
        console.log("Removing user and session...")
        localStorage.removeItem("user")
        const redirecturl = `http://localhost:3001/logout`

        console.log("Redirection URL: " + redirecturl)
        window.location.href = redirecturl

    })

})