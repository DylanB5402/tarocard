const express = require('express')
const router = express.Router()

// Require controller modules.
const debugController = require('../controllers/debug_controller')

// placeholder/debug routes begin here

// GET request for home
router.get('/home', debugController.home)

// GET request for connect
router.get('/connect', debugController.connect)

// GET request for sign out
router.get('/signout', debugController.signout)

// POST request for upload.
router.post('/upload/:uploadType/:uploadId', debugController.upload)

// GET request to view drinks database
router.get('/drinks', debugController.drinks)

// GET request to view uploaded images in drinks database
router.get('/drinks/images', debugController.drinksImages)

// GET request to reset drinks database
router.get('/drinks/reset', debugController.drinksReset)

module.exports = router
