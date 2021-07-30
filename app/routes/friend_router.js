const express = require('express')
const router = express.Router()

const friendController = require('../controllers/friends_controller')

router.post('/request/:id/:friendUid', friendController.request)

router.post('/:uid', friendController.currentFriends)

router.post('/incoming', friendController.incomingFriends)

router.post('/outgoing', friendController.outgoingFriends)

module.exports = router
