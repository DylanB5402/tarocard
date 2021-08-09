const userDatabase = require('../models/database/user_database')
const groupDatabase = require('../models/database/group_database')


const userDB = new userDatabase.UserDatabase()
const groupDB = new groupDatabase.GroupDatabase()

/**
 * Gets all the groups for a user
 * @param {!import('express').Request} req 
 * @param {!import('express').Request} res 
 */
exports.getAllGroups = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const allGroups = groupDB.getAllGroups(uid) // all groups specific to a uid

    // Send as json for front end
    const groupArray = []

    // group object: {group_id, group_name}
    // Iterate through the array of groups and make objects out of their properties
    allGroups.forEach((group) => {
      groupArray.push({
        name: group.group_name,
        id: group.group_id
      })
    })

    res.json({ groups: groupArray, success: true }) // send as json
  } else {
    res.json({ groups: [], success: false })
  }
}

/**
 * Creates a brand new group
 * Do not worry about friendUID and friendsgroupId; they are -1 by default
 * @param {!import('express').Request} req 
 * @param {!import('express').Request} res 
 */
exports.createGroup = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupName = req.body.groupName
    const friendUID = req.body.friendUID
    const friendsgroupID = req.body.friendsgroupID
    
    const groupId = groupDB.createNewGroup(uid, groupName, friendUID, friendsgroupID)

    res.redirect(`/editGroup/${groupId}`) 
    // redirect to edit group stage for a specific group
  }
}

/**
 * TODO: Send me the friendUID and drinkId in the req.body!
 * @param {!import('express').Request} req 
 * @param {!import('express').Request} res 
 */
exports.addToGroup = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupId = req.body.groupId
    const friendUID = req.body.friendUID
    const drinkId = req.body.friendDrinkId
    groupDB.addToGroup(groupId, uid, friendUID, drinkId)
  }
}

/**
 * Removes a group for a user
 * @param {!import('express').Request} req 
 * @param {!import('express').Request} res 
 */
exports.removeGroup = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupId = req.params.groupId
    groupDB.removeGroup(uid, groupId)
  }
}

/**
 * Removes a user-drink pair from a group
 * drinkId is found in the body!
 * @param {!import('express').Request} req 
 * @param {!import('express').Request} res 
 */
exports.removeFromGroup = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupId = req.params.groupId
    const drinkId = req.body.drinkId
    groupDB.removeFromGroup(uid, groupId, drinkId)
  }
}