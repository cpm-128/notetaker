// required packages
const express = require('express');
// front end can request data from:
const notes = require('./db/db.json');

// instantiate the server
const app = express();

// notes routes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// listen to server
app.listen(3001, () => {
    console.log(`API server now on port 3001`);
});