const express = require('express')
const router = express.Router()

// Require Controlller Modules
const groupsController = require('../controllers/groups_controller')

// GET request to get all groups for a user
router.get('/', groupsController.getAllGroups)

// POST request to create a fresh group for a user
router.post('/createGroup', groupsController.createGroup)

// POST request to add to an existing group for a user
router.post('/addToGroup/:groupId', groupsController.addToGroup)

// DELETE request to remove a group for a user
router.post('removeGroup/:groupId', groupsController.removeGroup)

// PUT request to remove a user-drink pair from a group for a user
router.put('removeFromGroup/:groupId', groupsController.removeFromGroup)

module.exports = router