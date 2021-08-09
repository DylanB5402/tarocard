const favDrinksDatabase = require('../models/database/fav_drinks_database')
const drinksDatabase = require('../models/database/drinks_database')
const estabDatabase = require('../models/database/establishments_database')

const favDrinksDB = new favDrinksDatabase.FavDrinksDatabase()
const drinksDB = new drinksDatabase.DrinksDatabase()
const estabDB = new estabDatabase.EstablishmentsDatabase()

/**
 * Creates new drink entry
 * @param {!import('express').Request} req request
 * @param {!import('express').Request} res response
 */
exports.newDrinkCard = (req, res) => {
  if (req.session.loggedin) {
    // Get establishment, name, and desc of drink from form request

    // Development decision: user cannot enter establishment as a text, they must select from options
    const establishment = req.body.establishment // id of establishment
    const nameOfDrink = req.body.nameOfDrink
    const drinkDesc = req.body.drinkDesc
    const uid = req.session.uid // get uid from current logged in state

    // Save return value to variable after adding drink to drink database
    const drinkUid = drinksDB.addDrink(nameOfDrink, drinkDesc, establishment)
    let resultFavDrink = false // variable out of scope

    // If truthy i.e. successfuly created id, add to fav drink database
    if (drinkUid) {
      resultFavDrink = favDrinksDB.addFavDrink(uid, drinkUid)
    }
    if (resultFavDrink) {
      // Exit pop up or print "Drink Added!"
      drinksDB.toString()
    } else {
      // Print "Could not add drink!"
      // Give detail later e.g. "drink already exists"
    }
    res.redirect('/profile/') // redirect to profile always for now
  }
}

/**
 * Edits an existing drink card data
 * @param {!import('express').Request} req 
 * @param {!import('express').Request} res 
 */
exports.editDrinkCard = (req, res) => {
  if (req.session.loggedin) {
    // Get drink id of drink being edited: Do this through use of req.params
    const drinkId = req.params.drinkId

    console.log(drinkId)

    // Make sure previous info (drink name and desc) is shown

    // Get name and desc and estasblishment of drink from new form request
    const nameOfDrink = req.body.nameOfDrink
    const drinkDesc = req.body.drinkDesc
    const establishment = req.body.establishment

    let testBool = drinksDB.editDrink(drinkId, nameOfDrink, drinkDesc, establishment) // edit drink

    console.log(testBool)

    drinksDB.toString()

    // Because we edited the drink through drinksDB and that favDrinkDB stores
    // uid and drinkId, we don't need any changes to favDrinkDB
  }
}

/**
 * Gets all favorited drinks for a user and returns the data as a json
 * @param {!import('express').Request} req 
 * @param {!import('express').Request} res 
 */
exports.getAllDrinks = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid // Get uid from cookie session
    const allDrinks = favDrinksDB.getAllDrinks(uid) // temp, will format better in future
    const drinkArray = []

    // drink object: {drink_id, drink_name, drink_desc, establishment_id, drink_img}
    // Iterate through the array of drinks and make objects out of their properties
    allDrinks.forEach((drink) => {
      drinkArray.push({
        name: drink.drink_name,
        desc: drink.drink_desc,
        establishment: drink.establishment_id,
        'image url': drink.drink_img,
        id: drink.drink_id
      })
    })

    // send the custom drink array as a json
    res.json({ drinks: drinkArray, success: true })
  } else {
    res.json({ drinks: [], success: false })
  }
}

/**
 * Stars a drink
 * @param {!import('express').Request} req 
 * @param {!import('express').Request} res 
 */
exports.starDrink = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const drinkId = req.params.drinkId
    favDrinksDB.starDrink(uid, drinkId)
  }
}

/**
 * Unstars a drink
 * @param {!import('express').Request} req 
 * @param {!import('express').Request} res 
 */
exports.unstarDrink = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const drinkId = req.params.drinkId
    favDrinksDB.unstarDrink(uid, drinkId)
  }
}

/**
 * Removes a drink card
 * @param {!import('express').Request} req 
 * @param {!import('express').Request} res 
 */
exports.removeFavDrink = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const drinkId = req.params.drinkId
    favDrinksDB.removeFavDrink(uid, drinkId)
  }
}