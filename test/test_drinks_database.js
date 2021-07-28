const { assert } = require('chai')
const Database = require('better-sqlite3')

const drinksDatabase = require('../src/drinks_database')

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/sample.db')
const drinksDb = new drinksDatabase.DrinksDatabase(db)

drinksDb.resetDb()

describe('Testing Drinks Database', function () {
  it('Test: Add New Drink', function () {
    assert.isAtLeast(drinksDb.addDrink('drink1'), 0)
  })

  it('Test: Is Drink Exist', function () {
    const name = 'drinka'
    const desc = 'this drink is cool'
    const id = drinksDb.addDrink(name, desc)
    assert.equal(drinksDb.isExist(id), true)
  })

  it('Test: Get Drink', function () {
    const name = 'sprite'
    const desc = 'this drink sucks'
    const id = drinksDb.addDrink(name, desc)
    const testDrink = {
      drink_id: id,
      drink_name: name,
      drink_desc: desc
    }
    assert.deepEqual(drinksDb.getDrink(id), testDrink)
  })

  it('Test: Edit Drink, Both Name And Desc', function () {
    const name = 'lemonade'
    const desc = 'a sour drink for summer'
    const id = drinksDb.addDrink(name, desc)

    const newname = 'limeade'
    const newdesc = 'a refreshing drink for summer'
    const testDrink = {
      drink_id: id,
      drink_name: newname,
      drink_desc: newdesc
    }

    drinksDb.editDrink(id, newname, newdesc)
    assert.deepEqual(drinksDb.getDrink(id), testDrink)
  })

  it('Test: Edit Drink, Name Only', function () {
    const name = 'lemonade'
    const desc = 'a sour drink for summer'
    const id = drinksDb.addDrink(name, desc)

    const newname = 'limeade'
    // const newdesc = 'a refreshing drink for summer'
    const testDrink = {
      drink_id: id,
      drink_name: newname,
      drink_desc: desc
    }

    drinksDb.editDrink(id, newname, undefined)
    assert.deepEqual(drinksDb.getDrink(id), testDrink)
  })

  it('Test: Edit Drink, Desc Only', function () {
    const name = 'lemonade'
    const desc = 'a sour drink for summer'
    const id = drinksDb.addDrink(name, desc)

    // const newname = 'limeade'
    const newdesc = 'a refreshing drink for summer'
    const testDrink = {
      drink_id: id,
      drink_name: name,
      drink_desc: newdesc
    }

    drinksDb.editDrink(id, undefined, newdesc)
    assert.deepEqual(drinksDb.getDrink(id), testDrink)
  })

  it('Test: Edit Drink, None', function () {
    const name = 'lemonade'
    const desc = 'a sour drink for summer'
    const id = drinksDb.addDrink(name, desc)

    assert.equal(drinksDb.editDrink(id), false)
  })

  it('Test: Edit Drink, Does Not Exist', function () {
    assert.equal(drinksDb.editDrink(-1), false)
  })
})
