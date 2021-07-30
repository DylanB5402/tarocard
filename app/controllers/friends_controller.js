const friendDatabase = require('../models/database/friend_database')

const friendDb = new friendDatabase.FriendDatabase()

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
    res.send('false')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.currentFriends = (req, res) => {
  const uid = req.params.uid
}

exports.friends = (r)
