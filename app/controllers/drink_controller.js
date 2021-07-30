const favDrinksDatabase = require('../models/database/fav_drinks_database')
const drinksDatabase = require('../models/database/drinks_database')
const estabDatabase = require('../models/database/establishments_database')

const favDrinksDB = new favDrinksDatabase.FavDrinksDatabase()
const drinksDB = new drinksDatabase.DrinksDatabase()
const estabDB = new estabDatabase.EstablishmentsDatabase()

/**
 * Creates new drink entry
 * @param {httpRequest} req request
 * @param {httpRequest} res response
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

// TODO:
// Edit a drink card
exports.editDrinkCard = (req, res) => {
  if (req.session.loggedin) {
    // Get drink id of drink being edited: Do this through use of req.params
    const drinkId = req.params.drinkId
    const uid = req.session.uid // Get uid from cookie session

    // Make sure previous info (drink name and desc) is shown

    // Get name and desc of drink from new form request
    const nameOfDrink = req.body.nameOfDrink
    const drinkDesc = req.body.drinkDesc

    drinksDB.editDrink(drinkId, nameOfDrink, drinkDesc) // edit drink

    // Because we edited the drink through drinksDB and that favDrinkDB stores
    // uid and drinkId, we don't need any changes to favDrinkDB
  }
}

// TODO: Get all drinks for a user
exports.getAllDrinks = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid // Get uid from cookie session
    const query = favDrinksDB.getAllDrinks(uid) // temp, will format better in future
    res.send(query) // temp debug
  }
}
