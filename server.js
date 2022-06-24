// required packages
const express = require('express');
// front end can request data from:
const notes = require('./db/db.json');

// run on heroku port else local server
const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();

// notes routes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// listen to server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
});