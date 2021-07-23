const Database = require('better-sqlite3')

class FriendDatabase {
  constructor (database) {
    /**
         * @type {!Database}
         */
    this.db = database
    this.createFriendsTable()
  }

  createFriendsTable () {
    this.db.prepare('CREATE TABLE IF NOT EXISTS friends (uid INTEGER, friend_uid INTEGER, status INTEGER);').run()
  }

  getSchema () {
    const schema = this.db.prepare("SELECT sql FROM sqlite_master WHERE name='friends'").get()
    return schema
  }

  insertFriend (uid, friendUid, status) {
    if (this.getFriendStatus(uid, friendUid !== undefined)) {
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
