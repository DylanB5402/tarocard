const express = require('express')
const Database = require('better-sqlite3')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const userDatabase = require('./user_database')

// const db = new Database('databases/users4.db', {verbose: console.log});
const db = new Database('databases/users4.db')
const userDB = new userDatabase.UserDatabase(db)

const store = new KnexSessionStore()

const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(express.static('static'))
app.use(session({
  secret: 'ahjintpcc',
  store: store,
  saveUninitialized: false,
  resave: false
}

))

app.post('/signup', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const repeatPassword = req.body.repeatPassword
  if (password !== repeatPassword) {
    res.redirect('/signup.html')
  } else {
    const result = userDB.insertNewUser(email, password)
    if (result === userDatabase.InsertNewUserResult.SUCCESS) {
      userDB.logInUser(req, email, password)
      res.redirect('/home')
    }
  }
})

// app.post("/login")

// placeholder function
app.get('/home', (req, res) => {
  if (req.session['logged-in'] !== true) {
    res.send('please log in')
  } else {
    res.send('Welcome ' + req.session.email)
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 404, page can't be found
app.use(function (req, res) {
  res.status(404).send('404 page not found')
})
