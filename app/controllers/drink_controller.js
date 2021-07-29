const favDrinksDatabase = require('../models/database/fav_drinks_database')

const favDrinksDB = new favDrinksDatabase.FavDrinksDatabase()

// Upon form submission at URL .../drink_card, send to database
// Form:    Name of Drink: *******
//          Description: *******
//
exports.newDrinkCard = (req, res) => {
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
      resultFavDrink = favDrinksDB.addFavDrink(uid, drinkUid)
    }
    if (resultFavDrink) {
      // Exit pop up or print "Drink Added!"
    } else {
      // Print "Could not add drink!"
      // Give detail later e.g. "drink already exists"
    }
  }
}

// TODO:
// Edit a drink card
exports.editDrinkCard = (req, res) => {
  // Make sure previous info (drink name and desc) is shown

  // Get name and desc of drink from new form request
  const nameOfDrink = req.body.nameOfDrink
  const drinkDesc = req.body.drinkDesc

  const result = this.drinksDB.editDrink()
}