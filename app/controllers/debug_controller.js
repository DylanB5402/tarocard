const userDatabase = require('../models/database/user_database')
const userDB = new userDatabase.UserDatabase()

const friendDatabase = require('../models/database/friend_database')
const friendDb = new friendDatabase.FriendDatabase()

const uploadFile = require('../models/upload_file')
const drinksDatabase = require('../models/database/drinks_database')
const tagsDatabase = require('../models/database/tags_database')

const upload = new uploadFile.UploadFile()
const drinksDB = new drinksDatabase.DrinksDatabase()
const tagsDB = new tagsDatabase.TagsDatabase()

const config = require('../config.json')

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
/// DEBUG - UPLOAD IMAGES ///

exports.upload = (req, res) => {
  const uploadId = req.params.uploadId
  upload.uploadFile(req, res, req.params.uploadType, (path) => {
    switch (req.params.uploadType) {
      case config.upload.dir.avatarImage:

        break
      case config.upload.dir.bannerImage:

        break
      case config.upload.dir.drinksImage:
        if (drinksDB.isExist(uploadId)) {
          const currentPath = drinksDB.getDrink(uploadId).drink_img
          if (drinksDB.addImage(uploadId, path)) {
            upload.deleteFile(currentPath)
          }
        }
        res.send('drinks updated')
        break
      case config.upload.dir.tagsImage:
        if (tagsDB.isExist(uploadId)) {
          const currentPath = tagsDB.getTag(uploadId).tag_img
          if (tagsDB.addImage(uploadId, path)) {
            upload.deleteFile(currentPath)
          }
        }
        res.send('tags updated')
        break
      default:
        res.send('uh oh, something went wrong')
    }
  })
}

exports.drinks = (req, res) => {
  res.send(drinksDB.toString())
}

exports.drinksImages = (req, res) => {
  const img1 = drinksDB.getDrink(1).drink_img
  const img2 = drinksDB.getDrink(2).drink_img
  const img3 = drinksDB.getDrink(3).drink_img
  res.send(`<img src="${img1}"><img src="${img2}"><img src="${img3}">`)
}

exports.drinksReset = (req, res) => {
  drinksDB.resetDb()
  drinksDB.addDrink('drink1')
  drinksDB.addDrink('drink2')
  drinksDB.addDrink('drink3')

  res.send(drinksDB.toString())
}
