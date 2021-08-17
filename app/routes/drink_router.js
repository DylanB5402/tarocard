const express = require('express')
const router = express.Router()

// Require controller modules.
const drinkController = require('../controllers/drink_controller')

// POST request for new drink card.
router.post('/newDrinkCard', drinkController.newDrinkCard)

// POST request for edit drink card.
// IDEA: I want to do /editDrinkCard/:drinkId but apparently that doesn't work ;-;
router.post('/editDrinkCard/:drinkId', drinkController.editDrinkCard)

// GET request to view all drinks corresponding to one user
router.get('/', drinkController.getAllDrinks)

// POST request for starring a drink
router.post('/starDrink/:drinkId', drinkController.starDrink)

// POST request for unstarring a drink
router.post('/unstarDrink/:drinkId', drinkController.unstarDrink)

// POST request for removing a favorited drink
router.post('/deleteDrink/:drinkId', drinkController.removeFavDrink)

// GET request to view all drinks on the home page
router.get('/displayHomepage', drinkController.displayCardsHomePage)

module.exports = router
