const { assert } = require('chai')
const Database = require('better-sqlite3')

const drinksDatabase = require('../src/drinks_database')

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/sample.db')
const drinksDb = new drinksDatabase.DrinksDatabase(db)

drinksDb.purgeDb()

describe('Testing Drinks Database', function () {
  it('Test: Add New Drink', function () {
    assert.isAtLeast(drinksDb.addDrink('drink1'), 0)
  })

  it('Test: Is Drink Exist', function () {
    let name = 'drinka'
    let desc = 'this drink is cool'
    let id = drinksDb.addDrink(name, desc)
    assert.equal(drinksDb.isExist(id), true)
  })

  it('Test: Get Drink', function () {
    let name = 'sprite'
    let desc = 'this drink sucks'
    let id = drinksDb.addDrink(name, desc)
    let testDrink = {
      drink_id: id,
      drink_name: name,
      drink_desc: desc
    } 
    assert.deepEqual(drinksDb.getDrink(id), testDrink)
  })
})
