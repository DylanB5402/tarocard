const express = require('express');
const Database = require('better-sqlite3');
const user_database = require('./user_database');

const db = new Database('users.db', {verbose: console.log});
const user_db = new user_database.UserDatabase(db);

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('static'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

  // 404, page can't be found
app.use(function (req, res) {
    res.status(404).send("404 page not found");
})