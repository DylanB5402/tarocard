const { assert } = require('chai')
const chai = require('chai')
const assertArrays = require('chai-arrays')
const Database = require('better-sqlite3')
const userDatabase = require('../app/models/database/user_database')

chai.use(assertArrays)
const db = new Database('databases/test_settings.db')
const userDb = new userDatabase.UserDatabase(db)
userDb.deleteAllTableEntries()

describe('Testing UserDatabase', function () {
  it('Test Database Schema', function () {
    const tableSchema = 'CREATE TABLE users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, display_name TEXT, bio TEXT, profile_picture TEXT, banner TEXT)'
    assert.equal(userDb.getSchema().sql, tableSchema)
  })

  it('Test update email', function () {
    const uid = userDb.insertNewUser('user1@email.com', 'password', 'user1')
    userDb.updateEmail(uid, 'user2@email.com')
    assert.equal(userDb.getAllProfileData(uid).email, 'user2@email.com')
  })

  it('Test update password', function () {
    const uid = userDb.insertNewUser('user3@email.com', 'password', 'user3')
    userDb.updatePassword(uid, 'newPassword')
    assert.equal(userDb.checkPassword('user3@email.com', 'newPassword'), true)
  })
})
