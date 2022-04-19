/*
   Escribir un programa que nos diga si un número dado es primo (no es divisible por ninguno otro número que no sea él mismo o la unidad).
*/

const prompt = require('prompt');
prompt.start();

prompt.get(['Number1'],function(err,result){
    let Number1 = Number(result.Number1);
    if(isNaN(Number1)){console.log("El parámetro debe ser de tipo numérico");}
    else{
      let IsPrimo = true;
      for (let index = 2; index < Number1; index++) {
          if( (Number1%index) == 0){
               IsPrimo = false;
              break;
          }
          else{
              continue;
        }
      }

      if(!IsPrimo){
        console.log(Number1.toString()+" No es primo");
      }
      else{
        console.log(Number1.toString()+" es primo");
      }

    }
});


