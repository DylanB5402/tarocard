const { assert, expect } = require('chai')
const Database = require('better-sqlite3')
const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)

const friendDatabase = require('../app/models/database/friend_database')
const userDatabase = require('../app/models/database/user_database')

const db = new Database('databases/test_friends.db')
const userDb = new userDatabase.UserDatabase(db)
const friendDb = new friendDatabase.FriendDatabase(db)
userDb.deleteAllTableEntries()
friendDb.deleteAllTableEntires()

describe('Testing UserDatabase and FriendDatabase', function () {
  it('Test User Database Schema', function () {
    const tableSchema = 'CREATE TABLE users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, display_name TEXT, bio TEXT, profile_picture TEXT, banner TEXT)'
    assert.equal(userDb.getSchema().sql, tableSchema)
  })

  it('Test Friend Database Schema', function () {
    const schema = 'CREATE TABLE friends (uid INTEGER, friend_uid INTEGER, status TEXT, timestamp TEXT)'
    assert.equal(friendDb.getSchema().sql, schema)
  })

  it('Test getCurrentFriends', function () {
    const userIds = []
    userIds.push(userDb.insertNewUser('user4', 'password', 'user4'))
    userIds.push(userDb.insertNewUser('user3', 'password', 'user3'))
    userIds.push(userDb.insertNewUser('user2', 'password', 'user2'))
    userIds.push(userDb.insertNewUser('user1', 'password', 'user1'))
    userIds.push(userDb.insertNewUser('user5', 'password', 'user5'))
    friendDb.addCurrentFriend(userIds[0], userIds[1])
    friendDb.addCurrentFriend(userIds[0], userIds[2])
    friendDb.addCurrentFriend(userIds[0], userIds[3])
    const currentFriends = friendDb.getFriendDataByUid(userIds[0])
    const friendUsernames = []
    currentFriends.forEach((friend) => {
      friendUsernames.push(friend.username)
    })
    expect(friendUsernames).to.be.containingAllOf(['user2', 'user3', 'user1'])
  })

  it('Test searchFriends', function () {
    const userIds = []
    userIds.push(userDb.insertNewUser('user10', 'password', 'user10'))
    userIds.push(userDb.insertNewUser('a_user9', 'password', 'a_user9'))
    userIds.push(userDb.insertNewUser('a_user8', 'password', 'a_user8'))
    userIds.push(userDb.insertNewUser('user7', 'password', 'user7'))
    userIds.push(userDb.insertNewUser('user6', 'password', 'user6'))
    friendDb.addCurrentFriend(userIds[0], userIds[1])
    friendDb.addCurrentFriend(userIds[0], userIds[2])
    friendDb.addCurrentFriend(userIds[0], userIds[3])
    const currentFriends = friendDb.searchFriends(userIds[0], 'a_us')
    const friendUsernames = []
    currentFriends.forEach((friend) => {
      friendUsernames.push(friend.username)
    })
    expect(friendUsernames).to.be.containingAllOf(['a_user8', 'a_user9'])
  })
})
