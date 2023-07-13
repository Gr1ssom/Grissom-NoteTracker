const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// HTML Routes
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();
  const notes = getNotes();
  notes.push(newNote);
  saveNotes(notes);
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;
  let notes = getNotes();
  notes = notes.filter((note) => note.id !== noteId);
  saveNotes(notes);
  res.sendStatus(200);
});

// Helper Functions
const getNotes = () => {
  const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
  return JSON.parse(data);
};

const saveNotes = (notes) => {
  fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes));
};

// Start the server
app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
