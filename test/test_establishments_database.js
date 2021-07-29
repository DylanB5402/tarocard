const { assert } = require('chai')
const Database = require('better-sqlite3')

const establishmentsDatabase = require('../app/models/database/establishments_database')

const db = new Database('databases/sample.db')
const establishmentsDb = new establishmentsDatabase.EstablishmentsDatabase(db)

establishmentsDb.resetDb()

describe('Testing Establishments Database', function () {
  it('Test: Add New Establishment', function () {
    assert.isAtLeast(establishmentsDb.addEstablishment('starbucks'), 0)
  })

  it('Test: Is Establishment Exist', function () {
    const name = 'mcdonalds'
    const desc = 'borgar'
    const id = establishmentsDb.addEstablishment(name, desc)
    assert.equal(establishmentsDb.isExist(id), true)
  })

  it('Test: Get Establishment', function () {
    const name = 'mcdonalds'
    const desc = 'borgar'

    const id = establishmentsDb.addEstablishment(name, desc)
    const testEstablishment = {
      establishment_id: id,
      establishment_name: name,
      establishment_desc: desc,
      establishment_img: '',
    }
    assert.deepEqual(establishmentsDb.getEstablishment(id), testEstablishment)
  })

  it('Test: Edit Establishment, Both Name And Desc', function () {
    const name = 'mcdonalds'
    const desc = 'borgar'
    const id = establishmentsDb.addEstablishment(name, desc)

    const newname = 'burger king'
    const newdesc = 'times have changed'
    const testEstablishment = {
      establishment_id: id,
      establishment_name: newname,
      establishment_desc: newdesc,
      establishment_img: '',
    }

    establishmentsDb.editEstablishment(id, newname, newdesc)
    assert.deepEqual(establishmentsDb.getEstablishment(id), testEstablishment)
  })

  it('Test: Edit Establishment, Name Only', function () {
    const name = 'mcdonalds'
    const desc = 'borgar'
    const id = establishmentsDb.addEstablishment(name, desc)

    const newname = 'burger king'
    // const newdesc = 'times have changed'
    const testEstablishment = {
      establishment_id: id,
      establishment_name: newname,
      establishment_desc: desc,
      establishment_img: '',
    }

    establishmentsDb.editEstablishment(id, newname, undefined)
    assert.deepEqual(establishmentsDb.getEstablishment(id), testEstablishment)
  })

  it('Test: Edit Establishment, Desc Only', function () {
    const name = 'mcdonalds'
    const desc = 'borgar'
    const id = establishmentsDb.addEstablishment(name, desc)

    // const newname = 'burger king'
    const newdesc = 'times have changed'
    const testEstablishment = {
      establishment_id: id,
      establishment_name: name,
      establishment_desc: newdesc,
      establishment_img: '',
    }

    establishmentsDb.editEstablishment(id, undefined, newdesc)
    assert.deepEqual(establishmentsDb.getEstablishment(id), testEstablishment)
  })

  it('Test: Edit Establishment, None', function () {
    const name = 'mcdonalds'
    const desc = 'borgar'
    const id = establishmentsDb.addEstablishment(name, desc)

    assert.equal(establishmentsDb.editEstablishment(id), false)
  })

  it('Test: Edit Establishment, Does Not Exist', function () {
    assert.equal(establishmentsDb.editEstablishment(-1), false)
  })

  it('Test: Add Image To Establishment Successfully', function () {
    const name = 'mcdonalds'
    const desc = 'borgar'
    const id = establishmentsDb.addEstablishment(name, desc)

    const img = 'uploads/image/avatar/4CE68898-123A-4FD9-ACD4-C96342D67AC9.jpg'
    establishmentsDb.addImage(id, img)
    assert.equal(establishmentsDb.getEstablishment(id).establishment_img, img)
  })

  it('Test: Add Image To Establishment Unsuccessfully', function () {
    const name = 'mcdonalds'
    const desc = 'borgar'
    const id = establishmentsDb.addEstablishment(name, desc)

    const img = 'uploads/image/avatar/fake.jpg'
    assert.equal(establishmentsDb.addImage(id, img), false)
  })
})
