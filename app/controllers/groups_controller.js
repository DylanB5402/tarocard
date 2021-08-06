const userDatabase = require('../models/database/user_database')
const groupDatabase = require('../models/database/group_database')


const userDB = new userDatabase.UserDatabase()
const groupDB = new groupDatabase.GroupDatabase()

exports.createGroup = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const groupName = req.body.groupName
    const friendUID = req.body.friendUID
    const friendsDrinkID = req.body.friendsDrinkID
    
    const groupId = groupDB.createNewGroup(uid, groupName, friendUID, friendsDrinkID)

    res.redirect(`/editGroup/${groupId}`) 
    // redirect to edit group stage for a specific group
  }
}