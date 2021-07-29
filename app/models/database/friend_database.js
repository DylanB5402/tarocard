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

  sendFriendRequest (requesterUid, requestedUid) {
    this.insertFriend(requesterUid, requestedUid, FriendStatus.OUTGOING)
    this.insertFriend(requestedUid, requesterUid, FriendStatus.INCOMING)
  }

  acceptFriendRequest (uid, friendUid) {
    this.updateFriendStatus(uid, friendUid, FriendStatus.FRIENDS)
    this.updateFriendStatus(friendUid, uid, FriendStatus.FRIENDS)
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
}

const FriendStatus = {
  OUTGOING: 'outgoing',
  INCOMING: 'incoming',
  FRIENDS: 'friends'
}

module.exports = { FriendDatabase, FriendStatus }
