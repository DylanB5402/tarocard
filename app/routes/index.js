const express = require('express')
const router = express.Router()

// Require controller modules.
const userController = require('../controllers/user_controller')
const drinkController = require('../controllers/drink_controller')

// GET home page.
router.get('/', function (req, res) {
  if (req.session.loggedin) {
    res.redirect('/profile')
  } else {
    res.redirect('/index.html')
  }
})

// POST request for sign up.
router.post('/signup', userController.signup)

// POST request for login.
router.post('/login', userController.login)

// GET request for sign out
router.get('/signout', userController.signout)

router.get('/profile/:id', userController.profileById)

// GET request to view user profile
router.get('/profile/', userController.profile)

/// DRINK ROUTES ///

// POST request for new drink card.
router.post('/new_drink_card', drinkController.newDrinkCard)

// POST request for edit drink card.
router.post('/:drinkId/edit_drink_card', drinkController.editDrinkCard)

// DEBUG
router.post('/updateProfile', userController.updateProfile)

router.get('/search', userController.searchPage)

router.post('/search/users', userController.searchAllUsers)

module.exports = router
