const Database = require('better-sqlite3')
const config = require('../../config.json')

class FriendDatabase {
  constructor (database) {
    if (database === undefined) {
      this.db = new Database(config.db)
    } else {
      this.db = database
    }
    this.createFriendsTable()
  }

  createFriendsTable () {
    this.db.prepare('CREATE TABLE IF NOT EXISTS friends (uid INTEGER, friend_uid INTEGER, status INTEGER);').run()
  }

  getSchema () {
    const schema = this.db.prepare("SELECT sql FROM sqlite_master WHERE name='friends'").get()
    return schema
  }

  /**
   * Insert a new friendship status between two users, should not be called outside of this file except for testing
   * @param {*} uid
   * @param {*} friendUid
   * @param {*} status
   * @returns info (see better-sqlite3 docs for .run()) if successful, undefined otherwise if a friendship status between the two users already exists
   */
  insertFriend (uid, friendUid, status) {
    if (uid === friendUid) {
      return undefined
    }
    const friendStatus = this.getFriendStatus(uid, friendUid)
    if (friendStatus === undefined) {
      return this.db.prepare(`INSERT INTO friends VALUES ('${uid}', '${friendUid}', '${status}');`).run()
    } else {
      return undefined
    }
  }

  updateFriendStatus (uid, friendUid, status) {
    return this.db.prepare(`UPDATE friends SET status = '${status}' WHERE uid = ${uid} AND friend_uid = ${friendUid};`).run()
  }

  deleteAllTableEntires () {
    return this.db.prepare('DELETE FROM friends;').run()
  }

  /**
   * Add a friend request between the requester and requested
   * @param {*} requesterUid
   * @param {*} requestedUid
   * @returns true if successful, false otherwise
   */
  sendFriendRequest (requesterUid, requestedUid) {
    if (this.insertFriend(requesterUid, requestedUid, FriendStatus.OUTGOING) !== undefined) {
      if (this.insertFriend(requestedUid, requesterUid, FriendStatus.INCOMING) !== undefined) {
        return true
      }
    }
    return false
  }

  acceptFriendRequest (uid, friendUid) {
    if (this.updateFriendStatus(uid, friendUid, FriendStatus.FRIENDS).changes > 0) {
      if (this.updateFriendStatus(friendUid, uid, FriendStatus.FRIENDS).changes > 0) {
        return true
      }
    }
    return false
  }

  /**
   * Get the friendship status of two users, from the perspective of the user whose id is provided in the first argument
   * @param {*} uid
   * @param {*} friendUid
   * @returns the friendship status if the two users have one, undefined otherwise
   */
  getFriendStatus (uid, friendUid) {
    const row = this.db.prepare(`SELECT status FROM friends WHERE uid = ${uid} AND friend_uid = ${friendUid};`).get()
    if (row !== undefined) {
      return row.status
    } else {
      return undefined
    }
  }

  /**
   * Get all of a users current friends (not outgoing or incoming)
   * @param {*} uid
   * @returns an array containing the ids of all current friends of the user
   */
  getAllCurrentFriends (uid) {
    return this.getAllFriendsByStatus(uid, FriendStatus.FRIENDS)
  }

  getAllIncomingFriends (uid) {
    return this.getAllFriendsByStatus(uid, FriendStatus.INCOMING)
  }

  getAllOutgoingFriends (uid) {
    return this.getAllFriendsByStatus(uid, FriendStatus.OUTGOING)
  }

  /**
   * Get all of a users current friends (not outgoing or incoming)
   * @param {*} uid
   * @param {*} status
   * @returns an array containing the ids of all current friends of the user
   */
  getAllFriendsByStatus (uid, status) {
    const friends = this.db.prepare(`SELECT friend_uid FROM friends WHERE uid = ${uid} AND status = '${status}';`).all()
    const friendIdArray = []
    friends.forEach((friend) => {
      friendIdArray.push(friend.friend_uid)
    })
    return friendIdArray
  }

  getAllFriendData (uid) {
    return this.db.prepare(`SELECT * FROM friends WHERE uid = ${uid};`).all()
  }

  /**
   *
   * @param {*} uid
   * @returns {Array}
   */
  getAllTableData (uid) {
    return this.db.prepare('SELECT * FROM friends;').all()
  }

  /**
   * meant only for debug/dev purposes
   * @param {*} uid
   * @param {*} friendUid
   */
  addCurrentFriend (uid, friendUid) {
    if (uid !== friendUid) {
      this.db.prepare(`INSERT INTO friends VALUES ('${uid}', '${friendUid}', '${FriendStatus.FRIENDS}');`).run()
      this.db.prepare(`INSERT INTO friends VALUES ('${friendUid}', '${uid}', '${FriendStatus.FRIENDS}');`).run()
    }
  }

  /**
   * Return the id, username, and display_name of all of a users's friends
   * @param {*} uid
   * @returns {Array}
   */
  getFriendDataByUid (uid) {
    return this.db.prepare(`SELECT users2.uid, users2.username AS username, users2.display_name AS display_name FROM users JOIN friends ON users.uid = friends.uid JOIN users users2 ON friends.friend_uid = users2.uid WHERE users.uid = ${uid} AND friends.status = 'friends' ORDER BY LOWER(users2.display_name);`).all()
  }

  /**
   * Search for a user's friends which start with the given username string
   * @param {*} uid 
   * @param {*} username 
   */
  searchFriends(uid, username) {
    return this.db.prepare(`SELECT users2.uid, users2.username, users2.display_name FROM users JOIN friends ON users.uid = friends.uid JOIN users users2 ON friends.friend_uid = users2.uid WHERE users.uid = ${uid} AND friends.status = 'friends' AND users2.username LIKE '${username}%' ORDER BY users2.username;`).all()
  }
}

const FriendStatus = {
  OUTGOING: 'outgoing',
  INCOMING: 'incoming',
  FRIENDS: 'friends'
}

module.exports = { FriendDatabase, FriendStatus }
