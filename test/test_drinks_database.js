const { assert } = require('chai')
const Database = require('better-sqlite3')

const drinksDatabase = require('../app/models/database/drinks_database')
const establishmentsDatabase = require('../app/models/database/establishments_database')

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/sample.db')
const drinksDb = new drinksDatabase.DrinksDatabase(db)
const establishmentsDb = new establishmentsDatabase.EstablishmentsDatabase(db)

drinksDb.resetDb()
establishmentsDb.resetDb()

describe('Testing Drinks Database', function () {
  it('Test: Add New Drink', function () {
    assert.isAtLeast(drinksDb.addDrink('drink1'), 0)
  })

  it('Test: Add New Drink, Correct Establishment', function () {
    const establishmentId = establishmentsDb.addEstablishment('mcdonalds')
    const id = drinksDb.addDrink('drink1', undefined, establishmentId, undefined)

    assert.equal(drinksDb.getDrink(id).establishment_id, establishmentId)
  })

  it('Test: Add New Drink, Incorrect Establishment', function () {
    const id = drinksDb.addDrink('drink1', undefined, -100, undefined)

    // Default to -1
    assert.equal(drinksDb.getDrink(id).establishment_id, -1)
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
      drink_desc: desc,
      drink_img: '',
      establishment_id: -1
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
      drink_desc: newdesc,
      drink_img: '',
      establishment_id: -1
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
      drink_desc: desc,
      drink_img: '',
      establishment_id: -1
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
      drink_desc: newdesc,
      drink_img: '',
      establishment_id: -1
    }

    drinksDb.editDrink(id, undefined, newdesc)
    assert.deepEqual(drinksDb.getDrink(id), testDrink)
  })

  it('Test: Edit Drink, Correct Establishment', function () {
    const name = 'lemonade'
    const desc = 'a sour drink for summer'
    const id = drinksDb.addDrink(name, desc)
    const establishmentId = establishmentsDb.addEstablishment('china')

    drinksDb.editDrink(id, undefined, undefined, establishmentId)

    assert.equal(drinksDb.getDrink(id).establishment_id, establishmentId)
  })

  it('Test: Edit Drink, Incorrect Establishment', function () {
    const name = 'lemonade'
    const desc = 'a sour drink for summer'
    const id = drinksDb.addDrink(name, desc)

    drinksDb.editDrink(id, undefined, undefined, -100)

    assert.equal(drinksDb.getDrink(id).establishment_id, -1)
  })

  it('Test: Edit Drink, Does Not Exist', function () {
    assert.equal(drinksDb.editDrink(-1), false)
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

  it('Test: Add Image To Drink Successfully', function () {
    const name = 'lemonade'
    const desc = 'a sour drink for summer'
    const id = drinksDb.addDrink(name, desc)

    const img = 'uploads/image/avatar/4CE68898-123A-4FD9-ACD4-C96342D67AC9.jpg'
    drinksDb.addImage(id, img)
    assert.equal(drinksDb.getDrink(id).drink_img, img)
  })

  it('Test: Add Image To Drink Unsuccessfully', function () {
    const name = 'lemonade'
    const desc = 'a sour drink for summer'
    const id = drinksDb.addDrink(name, desc)

    const img = 'uploads/image/avatar/fake.jpg'
    assert.equal(drinksDb.addImage(id, img), false)
  })
})
