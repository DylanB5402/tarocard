const express = require('express')
const router = express.Router()

const settingsController = require('../controllers/settings_controller')

router.get('/', settingsController.settingsPage)

router.post('/updateEmail', settingsController.updateEmail)

router.post('/updatePassword', settingsController.updatePassword)

router.get('/updatePassword/success', settingsController.updatePasswordSuccess)

module.exports = router
