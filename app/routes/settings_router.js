const express = require('express')
const router = express.Router()

const settingsController = require('../controllers/settings_controller')

router.get('/', settingsController.settingsPage)

router.post('/update/email', settingsController.updateEmail)

router.get('/current/email', settingsController.currentEmail)

router.post('/update/email/success', (req, res) => { res.send('687') })

router.post('/update/password', settingsController.updatePassword)

module.exports = router
