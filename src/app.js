const express = require('express')
const Database = require('better-sqlite3')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const userDatabase = require('./user_database')

// const db = new Database('databases/users4.db', {verbose: console.log});

class TaroCardApp {
  /**
     *
     * @param {String} database name of sqlite3 database
     */
  constructor (database) {
    if (database === undefined) {
      database = 'databases/taroCard.db'
    }
    const db = new Database(database)
    console.log(database)
    this.userDB = new userDatabase.UserDatabase(db)
    const store = new KnexSessionStore()
    this.app = express()
    this.app.use(express.json()) // for parsing this.application/json
    this.app.use(express.urlencoded({ extended: true })) // for parsing this.application/x-www-form-urlencoded
    this.app.use(express.static('static'))

    this.app.use(
      session({
        secret: 'ahjintpcc',
        store: store,
        saveUninitialized: false,
        resave: false
      })
    )

    this.app.post('/signup', (req, res) => {
      const email = req.body.email
      const password = req.body.password
      const repeatPassword = req.body.repeatPassword
      if (password !== repeatPassword) {
        res.redirect('/signup.html')
      } else {
        const result = this.userDB.insertNewUser(email, password)
        if (result === userDatabase.InsertNewUserResult.SUCCESS) {
          this.userDB.logInUser(req, email, password)
          res.redirect('/debug/home')
        }
      }
    })

    // this.app.post("/login")

    // placeholder function
    this.app.get('/debug/home', (req, res) => {
      if (req.session['logged-in'] !== true) {
        res.send('please log in')
      } else {
        res.send('Welcome ' + req.session.email)
      }
    })

    // 404, page can't be found
    this.app.use(function (req, res) {
      res.status(404).send('404 page not found')
    })
  }

  run () {
    const port = 3000
    this.app.listen(port, () => {
      console.log(`Example this.app listening at http://localhost:${port}`)
    })
  }
}

module.exports = { TaroCardApp }
