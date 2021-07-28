const express = require('express')
const Database = require('better-sqlite3')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const userDatabase = require('./user_database')
const path = require('path')

const favDrinksDatabase = require('./fav_drinks_database')
const drinksDatabase = require('./drinks_database')
const templateEngine = require('./template_engine')

class TaroCardApp {
  /**
     *
     * @param {String} database name of sqlite3 database
     */
  constructor (database) {
    if (database === undefined) {
      database = 'databases/taroCard.db'
    }
    // this.db = new Database(database, { verbose: console.log })
    this.db = new Database(database)
    this.server = undefined
    this.userDB = new userDatabase.UserDatabase(this.db)

    // KNEX SESSION STORE IS KEEPING PROCESS FROM EXITING
    this.store = new KnexSessionStore()
    this.favDrinksDB = new favDrinksDatabase.FavDrinksDatabase(this.db)
    this.drinksDB = new drinksDatabase.DrinksDatabase(this.db)
    this.tempEngine = new templateEngine.TemplateEngine()

    this.app = express()
    this.app.use(express.json()) // for parsing this.application/json
    this.app.use(express.urlencoded({ extended: true })) // for parsing this.application/x-www-form-urlencoded

    this.app.use(
      session({
        secret: 'ahjintpcc',
        store: this.store,
        saveUninitialized: false,
        resave: false
      })
    )

    this.app.get('/', (req, res) => {
      if (req.session.loggedin) {
        res.redirect('/profile')
      } else {
        res.redirect('/index.html')
      }
    })

    this.app.use(express.static('static'))

    this.app.post('/signup', (req, res) => {
      const email = req.body.email
      const password = req.body.password
      const repeatPassword = req.body.repeatPassword
      if (password !== repeatPassword) {
        res.redirect('/signup.html')
      } else {
        const result = this.userDB.insertNewUser(email, password)
        if (result !== -1) {
          this.userDB.logInUser(req, email, password)
        }
        res.redirect('/profile/')
      }
    })

    this.app.post('/login', (req, res) => {
      // console.log(req)
      const email = req.body.email
      const password = req.body.password
      if (this.userDB.logInUser(req, email, password)) {
        // res.redirect('/debug/home')
        res.redirect('/profile/')
      } else {
        res.send('invalid email and/or password')
      }
    })

    this.app.post('/signout', (req, res) => {
      req.session.email = undefined
      req.session.loggedin = false
      req.session.uid = -1
      res.redirect('/debug/home')
    })

    this.app.get('/profile/', (req, res) => {
      if (req.session.loggedin) {
        const uid = req.session.uid
        const profileData = this.userDB.getUserByUID(uid)
        if (profileData !== undefined) {
          const bio = profileData.bio
          const username = profileData.username
          const displayName = profileData.display_name
          // res.cookie('debug_success', "successful")
          res.append('profileAccess', 'successful')
          res.send(this.tempEngine.getUserProfile(username, displayName, bio))
        } else {
          res.redirect('/404')
        }
      } else {
        res.redirect('/')
      }
    })

    // placeholder/debug routes begin here
    this.app.get('/debug/home', (req, res) => {
      // console.log(req)
      if (req.session.loggedin !== true) {
        res.send('please log in')
      } else {
        res.send('Hello ' + req.session.email)
      }
    })

    this.app.get('/debug/connect', (req, res) => {
      res.send('connected')
    })

    this.app.get('/debug/signout', (req, res) => {
      req.session.email = undefined
      req.session.loggedin = false
      req.session.uid = -1
      res.redirect('/')
    })

    // 404, page can't be found
    this.app.use(function (req, res) {
      res.status(404).send('404 page not found')
    })

    // Upon form submission at URL .../drink_card, send to database
    // Form:    Name of Drink: *******
    //          Description: *******
    //
    this.app.post('/new_drink_card', (req, res) => {
      if (req.session.loggedin) {
        // Get name and desc of drink from form request
        const nameOfDrink = req.body.nameOfDrink
        const drinkDesc = req.body.drinkDesc
        const uid = req.session.uid // get uid from current logged in state

        // Save return value to variable after adding drink to drink database
        const drinkUid = this.drinksDB.addDrink(nameOfDrink, drinkDesc)
        const resultFavDrink = false // variable out of scope

        // If truthy i.e. successfuly created id, add to fav drink database
        if (drinkUid) {
          resultFavDrink = this.favDrinksDB.addFavDrink(uid, drinkUid)
        }
        if (resultFavDrink) {
          // Exit pop up or print "Drink Added!"
        } else {
          // Print "Could not add drink!"
          // Give detail later e.g. "drink already exists"
        }
      }
    })

    // TODO:
    // Edit a drink card
    this.app.post('/edit_drink_card', (req, res) => {
      // Make sure previous info (drink name and desc) is shown

      // Get name and desc of drink from new form request
      const nameOfDrink = req.body.nameOfDrink
      const drinkDesc = req.body.drinkDesc

      const result = this.drinksDB.editDrink()
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
