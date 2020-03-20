var express = require("express");
var path = require("path");
var fs = require("fs");


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;


let notes = [{title: "Title", text: "Text"}];

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

fs.readFile(`${__dirname}/db/db.json`, "utf8", (err, data)=>{
  if (err){
    console.log("error ", err);
  }
  console.log("data: ", data);
})
fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(notes), 'utf8', ()=>{
  console.log("notes",notes)
  fs.readFile(`${__dirname}/db/db.json`, "utf8", (err, data)=>{
    if (err){
      console.log("error ", err);
    }
    console.log("data: ", data);
  })
})

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  fs.readFile(`${__dirname}/db/db.json`, "utf8", (err, data)=>{
    if (err){
      throw err;
    }
    res.json(data);
  })
});

app.post("/api/notes", function(req, res) {

  let body = req.body;

  console.log("body ", body);
  readFile();
  // console.log("notes ", notes);
  // console.log(notes.length);

  // writeFile(notes);
  res.json(true);
});

app.delete("/api/notes", function(req, res) {
  fs.readFile('db/db.json', function(err, data){
    if(err){
      console.log(err);
    }
    console.log(data);
  })
  res.json(true);
});

function writeFile(notes){
  fs.writeFile(`${__dirname}/db/db.json`, notes, "utf8", ()=>{
    if(err){
      throw err
    }
    console.log(notes);
  });
}
function readFile() {
  fs.readFile(`${__dirname}/db/db.json`, "utf8", (err, data)=>{
    if (err){
      throw err;
    }
    console.log("data in read ", data);
    // return data;
  });
}

// Activate server listener
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });