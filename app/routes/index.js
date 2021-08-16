const express = require('express')
const router = express.Router()

// Require controller modules.
const userController = require('../controllers/user_controller')
const drinkController = require('../controllers/drink_controller')

// GET home page.
router.get('/', function (req, res) {
  if (req.session.loggedin) {
    res.redirect('/homepage/home.html')
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

/// USER ROUTES //

router.get('/edit', userController.editPage)

router.post('/edit/profile', userController.editProfile)

router.get('/search', userController.searchPage)

router.post('/search/users', userController.searchAllUsers)

router.get('/banner', userController.getBanner)

router.get('/pfp', userController.getProfilePicture)

module.exports = router
