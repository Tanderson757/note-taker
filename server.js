const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML ROUTES
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./db/db.json"));
});

app.get("/api/notes/:id", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(savedNotes[Number(req.params.id)]);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.post("/api/notes", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let newNote = req.body;
  let uniqueID = savedNotes.length.toString();
  newNote.id = uniqueID;
  savedNotes.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  console.log("Note saved!");
  console.log(newNote);
  res.json(savedNotes);
});

app.delete("/api/notes/:id", function (req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = req.params.id;
  let newID = 0;

  console.log("Deleted note!");
  savedNotes = savedNotes.filter((currNote) => {
    return currNote.id != noteID;
  });

  for (currNote of savedNotes) {
    currNote.id = newID.toString();
    newID++;
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.listen(PORT, function () {
  console.log(`Server is running on http://localhost:${PORT}`);
});