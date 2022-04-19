/*
   Escribe un programa de dos líneas que pida el nombre del usuario con un prompt y escriba un texto que diga “Hola nombreUsuario”.
*/

const prompt = require('prompt'); prompt.start();

prompt.get(['nombreUsuario'],function(err,result){
    console.log("Hola "+result.nombreUsuario);
});