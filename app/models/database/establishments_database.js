/**
 * @fileoverview establishments_database
 * @package better-sqlite3, fs
 */

const Database = require('better-sqlite3')
const fs = require('fs')
const config = require('../../config.json')

/** A class that manages the drinks database table. */
class EstablishmentsDatabase {
  constructor (database) {
    if (database === undefined) {
      this.db = new Database(config.db)
    } else {
      this.db = database
    }
    this.createTable()
  }

  createTable () {
    const stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS establishments ' +
             '(id TEXT PRIMARY KEY, name TEXT, alias TEXT,' +
             'phone TEXT, display_phone TEXT,' +
             'review_count INTEGER, rating INTEGER,' +
             'address1 TEXT, address2 TEXT, address3 TEXT,' +
             'city TEXT, zip_code TEXT, country TEXT, state TEXT,' +
             'price TEXT, img TEXT)')
    stmt.run()
  }

  /**
      * Adds a new establishment to the database
      * @param {Object} establishment is an object containing values that should be edited
      * @param {String} establishment.id the establishment id to set
      * @param {String} establishment.name the new establishment name
      * @param {String=} establishment.alias an optional alias
      *
      * @param {String=} establishment.phone an optional phone number
      * @param {String=} establishment.display_phone an optional phone number formatted
      *
      * @param {Integer=} establishment.review_count an optional number of reviews
      * @param {Integer=} establishment.rating an optional rating score (out of 5)
      *
      * @param {String=} establishment.address1 an optional address
      * @param {String=} establishment.address2 an optional address
      * @param {String=} establishment.address3 an optional address
      * @param {String=} establishment.city an optional city
      * @param {String=} establishment.zip_code an optional zip code
      * @param {String=} establishment.country an optional country
      * @param {String=} establishment.state an optional state
      *
      * @param {String=} establishment.price an optional visual indicator of how expensive
      *
      * @param {String=} establishment.img an optional image source
      * @returns {Boolean} true if successful, false if not
      */
  addEstablishment (establishment) {
    if (establishment.id === undefined) return false
    if (establishment.name === undefined) return false
    if (establishment.alias === undefined) establishment.alias = ''

    if (establishment.phone === undefined) establishment.phone = ''
    if (establishment.display_phone === undefined) establishment.displayPhone = ''

    if (establishment.review_count === undefined) establishment.reviewCount = 0
    if (establishment.rating === undefined) establishment.rating = 0

    if (establishment.address1 === undefined) establishment.address1 = ''
    if (establishment.address2 === undefined) establishment.address2 = ''
    if (establishment.address3 === undefined) establishment.address3 = ''
    if (establishment.city === undefined) establishment.city = ''
    if (establishment.zip_code === undefined) establishment.zipCode = ''
    if (establishment.country === undefined) establishment.country = ''
    if (establishment.state === undefined) establishment.state = ''

    if (establishment.price === undefined) establishment.price = ''
    if (establishment.img === undefined) establishment.img = ''

    if (!this.isExist(establishment.id)) {
      const stmt = this.db.prepare('INSERT INTO establishments' +
              '(id, name, alias,' +
              'phone, display_phone,' +
              'review_count, rating,' +
              'address1, address2, address3,' +
              'city, zip_code, country, state,' +
              'price, img)' +
              'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      const query = stmt.run(establishment.id, establishment.name, establishment.alias,
        establishment.phone, establishment.display_phone,
        establishment.review_count, establishment.rating,
        establishment.address1, establishment.address2, establishment.address3,
        establishment.city, establishment.zip_code, establishment.country, establishment.state,
        establishment.price, establishment.img)

      if (query.changes === 1) {
        return true
      } else {
        return false
      }
    }
    return false
  }

  /**
      * Checks if a establishments already exists in the database
      * @param {String} id the establishment id to search for
      * @returns {boolean} true if in the database, false if not
      */
  isExist (id) {
    const stmt = this.db.prepare('SELECT * FROM establishments WHERE id = ?')
    const query = stmt.all(id)
    return query.length > 0
  }

  /**
      * Gets an establishment
      * @param {Integer} id the establishments id to search for
      * @returns {Object} establishments information
      */
  getEstablishment (id) {
    const stmt = this.db.prepare('SELECT * FROM establishments WHERE id = ?')
    const query = stmt.get(id)
    return query
  }

  /**
      * Gets an establishment
      * @param {String} search the search term to look for (autocomplete)
      * @returns {Array} establishments object information array
      */
  searchEstablishment (search) {
    const stmt = this.db.prepare('SELECT * FROM establishments WHERE name LIKE ? ORDER BY name ASC')
    const query = stmt.all(`${search}%`)
    return query
  }

  /**
   * Edit a establishment
   * @param {Integer} id the establishment id to search for
   * @param {Object} establishment is an object containing values that should be edited
   *
    * @param {String=} establishment.name is the new name of the establishment (undefined if none)
    * @param {String=} establishment.alias is the new alias of the establishment (undefined if none)
    *
    * @param {String=} establishment.phone is the new phone of the establishment (undefined if none)
    * @param {String=} establishment.display_phone is the new displayed phone of the establishment (undefined if none)
    *
    * @param {Integer=} establishment.review_count is the new review count of the establishment (undefined if none)
    * @param {Integer=} establishment.rating is the new rating score (out of 5) of the establishment (undefined if none)
    *
    * @param {String=} establishment.address1 is the new address1 of the establishment (undefined if none)
    * @param {String=} establishment.address2 is the new address2 of the establishment (undefined if none)
    * @param {String=} establishment.address3 is the new address3 of the establishment (undefined if none)
    * @param {String=} establishment.city is the new city of the establishment (undefined if none)
    * @param {String=} establishment.zip_code is the new zipCode of the establishment (undefined if none)
    * @param {String=} establishment.country is the new country of the establishment (undefined if none)
    * @param {String=} establishment.state is the new state of the establishment (undefined if none)
    *
    * @param {String=} establishment.price is the new price indicator of the establishment (undefined if none)
    *
    * @param {String=} establishment.img is the new image of the establishment (undefined if none)
   */
  editEstablishment (id, establishment) {
    let stmtString = 'UPDATE establishments SET '
    const parameters = []

    if (establishment.name !== undefined) {
      stmtString += 'name = ?,'
      parameters.push(establishment.name)
    }
    if (establishment.alias !== undefined) {
      stmtString += 'alias = ?,'
      parameters.push(establishment.alias)
    }

    if (establishment.phone !== undefined) {
      stmtString += 'phone = ?,'
      parameters.push(establishment.phone)
    }
    if (establishment.display_phone !== undefined) {
      stmtString += 'display_phone = ?,'
      parameters.push(establishment.display_phone)
    }

    if (establishment.review_count !== undefined) {
      stmtString += 'review_count = ?,'
      parameters.push(establishment.review_count)
    }
    if (establishment.rating !== undefined) {
      stmtString += 'rating = ?,'
      parameters.push(establishment.rating)
    }

    if (establishment.address1 !== undefined) {
      stmtString += 'address1 = ?,'
      parameters.push(establishment.address1)
    }
    if (establishment.address2 !== undefined) {
      stmtString += 'address2 = ?,'
      parameters.push(establishment.address2)
    }
    if (establishment.address3 !== undefined) {
      stmtString += 'address3 = ?,'
      parameters.push(establishment.address3)
    }
    if (establishment.city !== undefined) {
      stmtString += 'city = ?,'
      parameters.push(establishment.city)
    }
    if (establishment.zip_code !== undefined) {
      stmtString += 'zip_code = ?,'
      parameters.push(establishment.zip_code)
    }
    if (establishment.country !== undefined) {
      stmtString += 'country = ?,'
      parameters.push(establishment.country)
    }
    if (establishment.state !== undefined) {
      stmtString += 'state = ?,'
      parameters.push(establishment.state)
    }

    if (establishment.price !== undefined) {
      stmtString += 'price = ?,'
      parameters.push(establishment.price)
    }
    if (establishment.img !== undefined) {
      stmtString += 'img = ?,'
      parameters.push(establishment.img)
    }

    // Remove last comma
    stmtString = stmtString.substring(0, stmtString.length - 1)
    stmtString += ' WHERE id = ?'
    parameters.push(id)

    if (parameters.length === 1) {
      return false
    }

    const stmt = this.db.prepare(stmtString)
    const query = stmt.run(...parameters)

    if (query.changes === 1) {
      return true
    } else {
      return false
    }
  }

  toString () {
    const stmt = this.db.prepare('SELECT * FROM establishments')
    const query = stmt.all()
    console.log(query)
    return JSON.stringify(query)
  }

  purgeDb () {
    const stmt = this.db.prepare('DELETE FROM establishments')
    stmt.run()
  }

  resetDb () {
    const stmt = this.db.prepare('DROP TABLE establishments')
    stmt.run()
    this.createTable()
  }
}

module.exports = { EstablishmentsDatabase }
