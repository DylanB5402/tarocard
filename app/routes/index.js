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

// POST request for sign out
router.post('/signout', userController.signout)

router.get('/profile/:id', userController.profileById)

// GET request to view user profile
router.get('/profile/', userController.profile)

module.exports = router
