const assert = require('assert')
const Database = require('better-sqlite3')

const sampleDatabase = require('../src/sample/sample_database')

const db = new Database('databases/sample.db')

describe('Testing SampleDatabase', () => {
  it('insert into database', () => {
    const userDb = new sampleDatabase.SampleDatabase(db)
    assert.strictEqual(userDb.insertData('hi', 687), 1)
  })
})
