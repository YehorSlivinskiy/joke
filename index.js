import http from "http"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"


let __filename = fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

let datapath = path.join(__dirname, "data")

let server = http.createServer((req, res)=>{
    if(req.url == "/jokes" && req.method == "GET"){
    getAllJokes(req, res)  
    }
    else if (req.url == "/jokes" && req.method == "POST"){
        addNewJoke(req, res);
    }
    else{
        res.end("<h1>eheheheh</h1>")
    }
})

server.listen(3333)

function getAllJokes(req, res){
    let dir = fs.readdirSync(datapath)
    let allJokes = []
    for(let i = 0; i < dir.length; i++){
        let file = fs.readFileSync(path.join(datapath, i + ".json"))
        let jokeJson = Buffer.from(file).toString()
        let joke = JSON.parse(jokeJson)
        joke.id = i
        allJokes.push(joke)
    }
    res.end(JSON.stringify(allJokes))
}

function addNewJoke(req, res){
    let data = ""
    req.on("data", function(chank){
        data += chank
    })
    req.on("end", function(){
        let joke = JSON.parse(data)
        joke.like = 0
        joke.dislike = 0
        let dir = fs.readdirSync(datapath)
        let filename = dir.length + ".json"
        let filepath = path.join(datapath, filename)
        fs.writeFileSync(filepath, JSON.stringify(joke));
        res.end();
    })
}
