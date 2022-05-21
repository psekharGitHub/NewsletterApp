const express = require("express");

const request = require("request");

const bodyParser = require("body-parser")

const https = require("https"); 

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res) {
    const firstname = req.body.firstname ;
    const lastname = req.body.lastname ;
    const email = req.body.email ;
    console.log(firstname + " " + lastname);

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };
    //Flatten the json data
    const jsonData = JSON.stringify(data);
    
    const url = "https://us10.api.mailchimp.com/3.0/lists/c6b1b579ad";

    //basic https authentication
    const options = {
        method: "POST",
        auth: "purnendu:ef8fcd8213b2cef7bef0a06dd136e27f-us10"
    };

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/sucess.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })
    
    //sending the data to mailchimp
    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is listening at port 3000");
})

// Api Key
// ef8fcd8213b2cef7bef0a06dd136e27f-us10


// List Id
// c6b1b579ad