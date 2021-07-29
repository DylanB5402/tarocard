const favDrinksDatabase = require('../models/database/fav_drinks_database')
const drinksDatabase = require('../models/database/drinks_database')

const favDrinksDB = new favDrinksDatabase.FavDrinksDatabase()
const drinksDB = new drinksDatabase.DrinksDatabase()

// Upon form submission at URL .../drink_card, send to database
// Form:    Name of Drink: *******
//          Description: *******
//
exports.newDrinkCard = (req, res) => {
  if (req.session.loggedin) {
    // Get establishment, name, and desc of drink from form request
    // const establishment = req.body.establishment
    const nameOfDrink = req.body.nameOfDrink
    const drinkDesc = req.body.drinkDesc
    const uid = req.session.uid // get uid from current logged in state

    // Save return value to variable after adding drink to drink database
    const drinkUid = drinksDB.addDrink(nameOfDrink, drinkDesc)
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
