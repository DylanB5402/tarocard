const express = require('express')
const router = express.Router()

// Require controller modules.
const drinkController = require('../controllers/drink_controller')

// POST request for new drink card.
router.post('/new_drink_card', drinkController.newDrinkCard)

// POST request for edit drink card.
router.post('/edit_drink_card/:drinkId', drinkController.editDrinkCard)

// DEBUG
// GET request to view all drinks corresponding to one user
router.get('/', drinkController.getAllDrinks)

module.exports = router