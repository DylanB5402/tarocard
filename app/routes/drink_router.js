const express = require('express')
const router = express.Router()

// Require controller modules.
const drinkController = require('../controllers/drink_controller')

// POST request for new drink card.
router.post('/newDrinkCard', drinkController.newDrinkCard)

// POST request for edit drink card.
// IDEA: I want to do /editDrinkCard/:drinkId but apparently that doesn't work ;-;
router.post('/editDrinkCard', drinkController.editDrinkCard)

// GET request to view all drinks corresponding to one user
router.get('/', drinkController.getAllDrinks)

// PUT request for starring a drink
router.post('/starDrink', drinkController.starDrink)

// PUT request for unstarring a drink
router.post('/unstarDrink', drinkController.unstarDrink)

// DELETE request for removing a favorited drink
router.post('/removeDrink', drinkController.removeFavDrink)

// TESTING ROUTE
// router.post('/editDrinkCard', drinkController.testConnection)

module.exports = router
