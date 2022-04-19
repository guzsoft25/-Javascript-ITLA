/*
  Escribe un programa que pida dos números y escriba en la pantalla cual es el mayor.
*/

const prompt = require('prompt');
prompt.start();

prompt.get(['Number1','Number2'],function(err,result){
     let Number1 = Number(result.Number1);
     let Number2 = Number(result.Number2);
     
     if(isNaN(Number1) || isNaN(Number2)){console.log("Ambos parámetros deben ser de tipo numérico");}
     else{
         if(Number1 > Number2){console.log(Number1.toString()+" Es Mayor");}
         else if(Number2 > Number1){console.log(Number2.toString()+" Es Mayor");}
     }
});

