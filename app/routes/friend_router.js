const express = require('express')
const router = express.Router()

const friendController = require('../controllers/friends_controller')

router.get('/', friendController.friendsPage)

router.post('/test/request/:uid/:friendUid', friendController.requestLegacy)

router.post('/test/accept/:uid/:friendUid', friendController.acceptLegacy)

router.post('/request', friendController.request)

router.post('/accept', friendController.accept)

router.post('/deny', friendController.deny)

router.get('/current', friendController.currentFriends)

router.post('/current', friendController.currentFriends)

// router.post('/current/id', friendController.currentFriendsByID)

router.post('/incoming/:uid', friendController.incomingFriends)

router.post('/outgoing/:uid', friendController.outgoingFriends)

router.post('/search', friendController.searchFriends)

router.post('/incoming', friendController.listIncomingFriends)

router.get('/recent', friendController.recentFriends)

module.exports = router
