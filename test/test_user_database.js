const { assert, expect } = require('chai')
const Database = require('better-sqlite3')
const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)

const userDatabase = require('../src/user_database')

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/test_user.db')
const userDb = new userDatabase.UserDatabase(db)
userDb.deleteAllTableEntries()

describe('Testing UserDatabase', function () {
  it('Test Database Schema', function () {
    const tableSchema = 'CREATE TABLE users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, display_name TEXT, bio TEXT, profile_picture BLOB, banner BLOB)'
    assert.equal(userDb.getSchema().sql, tableSchema)
  })

  it('Test InsertNewUser for a new user', function () {
    const lastRowId = userDb.insertNewUser('user@email.com', 'password', 'user')
    const emailRowId = userDb.selectUserSessionData('user@email.com').uid
    assert.equal(lastRowId, emailRowId)
  })

  it('Test InsertNewUser user already exits', function () {
    userDb.insertNewUser('user2@email.com', 'password', 'user2')
    assert.equal(userDb.insertNewUser('user2@email.com', 'password'), -1)
  })

  it('Test isEmailInDatabase', function () {
    userDb.insertNewUser('user3@email.com', 'password', 'user3')
    assert.equal(userDb.isEmailInDatabase('user3@email.com'), true)
  })

  it('Test isEmailInDatabase false', function () {
    assert.equal(userDb.isEmailInDatabase('user4@email.com'), false)
  })

  it('Test selectUserSessionData check username', function () {
    userDb.insertNewUser('user5@email.com', 'password', 'user5')
    const sessionData = userDb.selectUserSessionData('user5@email.com')
    assert.equal(sessionData.username, 'user5')
  })

  it('Test selectUserSessionData check display_name', function () {
    userDb.insertNewUser('user6@email.com', 'password', 'user6')
    const sessionData = userDb.selectUserSessionData('user6@email.com')
    assert.equal(sessionData.display_name, 'user6')
  })

  it('Test selectUserSessionData email does not exist', function () {
    const sessionData = userDb.selectUserSessionData('user7@email.com')
    assert.isUndefined(sessionData)
  })

  it('Test checkPassword success', function () {
    userDb.insertNewUser('user7@email.com', 'password', 'user7')
    assert.isTrue(userDb.checkPassword('user7@email.com', 'password'))
  })

  it('Test checkPassword failure', function () {
    userDb.insertNewUser('user8@email.com', 'password', 'user8')
    assert.isFalse(userDb.checkPassword('user8@email.com', 'password123'))
  })

  it('Test insertProfileData', function () {
    userDb.insertNewUser('user9@email.com', 'password', 'user9')
    assert.equal(userDb.insertProfileData('user9@email.com', 'nine', 'nine', 'I am user nine').changes, 1)
  })

  it('Test selectProfileData', function () {
    userDb.insertNewUser('user10@email.com', 'password', 'user10')
    userDb.insertProfileData('user10@email.com', 'ten', 'ten', 'I am user ten')
    const userData = userDb.selectProfileData('user10@email.com')
    const userArray = [userData.username, userData.display_name, userData.bio]
    expect(userArray).to.be.containingAllOf(['ten', 'ten', 'I am user ten'])
  })

  it('Test selectUserID', function () {
    userDb.insertNewUser('user11@email.com', 'password', 'user11')
    assert.isNumber(userDb.selectUserId('user11@email.com'))
  })
}
)
