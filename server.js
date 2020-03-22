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

// start at the homepage
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

//get the note list 
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
  readDBFile().then(data => setIndex(JSON.parse(data))) // set noteIndex to highest existing index
    .catch(err => res.json(err));
});

//return all existing notes
app.get("/api/notes", function(req, res) {
  readDBFile().then(data => {
    res.json(data)})
    .catch(err => res.json(err)
  );
});


//Save new note
app.post("/api/notes", function({ body }, res) {

  let newNote = {title: body.title, text: body.text, id: noteIndex};
  let array = [];
  readDBFile().then(data => {
      if(data){
        array = JSON.parse(data);
        setIndex(array);
      }
      newNote.id = noteIndex;
      noteIndex++;
      array.push(newNote);
      fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(array), err => {});
    }).catch(err=> res.json(err));

  res.json(newNote);
});

// delete selected file
app.delete("/api/notes" + "*", function(req, res) { // use wildcard to catch any id

  let urlID = req.originalUrl.slice(req.originalUrl.length - 3); // get last 3 digits of request url
  let index;

  //get the correct index from the request url
  // accounts for 3 digit indexes
  if(parseInt(urlID[0])){           
    index = urlID;  
  } else if(parseInt(urlID[1])){
    index = req.originalUrl.slice(req.originalUrl.length - 2);
  } else{
    index = req.originalUrl.slice(req.originalUrl.length - 1);
  }

  readDBFile().then(data => { // get the existing database file
    let array = JSON.parse(data);
    let newFile = array.filter(i => String(i.id) !== String(index)); // get all the elements that do not match the id to delete
    //save everything but the file to delete
    fs.writeFile(`${__dirname}/db/db.json`, JSON.stringify(newFile), err => {});

  })
  .catch(err =>res.json(err));

  res.json(true);
});

// Return a promise of the asynchronus read function
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

//set index to 1 higher than highest existing index
function setIndex(data){
  data.forEach(element => {
    if (element.id > noteIndex){
      noteIndex = element.id + 1;
    }
  });
}

// Activate server listener
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });