const userDatabase = require('../models/database/user_database')
const userDB = new userDatabase.UserDatabase()

const friendDatabase = require('../models/database/friend_database')
const friendDb = new friendDatabase.FriendDatabase()


exports.home = (req, res) => {
  // console.log(req)
  if (req.session.loggedin !== true) {
    res.send('please log in')
  } else {
    res.send('Hello ' + req.session.email)
  }
}

exports.connect = (req, res) => {
  res.send('connected')
}

exports.signout = (req, res) => {
  req.session.email = undefined
  req.session.loggedin = false
  req.session.uid = -1
  res.redirect('/')
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.users = (req, res) => {
  res.send(userDB.getAllUsers())
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.debugHome = (req, res) => {
  res.send('taco')
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.profile = (req, res) => {
  var uid = req.params.uid
  // res.send(toString(userDB.getAllUsers()) + '/n' + toString(friendDb.getAllFriendData(uid)))
  var profileString = ""
  // userDB.getUserByUID(uid)
  res.send(JSON.stringify(userDB.getAllProfileData(uid)) +" <br/>" + friendDb.getAllFriendData(uid))
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.allFriends = (req, res) => {
  var allFriends = friendDb.getAllTableData()
  var friendsString = ""
  allFriends.forEach((friend) => {
    friendsString = friendsString + JSON.stringify(friend) + "<br/>"
  })
  res.send(friendsString)
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.addFriend = (req, res) => {
  var uid = req.body.uid
  var friend_uid = req.body.friend_uid
  var status = req.body.status
  friendDb.insertFriend(uid, friend_uid, status)
  res.redirect('/debug/friends')
}