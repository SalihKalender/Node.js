/*
    WELCOME, After entering the user information, we will redirect it back to the homepage and create a txt file and write the information it entered
    We will show the 404.html page when user enters other pages,
    If we can't find it in 404.html, we'll show text on the page
*/ 

const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const server = http.createServer((req,res)=>{
    const method = req.method;
    const url = req.url;
    if(url == "/") {
        fs.readFile("index.html",(err,data)=>{
            if(err) {
                fs.readFile("404.html",(err,data)=>{
                    res.statusCode = 404;
                    if(err) {
                        res.setHeader("Content-Type","text/plain");
                        res.statusMessage = "We didn't Find any Data";
                        res.write("File is not Found");
                        res.end();
                    }
                    else {
                        res.setHeader("Content-Type","text/html");
                        res.statusMessage = "We didn't find this page";
                        res.write(data);
                        res.end();
                    }
                })
            }
            else {
                res.setHeader("Content-type","text/html");
                res.statusCode = 200;
                res.statusMessage = "OK";
                res.write(data);
                res.end();
            }
        });
    }
    /*
        After filling the form, it will be directed back to the homepage.
    */
    else if(url == "/log" && method == "POST") {
        /*
            Creating and saving the information entered by the user in a txt file
        */
        let bodyParser = [];

        req.on("data",(chunk)=>{
            bodyParser.push(chunk);
        });
        req.on("end",()=>{
            let message = Buffer.concat(bodyParser).toString();
            let infos = qs.parse(message);
            console.log(infos);
            /*
                Create a new txt document and save the entered information
            */
            let informations = `Username = ${infos.Username}\nPassword = ${infos.Password}`
            fs.writeFile("informations.txt",informations,(err,data)=>{
                if(err) {
                    console.log(err)
                }
                else {
                    console.log("User information received and file created");
                }
            })
        });
        res.setHeader("Location","/");
        res.statusCode = 302;
        res.statusMessage = "Going to the Homepage";
        res.end();
    }
    else {
        fs.readFile("404.html",(err,data)=>{
            if(err) {
                res.setHeader("Content-type","text/plain");
                res.statusCode = 404;
                res.statusMessage = "We didn't Find any Data";
                res.write("File is not Found");
                res.end();
            }
            else {
                res.setHeader("Content-Type","text/html");
                res.statusCode = 404;
                res.statusMessage = "We didn't find this page";
                res.write(data);
                res.end();
            }
        })
    }
});
server.listen(3000);
console.log("server is listening on 3000 port");

