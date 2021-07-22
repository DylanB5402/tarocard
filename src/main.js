const express = require('express');
const Database = require('better-sqlite3');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const user_database = require('./user_database');

// const db = new Database('databases/users4.db', {verbose: console.log});
const db = new Database('databases/users4.db');
const user_db = new user_database.UserDatabase(db);

const store = new KnexSessionStore();

const app = express();
const port = 3000;

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('static'));
app.use(session( {
  secret: 'ahjintpcc',
  store: store,
  saveUninitialized: false,
  resave: false
}

))

// curl -X POST -d 'email=email@email.com&password=password&repeatPassword=password' 'http://localhost:3000/signup'
app.post("/signup", (req, res) => {
  var email = req.body["email"];
  var password = req.body["password"];
  var repeatPassword = req.body["repeatPassword"];
  if (password != repeatPassword) {
    res.redirect("/signup.html");
  } else {
    var result = user_db.insertNewUser(email, password);
    if (result == user_database.InsertNewUserResult.SUCCESS) {
      user_db.logInUser(req, email, password);
      res.redirect('/home');
    }
  }
})

app.get("/home", (req, res) => {
  if (req.session["logged-in"] != true) {
    res.send("please log in");
  } else {
    res.send("Welcome " + req.session["email"]);
  }
}) 

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

  // 404, page can't be found
app.use(function (req, res) {
    res.status(404).send("404 page not found");
})