/*
   Escribe un programa que pida un número y diga si es divisible por 2.
*/
const prompt = require('prompt');
prompt.start();


prompt.get(['Number1'],function(err,result){
    let Number1 = Number(result.Number1);
    if(isNaN(Number1)){console.log("El parámetro debe ser de tipo numérico");}
    else{
         if(Number1%2 === 0){console.log("El número es divisible por 2");}
         else
         {
             console.log("El número no es divisible por 2");
         }
    }
});