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
  res.json({ users: userDB.getAllUsers() })
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.usersJSON = (req, res) => {
  // res.json({ 'users' : userDB.getAllUsers()})
  const allUsers = userDB.getAllUsers()
  const userJSON = {}
  allUsers.forEach((user) => {
    userJSON[user.username] = user.uid
  })
  res.json(userJSON)
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.debugHome = (req, res) => {
  // res.send('taco')
  res.redirect('/debug/debug.html')
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.profile = (req, res) => {
  const uid = req.params.uid
  // res.send(toString(userDB.getAllUsers()) + '/n' + toString(friendDb.getAllFriendData(uid)))
  // const profileString = ''
  // userDB.getUserByUID(uid)
  res.send(JSON.stringify(userDB.getAllProfileData(uid)) + ' <br/>' + friendDb.getAllFriendData(uid))
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.allFriends = (req, res) => {
  const allFriends = friendDb.getAllTableData()
  let friendsString = ''
  allFriends.forEach((friend) => {
    friendsString = friendsString + JSON.stringify(friend) + '<br/>'
  })
  res.send(friendsString)
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.addFriend = (req, res) => {
  const uid = req.body.uid
  const friendUid = req.body.friend_uid
  // const status = req.body.status
  // friendDb.insertFriend(uid, friend_uid, status)
  friendDb.addCurrentFriend(uid, friendUid)
  res.redirect('/debug/friends')
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.addUser = (req, res) => {
  for (let i = 0; i < req.body.num; i++) {
    const username = 'user' + Math.floor(Math.random() * 999)
    userDB.insertNewUser(username, 'password', username)
  }
  res.redirect('/debug/users')
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.loggedIn = (req, res) => {
  // console.log(req.session)
  if (req.session.loggedin) {
    res.json({ 'user-logged-in': true, uid: req.session.uid })
  } else {
    res.json({ 'user-logged-in': false, uid: -1 })
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.currentProfileData = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    res.json(userDB.getAllProfileData(uid))
  } else {
    res.json({ uid: -1 })
  }
}
