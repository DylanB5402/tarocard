const express = require('express')
const router = express.Router()

// Require Controlller Modules
const groupsController = require('../controllers/groups_controller')

// GET request to get all groups for a user
router.get('/', groupsController.getAllGroups)

// GET request to get a group for a user
router.get('/getGroup/:groupId', groupsController.getGroup)

// POST request to create a fresh group for a user
router.post('/createGroup', groupsController.createGroup) // this works

// POST request to add to an existing group for a user
router.post('/addToGroup/:groupId', groupsController.addToGroup)

// POST request to edit the name of a group
router.post('/editGroupName/:groupId', groupsController.editGroupName)

// POST request to remove a group for a user
router.post('/removeGroup/:groupId', groupsController.removeGroup)

// POST request to remove a user-drink pair from a group for a user
router.post('/removeFromGroup/:groupId', groupsController.removeFromGroup)

module.exports = router
