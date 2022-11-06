// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();
const cors = require('cors');
app.use(cors({
    origin:'*'
}));


app.get("/api", (req, res) => { // localhost:3001/api

    res.json({ message: "Hello from server!" });
});

app.get("/", (req, res) => { // localhost:3001
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});



app.get("/zubeProjects/request", (req, res) => { // localhost:3001/zubeProjects/request

    // dependencies
    var fs = require('fs');
    var async = require('async');
    var jsonwebtoken = require('jsonwebtoken'); // $ npm install jsonwebtoken
    var request = require('request');

    var client_id = "e931c1d4-434e-11ed-980d-df355d201f91";
    var private_key = fs.readFileSync("C:\\Users\\chess\\Documents\\Important\\Programming Skills\\ReactJS\\application1\\server\\zube_api_key.pem");

    var now = Math.floor(Date.now() / 1000);
    var refresh_jwt = jsonwebtoken.sign({
        iat: now,      // Issued at time
        exp: now + 60, // JWT expiration time (10 minute maximum)
        iss: client_id // Your Zube client id
    }, private_key, { algorithm: 'RS256' });
  
    //to get token
    var headers = {
        'Authorization': 'Bearer ' + refresh_jwt,              
        'X-Client-ID': client_id,               
        'Accept': 'application/json'    
    };
    
    var options = {
        url: 'https://zube.io/api/users/tokens',
        method: 'POST',
        headers: headers
    };
    
    var token;
    var data; var info;
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            // console.log("token");
            // console.log(body);
            data = JSON.parse(body);
            token = data.access_token;

            headers = {
                'Authorization': 'Bearer ' + token,
                'X-Client-ID': client_id,
                'Accept': 'application/json'
            };
            
            options = {
                url: 'https://zube.io/api/projects',
                headers: headers
            };
            
            function callZube(error, response, body) {
                if (!error && response.statusCode == 200) {
                    info = JSON.parse(body);

                    res.json({ 'name': info.data[0].name });
                }
            }
            
            request(options, callZube);

        }
    }

    request(options, callback);

    // console.log("Token outside callback function: " + token + data);

//   // to invoke Zube API
  
//   zubeheaders = {
//     'Authorization': 'Bearer ' + token,
//     'X-Client-ID': "e931c1d4-434e-11ed-980d-df355d201f91",
//     'Accept': 'application/json'
//   };

//   zubeoptions = {
//     url: 'https://zube.io/api/projects',
//     headers: zubeheaders
//   };

//   function zubecallback(error, response, body) {
//      console.log("zubecallback");
//      console.log(error);
//      console.log(response.statusCode);

//      if (!error && response.statusCode == 200) {
//          console.log(body);
//      }
//   }

});
