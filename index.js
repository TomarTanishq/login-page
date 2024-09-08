import http from "http"
// import gfName1,{gfName2,gfName3} from "./features.js";
// import * as myObj from "./features.js"
// console.log(myObj.gfName1);
// console.log(myObj.gfName2);
// console.log(myObj.gfName3);

import { generateLovePercent } from "../features.js"

import fs from "fs"

const home=fs.readFileSync("./index.html")

const server = http.createServer((req, res) => {
    // console.log(req.url);
    // res.end("<h1>Noice<h1/><br><p>This is response<p/>")

    if (req.url === "/about") {
        res.end(`<h1>Love is ${generateLovePercent()}<h1/>`)
    }
    // else if (req.url === "/") {
    //     fs.readFile("./index.html", (err, home) => {
    //         res.end(home)
    //     })
    else if(req.url==="/"){
        res.end(home)
    }
    
    else if (req.url === "/contact") {
        res.end("<h1>Contact page<h1/>")
    } else {
        res.end("<h1>Page not found<h1/>")
    }

})



server.listen(5000, () => {
    console.log("Server working");
})