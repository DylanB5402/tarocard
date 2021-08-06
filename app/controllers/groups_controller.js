const userDatabase = require('../models/database/user_database')
const groupDatabase = require('../models/database/group_database')


const userDB = new userDatabase.UserDatabase()
const groupDB = new groupDatabase.GroupDatabase()

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