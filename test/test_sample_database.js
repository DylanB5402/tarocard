const assert = require('assert')
const Database = require('better-sqlite3')

<<<<<<< HEAD
const sampleDatabase = require('../src/sample/sample_database')

const db = new Database('databases/sample.db')

describe('Testing SampleDatabase', () => {
  it('insert into database', () => {
    const userDb = new sampleDatabase.SampleDatabase(db)
    assert.strictEqual(userDb.insertData('hi', 687), 1)
=======
const sample_database = require('../src/sample/sample_database')

const db = new Database('databases/sample.db', { verbose: console.log })

describe('Testing SampleDatabase', () => {
  it('insert into database', () => {
    const user_db = new sample_database.SampleDatabase(db)
    assert.strictEqual(user_db.insertData('hi', 687), 1)
>>>>>>> dev-fav-drinks
  })
})
