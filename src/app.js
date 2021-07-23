const express = require('express')
const Database = require('better-sqlite3')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const pug = require('pug')

const userDatabase = require('./user_database')

class TaroCardApp {
  /**
     *
     * @param {String} database name of sqlite3 database
     */
  constructor (database) {
    if (database === undefined) {
      database = 'databases/taroCard.db'
    }
    this.db = new Database(database)
    // console.log(database)
    this.server = undefined
    this.userDB = new userDatabase.UserDatabase(this.db)
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

    this.generateProfile = pug.compileFile('templates/profile_debug.pug')

    this.app.post('/signup', (req, res) => {
      const email = req.body.email
      const password = req.body.password
      const repeatPassword = req.body.repeatPassword
      if (password !== repeatPassword) {
        res.redirect('/signup.html')
      } else {
        const result = this.userDB.insertNewUser(email, password)
        // if (result === userDatabase.InsertNewUserResult.SUCCESS) {
        if (result != -1) {
          this.userDB.logInUser(req, email, password)
          res.redirect('/debug/home')
        } else {
          // res.send('invalid email')
        }
      }
    })

    this.app.post('/login', (req, res) => {
      const email = req.body.email
      const password = req.body.password
      if (this.userDB.logInUser(req, email, password)) {
        res.redirect('/debug/home')
      } else {
        res.send('invalid email and/or password')
      }
    })

    this.app.post('/signout', (req, res) => {
      req.session.email = undefined
      req.session['logged-in'] = false
      res.redirect('/debug/home')
    })

    // placeholder/debug routes begin here
    this.app.get('/debug/home', (req, res) => {
      if (req.session['logged-in'] !== true) {
        res.send('please log in')
      } else {
        res.send(this.generateProfile({ username: req.session.email }))
      }
    })

    this.app.get('/debug/connect', (req, res) => {
      res.send('connected')
    })

    // 404, page can't be found
    this.app.use(function (req, res) {
      res.status(404).send('404 page not found taco')
    })
  }

  run () {
    const port = 3000
    this.server = this.app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  }
}

module.exports = { TaroCardApp }
