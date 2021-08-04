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
    const tableSchema = 'CREATE TABLE users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, display_name TEXT, bio TEXT, profile_picture BLOB, banner BLOB)'
    assert.equal(userDb.getSchema().sql, tableSchema)
  })

  it('Test Friend Database Schema', function () {
    const schema = 'CREATE TABLE friends (uid INTEGER, friend_uid INTEGER, status INTEGER)'
    assert.equal(friendDb.getSchema().sql, schema)
  })

  it('Test getCurrentFriends', function () {
    const userIds = []
    userIds.push(userDb.insertNewUser('user4', 'password', 'user1'))
    userIds.push(userDb.insertNewUser('user3', 'password', 'user2'))
    userIds.push(userDb.insertNewUser('user2', 'password', 'user3'))
    userIds.push(userDb.insertNewUser('user1', 'password', 'user4'))
    friendDb.addCurrentFriend(userIds[0], userIds[1])
    friendDb.addCurrentFriend(userIds[0], userIds[2])
    friendDb.addCurrentFriend(userIds[0], userIds[3])
    const currentFriends = friendDb.getFriendDataByUid(userIds[0])
    console.log(currentFriends)
    // currentFriends.forEach( (friend))

    assert.equal(2, 687)
  })
})
