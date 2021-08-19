const userDatabase = require('../models/database/user_database')
const groupDatabase = require('../models/database/group_database')
const { home } = require('./debug_controller')

const userDB = new userDatabase.UserDatabase()
const groupDB = new groupDatabase.GroupDatabase()

/**
 * Gets all the groups for a user
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.getAllGroups = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const allGroups = groupDB.getAllGroups(uid) // all groups specific to a uid

    // Send as json for front end
    const groupArray = []

    // group object: {group_id, group_name}
    // Iterate through the array of groups and make objects out of their properties
    if (allGroups != null) {
      allGroups.forEach((group) => {
        groupArray.push({
          name: group.group_name,
          id: group.group_id
        })
      })
    }
    res.json({ groups: groupArray, success: true }) // send as json
  } else {
    res.json({ groups: [], success: false })
  }
}

/**
 *
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.getGroup = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupId = req.params.groupId
    const group = groupDB.getGroup(uid, groupId) // a specific group

    // Send as json for front end
    const groupContent = []

    // group object: {group_id, group_name}
    // Iterate through the group and make objects out of the properties
    group.forEach((pair) => {
      groupContent.push({
        groupName: pair.group_name,
        id: pair.group_id,
        friendUID: pair.friend_uid,
        drink: pair.friends_drink_id
      })
    })

    res.send(group)
    // res.json({ groupContents: groupContent, success: true }) // send as json
  } else {
    res.json({ groupContents: [], success: false })
  }
}

/**
 * Creates a brand new group
 * Do not worry about friendUID and friendsgroupId; they are -1 by default
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.createGroup = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupName = req.body.groupName
    const friendUID = req.body.friendUID
    const friendsgroupID = req.body.friendsgroupID

    const groupId = groupDB.createNewGroup(uid, groupName, friendUID, friendsgroupID)

    res.redirect('back')
    // redirect to edit group stage for a specific group
  }
}

/**
 * TODO: Send me the friendUID and drinkId in the req.body!
 * We are adding drinks to groups by having the user go to a drink on a friend's
 *   profile and then adding the drink card to the group from there
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.addToGroup = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupId = req.params.groupId
    const friendUID = req.body.friendUID
    const drinkId = req.body.drinkId

    const addBool = groupDB.addToGroup(groupId, uid, friendUID, drinkId)

    res.redirect('back') // Should not redirect, just stay where they were (on friend profile)
  } else {
    res.redirect('/')
  }
}

exports.editGroupName = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupId = req.params.groupId
    const groupName = req.body.groupName

    groupDB.editGroupName(uid, groupId, groupName)

    res.redirect('back')
  } else {
    res.redirect('/')
  }
}

/**
 * Removes a group for a user
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.removeGroup = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupId = req.params.groupId
    groupDB.removeGroup(uid, groupId)

    res.redirect('back')
  } else {
    res.redirect('/')
  }
}

/**
 * Removes a user-drink pair from a group
 * drinkId is found in the body!
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.removeFromGroup = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupId = req.params.groupId
    const drinkId = req.body.drinkId
    console.log(`This is the drink id in exports.removeFrom Group: ${drinkId}`) // debug statement
    groupDB.removeFromGroup(uid, groupId, drinkId)

    res.redirect('back')
  } else {
    res.redirect('/')
  }
}
