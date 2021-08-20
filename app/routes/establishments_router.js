const express = require('express')
const router = express.Router()

// Require controller modules.
const establishmentsController = require('../controllers/establishments_controller')

// GET request for all establishments
router.get('/', establishmentsController.getAllEstablishments)

// GET request for search establishments
router.get('/search/:search', establishmentsController.searchEstablishments)

// GET request for search establishments
router.get('/unique', establishmentsController.uniqueEstablishments)

// GET request for search establishments
router.get('/get/:id', establishmentsController.getEstablishment)

module.exports = router
