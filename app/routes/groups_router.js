const express = require('express')
const router = express.Router()

// Require Controlller Modules
const groupsController = require('../controllers/groups_controller')

router.get('/', groupsController.getAllGroups)

router.post('/createGroup', groupsController.createGroup)

module.exports(router)