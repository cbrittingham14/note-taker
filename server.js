var express = require("express");
var path = require("path");
var fs = require("fs");
let noteIndex = 0;

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", function(req, res) {
  readDBFile().then(data => {
    res.json(data)})
    .catch(err => res.json(err)
  );
});

app.post("/api/notes", function({ body }, res) {

  let newNote = {title: body.title, text: body.text, id: noteIndex};
  let array = [];
  readDBFile().then(data => {
      if(data){
        array = JSON.parse(data);
      }
      
      newNote.id = noteIndex;
      noteIndex++;
      console.log("note index: ", noteIndex);
      console.log("array", array);
      array.push(newNote);
      fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(array), err => console.log("err: ",err));
    }).catch(err=> console.log(err))

  console.log("body ", body);
  res.json(newNote);
});


app.delete("/api/notes" + "*", function(req, res) {

  console.log("req route sliced :  ",req.originalUrl.slice(req.originalUrl.length - 3));
  let urlID = req.originalUrl.slice(req.originalUrl.length - 3);
  let index;

  if(parseInt(urlID[0])){           //get index of note to delete
    index = urlID;
  } else if(parseInt(urlID[1])){
    index = req.originalUrl.slice(req.originalUrl.length - 2);
  } else{
    index = req.originalUrl.slice(req.originalUrl.length - 1);
  }
  console.log("index ", index);

  readDBFile().then(data => {
    let array = JSON.parse(data);
    console.log("array data : ", array);
    let newFile = array.filter(i => String(i.id) !== String(index));
    console.log("new file ", newFile);
    fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(newFile), err => console.log("err: ",err));

  })
  .catch(err =>{console.log("returned error ", err)});

  res.json(true);
});

function readDBFile() {

  return new Promise(function(resolve, reject) {
    fs.readFile(`${__dirname}/db/db.json`, "utf8", function(err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  });
}


// Activate server listener
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });