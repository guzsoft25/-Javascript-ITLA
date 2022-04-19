/*
  Escribe un programa que pida 3 números y escriba en la pantalla el mayor de los tres.
*/

const prompt = require('prompt');
prompt.start();

prompt.get(['Number1','Number2','Number3'],function(err,result){
    let Number1 = Number(result.Number1);
    let Number2 = Number(result.Number2);
    let Number3 = Number(result.Number3);
    if(isNaN(Number1) || isNaN(Number2) || isNaN(Number3)){console.log("Todos los parámetros deben ser de tipo numérico");}
    else{
        if(Number1 > Number2 && Number1 > Number3){console.log(Number1.toString()+" Es Mayor");}
        else if(Number2 > Number1 && Number2 > Number3){console.log(Number2.toString()+" Es Mayor");}
        else if(Number3 > Number2 && Number3 > Number1){console.log(Number3.toString()+" Es Mayor");}
    }
});