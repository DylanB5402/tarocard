const express = require('express')
const router = express.Router()

const friendController = require('../controllers/friends_controller')

router.get('/', friendController.friendsPage)

router.post('/request/:uid/:friendUid', friendController.request)

router.post('/accept/:uid/:friendUid', friendController.accept)

router.post('/deny', (req, res) => {res.send('taco')})

router.get('/current', friendController.currentFriends)

router.post('/incoming/:uid', friendController.incomingFriends)

router.post('/outgoing/:uid', friendController.outgoingFriends)

router.post('/search', friendController.searchFriends)

router.post('/incoming', friendController.listIncomingFriends)

router.get('/recent', friendController.recentFriends)

module.exports = router
