const friendDatabase = require('../models/database/friend_database')
const userDatabase = require('../models/database/user_database')

const friendDb = new friendDatabase.FriendDatabase()
const userDB = new userDatabase.UserDatabase()


/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.request = (req, res) => {
  const uid = req.params.uid
  const friendUid = req.params.friendUid
  if (friendDb.sendFriendRequest(uid, friendUid)) {
    res.send('success')
  } else {
    res.send('failure')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.accept = (req, res) => {
  const uid = req.params.uid
  const friendUid = req.params.friendUid
  if (friendDb.acceptFriendRequest(uid, friendUid)) {
    res.send('success')
  } else {
    res.send('failure')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.currentFriends = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    var currentFriends = friendDb.getAllCurrentFriends(uid)
    var friendArray = []
    currentFriends.forEach( (friendID) => {
      var userData = userDB.getUserNamesByUID(uid)
      friendArray.push({
        "display name" : userData.display_name,
        "username" : userData.username,
        "image url" : ""
      })
    })
    res.json({'users' : friendArray, "success" : true})
  } else {
    res.json({'users' : [], "success" : false})
  }
  // res.json({ friend_ids: friendDb.getAllCurrentFriends(uid) })
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.outgoingFriends = (req, res) => {
  const uid = req.params.uid
  res.json({ friend_ids: friendDb.getAllOutgoingFriends(uid) })
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.incomingFriends = (req, res) => {
  const uid = req.params.uid
  res.json({ friend_ids: friendDb.getAllIncomingFriends(uid) })
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.friendsPage = (req, res) => {
  if (req.session.loggedin) {
    res.redirect('/friendsPage/Friends_Page.html')
  } else {
    res.redirect('/')
  }
}
