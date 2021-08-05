const { assert, expect } = require('chai')
const Database = require('better-sqlite3')
const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)

const friendDatabase = require('../app/models/database/friend_database')

const db = new Database('databases/test_friends.db')

/**
 * @type {FriendDatabase}
 */
const friendDb = new friendDatabase.FriendDatabase(db)
friendDb.deleteAllTableEntires()

describe('Testing Friend Database', function () {
  it('Test Database Schema', function () {
    const schema = 'CREATE TABLE friends (uid INTEGER, friend_uid INTEGER, status INTEGER)'
    assert.equal(friendDb.getSchema().sql, schema)
  })

  it('Test insertFriend', function () {
    const info = friendDb.insertFriend(1, 2, friendDatabase.FriendStatus.FRIENDS)
    assert.equal(1, info.changes)
  })

  it('Test getFriendStatus', function () {
    friendDb.insertFriend(2, 3, friendDatabase.FriendStatus.INCOMING)
    assert.equal(friendDb.getFriendStatus(2, 3), friendDatabase.FriendStatus.INCOMING)
  })

  it('Test updateFriendStatus', function () {
    friendDb.insertFriend(3, 4, friendDatabase.FriendStatus.INCOMING)
    friendDb.updateFriendStatus(3, 4, friendDatabase.FriendStatus.FRIENDS)
    assert.equal(friendDb.getFriendStatus(3, 4), friendDatabase.FriendStatus.FRIENDS)
  })

  it('Test updateFriendStatus friends not in database', function () {
    friendDb.insertFriend(4, 5, friendDatabase.FriendStatus.INCOMING)
    friendDb.updateFriendStatus(6, 7, friendDatabase.FriendStatus.FRIENDS)
    assert.isUndefined(friendDb.getFriendStatus(6, 7))
  })

  it('Test sendFriendRequest outgoing', function () {
    friendDb.sendFriendRequest(7, 8)
    assert.equal(friendDb.getFriendStatus(7, 8), friendDatabase.FriendStatus.OUTGOING)
  })

  it('Test sendFriendRequest incoming', function () {
    friendDb.sendFriendRequest(8, 9)
    assert.equal(friendDb.getFriendStatus(9, 8), friendDatabase.FriendStatus.INCOMING)
  })

  it('Test acceptFriendRequest', function () {
    friendDb.sendFriendRequest(9, 10)
    friendDb.acceptFriendRequest(9, 10)
    assert.equal(friendDb.getFriendStatus(9, 10), friendDatabase.FriendStatus.FRIENDS)
  })

  it('Test getAllCurrentFriends', function () {
    friendDb.insertFriend(11, 12, friendDatabase.FriendStatus.FRIENDS)
    friendDb.insertFriend(11, 13, friendDatabase.FriendStatus.FRIENDS)
    friendDb.insertFriend(11, 14, friendDatabase.FriendStatus.FRIENDS)
    friendDb.insertFriend(11, 15, friendDatabase.FriendStatus.FRIENDS)
    friendDb.insertFriend(11, 16, friendDatabase.FriendStatus.FRIENDS)
    // const friends = friendDb.getCurrentFriends(11)

    expect(friendDb.getAllCurrentFriends(11)).to.be.containingAllOf([12, 13, 14, 15, 16])
  })
})
