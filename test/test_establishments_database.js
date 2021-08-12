const { assert } = require('chai')
const Database = require('better-sqlite3')

const establishmentsDatabase = require('../app/models/database/establishments_database')

const db = new Database('databases/sample.db')
const establishmentsDb = new establishmentsDatabase.EstablishmentsDatabase(db)

establishmentsDb.resetDb()

describe('Testing Establishments Database', function () {
  it('Test: Add New Establishment', function () {
    const establishment = {
      id: 'bbbBBBbb',
      name: 'mcdonalds',
      alias: 'borgar'
    }

    assert.equal(establishmentsDb.addEstablishment(establishment), true)
  })

  it('Test: Add New Establishment, FAIL', function () {
    const establishment = {
      name: 'mcdonalds',
      alias: 'borgar'
    }

    assert.equal(establishmentsDb.addEstablishment(establishment), false)
  })

  it('Test: Is Establishment Exist', function () {
    const establishment = {
      id: 'zZzZzkkk',
      name: 'mcdonalds',
      alias: 'borgar'
    }

    establishmentsDb.addEstablishment(establishment)
    assert.equal(establishmentsDb.isExist(establishment.id), true)
  })

  it('Test: Get Establishment', function () {
    const establishment = {
      id: 'brbNewId',
      name: 'mcdonalds',
      alias: 'borgar',
      phone: '+11923139831923',
      display_phone: '(858) 129-19921455',
      review_count: 0,
      rating: 5,
      address1: 'cool st.',
      address2: '',
      address3: '',
      city: 'san diego',
      zip_code: '911111111',
      country: 'US',
      state: 'CA',
      price: '$',
      img: 'http://www.wikipedia.com'
    }

    establishmentsDb.addEstablishment(establishment)
    assert.deepEqual(establishmentsDb.getEstablishment(establishment.id), establishment)
  })

  it('Test: Edit Establishment', function () {
    const establishment = {
      id: 'aAbBcC',
      name: 'mcdonalds',
      alias: 'borgar',
      phone: '+11923139831923',
      display_phone: '(858) 129-19921455',
      review_count: 0,
      rating: 5,
      address1: 'cool st.',
      address2: '',
      address3: '',
      city: 'san diego',
      zip_code: '911111111',
      country: 'US',
      state: 'CA',
      price: '$',
      img: 'http://www.wikipedia.com'
    }

    establishmentsDb.addEstablishment(establishment)

    const newEstablishment = {
      id: 'aAbBcC',
      name: 'clownronalds',
      alias: 'china',
      phone: '+192383',
      display_phone: '(232) 129-19921455',
      review_count: 1400000,
      rating: 0.5,
      address1: 'not so cool st.',
      address2: '2',
      address3: '3',
      city: 'san francisco',
      zip_code: '911 what is the emergency',
      country: 'SA',
      state: 'EN',
      price: '$$$$$$$$$$',
      img: 'http://www.wikimedia.com'
    }

    establishmentsDb.editEstablishment(establishment.id, newEstablishment)
    assert.deepEqual(establishmentsDb.getEstablishment(establishment.id), newEstablishment)
  })

  it('Test: Wildcard Search Establishment', function () {
    establishmentsDb.purgeDb()
    
    const establishment = {
      id: 'kakk',
      name: 'mcdonalds',
      alias: 'borgar',
      phone: '+11923139831923',
      display_phone: '(858) 129-19921455',
      review_count: 0,
      rating: 5,
      address1: 'cool st.',
      address2: '',
      address3: '',
      city: 'san diego',
      zip_code: '911111111',
      country: 'US',
      state: 'CA',
      price: '$',
      img: 'http://www.wikipedia.com'
    }

    establishmentsDb.addEstablishment(establishment)

    const establishment2 = {
      id: 'kakk2',
      name: 'mcdonalds1',
      alias: 'borgar2',
      phone: '+11923139831923',
      display_phone: '(858) 129-19921455',
      review_count: 0,
      rating: 5,
      address1: 'cool st.',
      address2: '',
      address3: '',
      city: 'san diego',
      zip_code: '911111111',
      country: 'US',
      state: 'CA',
      price: '$',
      img: 'http://www.wikipedia.com'
    }

    establishmentsDb.addEstablishment(establishment2)

    const establishment3 = {
      id: 'kakk3',
      name: 'mcdon',
      alias: 'borgar',
      phone: '+11923139831923',
      display_phone: '(858) 129-19921455',
      review_count: 0,
      rating: 5,
      address1: 'cool st.',
      address2: '',
      address3: '',
      city: 'san diego',
      zip_code: '911111111',
      country: 'US',
      state: 'CA',
      price: '$',
      img: 'http://www.wikipedia.com'
    }

    establishmentsDb.addEstablishment(establishment3)

    let result = [establishment3, establishment, establishment2]
    let result2 = [establishment, establishment2]
    let result3 = [establishment2]

    assert.deepEqual(establishmentsDb.searchEstablishment('mc'), result)
    assert.deepEqual(establishmentsDb.searchEstablishment('mcdon'), result)
    assert.deepEqual(establishmentsDb.searchEstablishment('mcdonal'), result2)
    assert.deepEqual(establishmentsDb.searchEstablishment('mcdonalds'), result2)
    assert.deepEqual(establishmentsDb.searchEstablishment('mcdonalds1'), result3)
  })
})
