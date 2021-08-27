const userDatabase = require('../models/database/user_database')
const friendDatabase = require('../models/database/friend_database')
const favDrinksDatabase = require('../models/database/fav_drinks_database')
const templateEngine = require('../views/template_engine')
const config = require('../config.json')
const userDB = new userDatabase.UserDatabase()
const tempEngine = new templateEngine.TemplateEngine()
const friendDb = new friendDatabase.FriendDatabase()
const favDrinksDb = new favDrinksDatabase.FavDrinksDatabase()

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.signup = (req, res) => {
  if (req.session.loggedin) {
    res.redirect('/profile/')
  } else {
    const email = req.body.email
    const password = req.body.password
    const repeatPassword = req.body.repeatPassword
    const username = req.body.username
    if (password !== repeatPassword) {
      res.redirect('/sign-up.html')
    } else {
      const result = userDB.insertNewUser(email, password, username)
      if (result !== -1) {
        userDB.logInUser(req, email, password)
      }
      res.redirect('/profile')
    }
  }
}

exports.login = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (userDB.logInUser(req, email, password)) {
    res.redirect('/profile/')
  } else {
    res.send('invalid email and/or password')
  }
}

exports.signout = (req, res) => {
  req.session.email = undefined
  req.session.loggedin = false
  req.session.uid = -1
  res.redirect('/index.html')
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.profile = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const profileData = userDB.getUserByUID(uid)
    if (profileData !== undefined) {
      const bio = profileData.bio
      const username = profileData.username
      const displayName = profileData.display_name
      const numFriends = friendDb.getNumFriends(uid)
      const numCards = favDrinksDb.numCards(uid)
      res.append('profileaccess', 'successful')
      res.send(tempEngine.getUserProfile(username, displayName, bio, numFriends, numCards))
    } else {
      res.redirect('/index.html')
    }
  } else {
    res.redirect('/index.html')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.profileById = (req, res) => {
  const uid = req.params.id
  const profileData = userDB.getUserByUID(uid)
  if (profileData !== undefined) {
    const bio = profileData.bio
    const username = profileData.username
    const displayName = profileData.display_name
    const numCards = favDrinksDb.numCards(uid)
    const numFriends = friendDb.getNumFriends(uid)
    if (req.session.loggedin) {
      if (req.session.uid.toString() === uid) {
        res.redirect('/profile')
      } else {
        res.append('profileaccess', 'successful')
        let friendStatus = friendDb.getFriendStatus(req.session.uid, uid)
        if (friendStatus === undefined) {
          friendStatus = friendDatabase.FriendStatus.NONE
        }
        // currently friends
        if (friendStatus === friendDatabase.FriendStatus.FRIENDS) {
          res.send(tempEngine.getFriendProfileCurrent(username, displayName, bio, numFriends, numCards, uid))
          // res.send('987') // current friend
        } else if (friendStatus === friendDatabase.FriendStatus.INCOMING) {
          res.send(tempEngine.getFriendProfile(username, displayName, bio, numFriends, numCards, uid))
        } else if (friendStatus === friendDatabase.FriendStatus.OUTGOING) {
          res.send(tempEngine.getFriendProfilePending(username, displayName, bio, numFriends, numCards, uid))
        } else if (friendStatus === friendDatabase.FriendStatus.NONE) {
          res.send(tempEngine.getFriendProfileRequest(username, displayName, bio, numFriends, numCards, uid))
        }
      }
    } else {
      res.send(tempEngine.getFriendProfileRequest(username, displayName, bio, numFriends, numCards, uid))
    }
  } else {
    res.send('no user with id ' + uid + 'found')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.editProfile = (req, res) => {
  const username = req.body.username
  const displayName = req.body['display-name']
  const bio = req.body.bio
  if (req.session.loggedin && userDB.insertProfileData(req.session.uid, displayName, username, bio)) {
    res.redirect('/profile')
  } else {
    res.send('failure')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.editPage = (req, res) => {
  if (req.session.loggedin) {
    const userData = userDB.getUserDataByID(req.session.uid)
    res.send(tempEngine.getEditProfilePage(userData.username, userData.display_name, userData.bio))
  } else {
    res.redirect('/index.html')
  }
}

exports.searchPage = (req, res) => {
  if (req.session.loggedin) {
    res.redirect('/searchUsers/searchUsers.html')
  } else {
    res.redirect('/index.html')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.searchAllUsers = (req, res) => {
  const search = req.body.string
  if (req.session.loggedin) {
    const users = userDB.searchDatabase(search, req.session.uid)
    const userArray = friendDb.formatFriendData(users)
    userArray.splice(100)
    res.json({ users: userArray, success: true })
  } else {
    res.json({ users: [], success: false })
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.getBanner = (req, res) => {
  if (req.session.loggedin) {
    res.redirect(userDB.getBannerPathByUID(req.session.uid).banner)
  } else {
    res.redirect(config.defaults.defaultBanner)
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.getFriendBanner = (req, res) => {
  if (req.session.loggedin) {
    const friendUID = req.params.friendUID
    if (userDB.getProfilePicturePathByUID(friendUID) === undefined) {
      res.redirect(config.defaults.defaultBanner)
    } else {
      res.redirect(userDB.getProfilePicturePathByUID(friendUID).banner)
    }
  } else {
    res.redirect(config.defaults.defaultBanner)
  }
}

exports.getProfilePicture = (req, res) => {
  if (req.session.loggedin) {
    res.redirect(userDB.getProfilePicturePathByUID(req.session.uid).profile_picture)
  } else {
    res.redirect(config.defaults.defaultPfp)
  }
}

exports.getFriendProfilePicture = (req, res) => {
  if (req.session.loggedin) {
    const friendUID = req.params.friendUID
    if (userDB.getProfilePicturePathByUID(friendUID) === undefined) {
      res.redirect(config.defaults.defaultPfp)
    } else {
      res.redirect(userDB.getProfilePicturePathByUID(friendUID).profile_picture)
    }
  } else {
    res.redirect(config.defaults.defaultPfp)
  }
}
