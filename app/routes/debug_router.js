const express = require('express')
const router = express.Router()

// Require controller modules.
const debugController = require('../controllers/debug_controller')

// placeholder/debug routes begin here

// GET request for home

router.get('/', debugController.debugHome)

router.get('/home', debugController.home)

// GET request for connect
router.get('/connect', debugController.connect)

// GET request for sign out
router.get('/signout', debugController.signout)

router.get('/users', debugController.users)

router.get('/users/json', debugController.usersJSON)

router.get('/profile', debugController.currentProfileData)

router.get('/profile/:uid', debugController.profile)

router.get('/friends', debugController.allFriends)

router.post('/addFriend', debugController.addFriend)

router.post('/adduser', debugController.addUser)

router.get('/loggedin', debugController.loggedIn)

/// UPLOAD DEBUG ///

// POST request for upload.
router.post('/upload/:uploadType/:uploadId', debugController.upload)

// GET request to view drinks database
router.get('/drinks', debugController.drinks)

// GET request to view uploaded images in drinks database
router.get('/drinks/images', debugController.drinksImages)

// GET request to reset drinks database
router.get('/drinks/reset', debugController.drinksReset)

/// ESTABLISHMENTS DEBUG ///

// GET request to show establishments
router.get('/BIG/FUNNY', debugController.establishments)

// DRINKS DEBUG //
router.get('/drinks/count', debugController.numCards)

router.get('/drinks/displayHomePage', debugController.displayCardsHomePage)

router.get('/usersDrinks', debugController.allUsersDrinks)

// GROUPS DEBUG // 
router.post('/groups/editGroupName', debugController.editGroupName)

module.exports = router
