function CallApi(url,method,data){

     let config = {};
     const header = {
          'Content-Type':'application/json'
     }


      if(method == "GET") {
          config = {
              method:method,
              headers:header
          }
      }
      else {
        config = {
            method:method,
            headers:header,
            body:JSON.stringify(data)
        }

      }

      return fetch(url,config).then(response => {
           return response.json()
      })
}