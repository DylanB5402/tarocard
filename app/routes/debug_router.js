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

router.get('/profile/:uid', debugController.profile)

router.get('/friends', debugController.allFriends)

router.post('/addFriend', debugController.addFriend)

module.exports = router
