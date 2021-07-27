/**
 * Filename: app.js
 * Author: Alex Nguyen
 * Purpose: Website methods
 * Majority of skeleton code from Dylan Barva
 */

const express = require('express')
const Database = require('better-sqlite3')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
var path = require('path');

const favDrinksDatabase = require('./fav_drinks_database');
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
    this.favDrinksDB = new favDrinksDatabase.FavDrinksDatabase(this.db)
    this.drinksDB = new drinksDatabase.DrinksDatabase(this.db)
    const store = new KnexSessionStore()

    this.tempEngine = new templateEngine.TemplateEngine()

    this.app = express()
    this.app.use(express.json()) // for parsing this.application/json
    this.app.use(express.urlencoded({ extended: true })) // for parsing this.application/x-www-form-urlencoded
    this.app.use(express.static('static'))
    // this.app.use(express.static(path.join(__dirname, 'static')));


    this.app.use(
      session({
        secret: 'ahjintpcc',
        store: store,
        saveUninitialized: false,
        resave: false
      })
    )

    // Upon form submission at URL .../drink_card, send to database
    // Form:    Name of Drink: *******
    //          Description: *******
    //
    this.app.post( '/new_drink_card', (req, res) => {

      if (req.session.loggedin) {
        // Get name and desc of drink from form request
        const nameOfDrink = req.body.nameOfDrink
        const drinkDesc = req.body.drinkDesc
        const uid = req.session.uid // get uid from current logged in state

        // Save return value to variable after adding drink to drink database
        const drinkUid = this.drinksDB.addDrink(nameOfDrink, drinkDesc)
        const resultFavDrink = false; // variable out of scope

        // If truthy i.e. successfuly created id, add to fav drink database
        if (drinkUid) {
          resultFavDrink = this.favDrinksDB.addFavDrink(uid, drinkUid)
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
}

  module.exports = { TaroCardApp }