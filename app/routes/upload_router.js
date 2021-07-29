const express = require('express');
const router = express.Router();

// Require controller modules.
const uploadController = require('../controllers/upload_controller');

// POST request for upload.
router.post('/:uploadType', uploadController.upload)

module.exports = router