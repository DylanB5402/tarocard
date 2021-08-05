const { assert, expect } = require('chai')
const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)

const userDatabase = require('../app/models/database/user_database')

const userDb = new userDatabase.UserDatabase()
userDb.deleteAllTableEntries()

describe('Testing UserDatabase', function () {
  it('Test Database Schema', function () {
    const tableSchema = 'CREATE TABLE users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, display_name TEXT, bio TEXT, profile_picture BLOB, banner BLOB)'
    assert.equal(userDb.getSchema().sql, tableSchema)
  })

  it('Test update email', function () {
    const uid = userDb.insertNewUser('user1@email.com', 'password', 'user1')
    userDb.updateEmail(uid, 'user2@email.com')
    assert.equal('user2@email.com', userDb.getAllProfileData(uid).email)
  })
})
