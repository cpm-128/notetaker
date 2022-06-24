// required packages
const express = require('express');
const fs = require('fs');
const path = require('path');
// front end can request data from:
const { notes } = require('./db/db.json')

// run on heroku port else local server
const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();

// MIDDLEWARE: how to handle incoming data from POST requests
app.use(express.urlencoded({ extended: true}));
app.use(express.json());

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
    // OK if note text is empty so we will not be validating that
    return true;
}

// notes routes to GET from server
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// accept data from the client to be stored server-side
app.post('/api/notes', (req, res) => {
    // set id based on what the index of the array will be
    //TODO: considering changing this to random npm packge. deleting notes may result in duplicate id values
    req.body.id = notes.length.toString();

    // pass through validation function before creating note
    if (!validateNote(req.body)) {
        res.status(400).send('The note is missing a proper title.')
    } else {
        // add animal to JSON file and animals array in this function
            const note = createNewNote(req.body, notes);
        // note is where out incoming content will be
            res.json(note);
    }
});

// listen to server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
});