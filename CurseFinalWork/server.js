//Creating Express instance
const express = require('express')
const session = require('express-session');
const https = require('https');
const path = require("path")
const app = express()

//setup view engine
app.set('view engine','ejs')

//Tokens
const SuperSecretToken = "11122223334445556677899"

app.use(session({
	secret: SuperSecretToken,
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));

app.get('/login',(req,res)=>{
    console.log("Entre al get del login!")
    if(req.session.loggedin === undefined || req.session.username === undefined){
        res.render(__dirname + '/assets/views/login',{title:"Login Page",message:""})
    }
    else{
       res.redirect('/');
    }
})


app.get("/postlogin",(req,res)=>{

    let userName = req.query.username
    let token = req.query.token

   if(userName && token) {
        
       console.log(`Request Token: ${token} Super Secret: ${SuperSecretToken}`)

        if(token===SuperSecretToken){
          
            req.session.loggedin = true;
            req.session.username = userName; 
            
            req.session.cookie.expires = Math.floor(Date.now() / 60e3)
            req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000  
            
            console.log(req.session);
            // Redirect to home page
            res.redirect('/');
        }
        else {
            res.render(__dirname + '/assets/views/login',{title:"Login Page",message:`user is aunautorized`})
        }

   }
   else {
       res.render(__dirname + '/assets/views/login',{title:"Login Page",message:`user is aunautorized`})
   }
})




app.post('/login',(req,res)=>{
    let username = req.body.username;
	let password = req.body.password;
    console.log("Entre al post del login!")
    if(username && password) {

        var isValidCredentials = true;
         
        if(isValidCredentials) {
            req.session.loggedin = true;
            req.session.username = username; 
            
            req.session.cookie.expires = Math.floor(Date.now() / 60e3)
            req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000  
            
            console.log(req.session);
            // Redirect to home page
            res.redirect('/');
        }
        else {
            res.render(__dirname + '/assets/views/login',{title:"Login Page",message:`user ${username} is aunautorized`})
        }

    }
    else {
        res.render(__dirname + '/assets/views/login',{title:"Login Page",message:"user and password is required"})
    }
})

app.get('/logout',(req,res)=>{
     console.log("Cerrando sessión")
     req.session.destroy();
     res.redirect('/login');
})

app.get('/',(req,res)=>{
   console.log("Entrando al main page!")
   if(req.session.loggedin && req.session.username) {
       res.render(__dirname + '/assets/views/index',{title:"Index Page",userName:req.session.username})
   }
   else{
      res.redirect('/login');
   }
        
})

app.get('/users',(req,res)=>{
    console.log("Entrando a Users!")
    if(req.session.loggedin && req.session.username) {
        res.render(__dirname + '/assets/views/users',{title:"User List Page",userName:req.session.username})
    }
    else{
       res.redirect('/login');
    }

})

app.get('/customers',(req,res)=>{
    res.render(__dirname + '/assets/views/customers',{title:"Customer List Page",userName:req.session.username})
})

app.get('/interactions',(req,res)=>{
    res.render(__dirname + '/assets/views/interactions',{title:"Customer and user interactions",userName:req.session.username})
})


//setup listeing port
app.listen(3001);



