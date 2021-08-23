const friendDatabase = require('../models/database/friend_database')

const friendDb = new friendDatabase.FriendDatabase()

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.requestLegacy = (req, res) => {
  const uid = req.session.uid
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
exports.acceptLegacy = (req, res) => {
  const uid = req.session.uid
  const friendUid = req.params.friendUid
  if (friendDb.acceptFriendRequest(uid, friendUid)) {
    res.send('success')
  } else {
    res.send('failure')
  }
}

/**
 * Get the currently logged in user's friends
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.currentFriends = (req, res) => {
  if (req.session.loggedin) {
    // const uid = req.session.uid
    var uid = undefined;
    if (req.body.uid == undefined) {
      uid = req.session.uid
    } else {
      uid = req.body.id
    }
    const currentFriends = friendDb.getFriendDataByUid(uid)
    const friendArray = friendDb.formatFriendData(currentFriends)
    res.json({ users: friendArray, success: true })
  } else {
    res.json({ users: [], success: false })
  }
}

// /**
//  * Get the friends of any user based off their uid
//  * @param {!import('express').Request} req
//  * @param {!import('express').Response} res
//  */
//  exports.currentFriendsByID = (req, res) => {
//   if (req.session.loggedin) {
//     const uid = undefined;
//     if (req.body.uid == undefined) {
//       uid = req.session.uid
//     } else {
//       uid = req.body.id
//     }
//     const currentFriends = friendDb.getFriendDataByUid(uid)
//     const friendArray = friendDb.formatFriendData(currentFriends)
//     res.json({ users: friendArray, success: true })
//   } else {
//     res.json({ users: [], success: false })
//   }
// }

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
    res.redirect('/friendsPage/friendsPage.html')
  } else {
    res.redirect('/')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.searchFriends = (req, res) => {
  const search = req.body.string
  if (req.session.loggedin) {
    const uid = req.session.uid
    const currentFriends = friendDb.searchFriends(uid, search)
    const friendArray = friendDb.formatFriendData(currentFriends)
    res.json({ users: friendArray, success: true })
  } else {
    res.json({ users: [], success: false })
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.listIncomingFriends = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const incomingFriends = friendDb.getIncomingFriendDataByUid(uid)
    const friendArray = friendDb.formatFriendData(incomingFriends)
    res.json({ users: friendArray, success: true })
  } else {
    res.json({ users: [], success: false })
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.recentFriends = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const friendArray = friendDb.formatFriendData(friendDb.getRecentFriends(uid))
    friendArray.splice(10)
    res.json({ users: friendArray, success: false })
  } else {
    res.json({ users: [], success: false })
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.request = (req, res) => {
  const uid = req.session.uid
  const friendUid = req.body.id
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
  const uid = req.session.uid
  const friendUid = req.body.id
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
exports.deny = (req, res) => {
  const uid = req.session.uid
  const friendUid = req.body.id
  friendDb.deleteFriendRequest(uid, friendUid)
  res.send('success')
}
