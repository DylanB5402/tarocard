const userDatabase = require('../models/database/user_database')
const userDB = new userDatabase.UserDatabase()

const friendDatabase = require('../models/database/friend_database')
const friendDb = new friendDatabase.FriendDatabase()

const uploadFile = require('../models/upload_file')
const drinksDatabase = require('../models/database/drinks_database')
const tagsDatabase = require('../models/database/tags_database')
const establishmentsDatabase = require('../models/database/establishments_database')

const favDrinksDatabase = require('../models/database/fav_drinks_database')
const favDrinksDB = new favDrinksDatabase.FavDrinksDatabase()

const groupsDatabase = require('../models/database/group_database')
const groupsDB = new groupsDatabase.GroupDatabase()

const upload = new uploadFile.UploadFile()
const drinksDB = new drinksDatabase.DrinksDatabase()
const tagsDB = new tagsDatabase.TagsDatabase()
const establishmentsDB = new establishmentsDatabase.EstablishmentsDatabase()

const config = require('../config.json')

exports.home = (req, res) => {
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
  var status = req.body.status
  console.log(friendUid)
  friendDb.insertFriend(uid, friendUid, status)
  if (status === friendDatabase.FriendStatus.INCOMING) {
    status = friendDatabase.FriendStatus.OUTGOING
  } else if (status === friendDatabase.FriendStatus.OUTGOING) {
    status = friendDatabase.FriendStatus.INCOMING
  }
  friendDb.insertFriend(friendUid, uid, status)
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

exports.establishments = (req, res) => {
  // get everything
  const establishments = establishmentsDB.searchEstablishment('')
  const style = 'style="height: 100%; width: 100%; object-fit: cover"'
  let htmlBuilder = `
    <p style="font-size:100px">${establishments.length} establishments found</p>
  `

  establishments.forEach((establishment) => {
    htmlBuilder += `<div style="display: flex; overflow: hidden; background-color: #b19cd9; border-style: double;">
      <h1>${establishment.name} </h1>
      <h2>(${establishment.address1})</h2>
      <ul>
        <li>Alias: ${establishment.alias}</li>
        <li>Phone: ${establishment.phone}</li>
        <li>Display Phone: ${establishment.display_phone}</li>
        <li>Review Count: ${establishment.review_count}</li>
        <li>Rating: ${establishment.rating} Stars</li>
        <li>Address 1: ${establishment.address1}</li>
        <li>Address 2: ${establishment.address2}</li>
        <li>Address 3: ${establishment.address3}</li>
        <li>City: ${establishment.city}</li>
        <li>Zip Code: ${establishment.zip_code}</li>
        <li>Country: ${establishment.country}</li>
        <li>State: ${establishment.state}</li>
        <li>Price: ${establishment.price}</li>
      </ul>
      <img ${style} src=${establishment.img}>
    </div>`
  })
  res.send(htmlBuilder)
}

exports.numCards = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const count = favDrinkDB.numCards(uid)
    res.json({ count: count })
  }
}

exports.displayCardsHomePage = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const allDrinksHP = favDrinksDB.displayDrinksToHomePage(uid) // temp, will format better in future
    const drinkArray = []

    // drink object: {drink_id, drink_name, drink_desc, establishment_id, drink_img}
    // Iterate through the array of drinks and make objects out of their properties
    allDrinksHP.forEach((drink) => {
      // TODO: REDO Establishments so that it gets the name:
      // const establishmentName = estabDB.getEstablishment(drink.establishment_id).name
      drinkArray.push({
        'friend uid': drink.friend_uid,
        'drink name': drink.drink_name,
        'drink desc': drink.drink_desc,
        establishment: drink.establishment_id,
        'image url': drink.drink_img,
        'drink id': drink.drink_id,
        date: drink.date
      })
    })

    // send the custom drink array as a json
    res.json({ drinks: drinkArray, success: true })
  } else {
    res.json({ drinks: [], success: false })
  }
}

/**
 * Outputs fav_drinks table
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.allUsersDrinks = (req, res) => {
  // send the custom drink array as a json
  res.json({ pairs: favDrinksDB.toString(), success: true })
}

exports.editGroupName = (req, res) => {
  const uid = req.body.uid
  const groupId = req.body.groupId
  const groupName = req.body.groupName

  groupsDB.editGroupName(uid, groupId, groupName)

  res.redirect('/groups/getGroup/' + groupId)
}
