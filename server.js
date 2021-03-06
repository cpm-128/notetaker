// required packages
const express = require('express');
const fs = require('fs');
const path = require('path');
// front end can request data from:
const { notes } = require('./db/db.json')
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

// run on heroku port else local server
const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();

// MIDDLEWARE: how to handle incoming data from POST requests
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
// MIDDLEWARE: front-end resources
app.use(express.static('public'));

// FUNCTIONS
function createNewNote(body, notesArray) {
    // main code
    const note = body;
    notesArray.push(note);
    // actually write to the file
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );

    // return finished code to post route for response
    return note;
}

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    // OK if note text is empty so we will not be validating that
    return true;
}

function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
}

// API ROUTES

// notes routes to GET from server
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

//TODO: make this delete request fully functioning
// DELETE note by id
// app.delete('/api/notes/:id', (req, res) => {
//     const deleteNote = req.params.id;

//     // read all the notes from the db.json file
//     notes = notes.filter(thisNote => {
//         // remove the note with the given id property
//         deleteNote(deleteNote);
//     });

//     // rewrite the notes fomr db.json
//     fs.writeFileSync('./db/db.json', JSON.stringify(notes));
//     res.json(notes);
// });

// accept data from the client to be stored server-side
app.post('/api/notes', (req, res) => {
    // set id based on random generated
    req.body.id = uuid();

    // pass through validation function before creating note
    if (!validateNote(req.body)) {
        res.status(400).send('The note is missing a proper title or description. Both are required.')
    } else {
        // add animal to JSON file and animals array in this function
            const note = createNewNote(req.body, notes);
        // note is where out incoming content will be
            res.json(note);
    }
});

// HTML RUTES

// notes route to return notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// wildcart route to return index.html *ORDER MATTERS, this is last to not overwrite anything else
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// LISTEN to server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
});