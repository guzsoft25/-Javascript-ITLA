/*
  Escribe un programa de tres líneas que pida un número, pida otro número y escriba el resultado de sumar estos dos números.
*/

const readLine = require('prompt');
readLine.start();

readLine.get(['Numero1','Numero2'],function(err,result){
    let sum = Number(result.Numero1) + Number(result.Numero2);

    if(isNaN(sum)){console.log("Ambos parámetros deben ser de tipo numérico");}
    else {
      console.log(sum);
    }
});

