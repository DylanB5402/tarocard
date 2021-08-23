const express = require('express')
const router = express.Router()

// Require controller modules.
const uploadController = require('../controllers/upload_controller')

// POST request for upload (things with ID in post drinks/tags)
router.post('/:uploadType/:uploadId', uploadController.uploadWithId)

// POST request for upload (things with pre-existing session id avatar/banner)
router.post('/:uploadType', uploadController.upload)

module.exports = router
