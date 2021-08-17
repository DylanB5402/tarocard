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
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.currentFriends = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const friendArray = []
    const currentFriends = friendDb.getFriendDataByUid(uid)
    currentFriends.forEach((friend) => {
      friendArray.push({
        'display name': friend.display_name,
        username: friend.username,
        'image url': friend.profile_picture,
        id: friend.uid
      })
    })
    res.json({ users: friendArray, success: true })
  } else {
    res.json({ users: [], success: false })
  }
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
    const friendArray = []
    const currentFriends = friendDb.searchFriends(uid, search)
    currentFriends.forEach((friend) => {
      friendArray.push({
        'display name': friend.display_name,
        username: friend.username,
        'image url': friend.profile_picture,
        id: friend.uid
      })
    })
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
    const friendArray = []
    const incomingFriends = friendDb.getIncomingFriendDataByUid(uid)
    incomingFriends.forEach((friend) => {
      friendArray.push({
        'display name': friend.display_name,
        username: friend.username,
        'image url': friend.profile_picture,
        id: friend.uid
      })
    })
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
  // console.log(friendDb.getRecentFriends(req.session.uid))
  if (req.session.loggedin) {
    const uid = req.session.uid
    const friendArray = friendDb.formatFriendData(friendDb.getRecentFriends(uid))
    res.json({ users: friendArray, success: false })
  } else {
    res.json({ users: [], success: false })
  }
  // res.send('687')
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