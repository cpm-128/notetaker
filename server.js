// required packages
const express = require('express');
// front end can request data from:
const notes = require('./db/db.json');

// run on heroku port else local server
const PORT = process.env.PORT || 3001;

// instantiate the server
const app = express();

// notes routes to GET from server
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

// accept data from the client to be stored server-side
app.post('/api/notes', (req, res) => {
    // req.body is where out incoming content will be
    console.log(req.body);
    res.json(req.body);
});

// listen to server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}.`);
});