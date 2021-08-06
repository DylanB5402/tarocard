/**
 * @fileoverview drinks_database
 * @package better-sqlite3
 */

const Database = require('better-sqlite3')
const establishmentsDatabase = require('./establishments_database')
const fs = require('fs')
const config = require('../../config.json')

/** A class that manages the drinks database table. */
class DrinksDatabase {
  constructor (database) {
    if (database === undefined) {
      this.db = new Database(config.db)
    } else {
      this.db = database
    }
    this.createTable()
  }

  createTable () {
    const stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS drinks ' +
            '(drink_id INTEGER PRIMARY KEY AUTOINCREMENT, drink_name TEXT,' +
            'drink_desc TEXT, establishment_id INTEGER, drink_img TEXT)')
    stmt.run()
  }

  /**
     * Adds a new drink to the database
     * @param {String} name the new drink name
     * @param {String=} description an optional description
     * @param {Integer=} establishment an optional establishment
     * @param {String=} img an optional image source location
     * @returns {Integer} Id of the insert, null if none
     */
  addDrink (name, desc = '', establishment = -1, img = '') {
    if (!fs.existsSync(img)) {
      img = ''
    }

    if (establishment !== -1) {
      const establishmentsDb = new establishmentsDatabase.EstablishmentsDatabase(this.db)
      if (!establishmentsDb.isExist(establishment)) {
        establishment = -1
      }
    }

    const stmt = this.db.prepare('INSERT INTO drinks (drink_name, drink_desc, establishment_id, drink_img)' +
      'VALUES (?, ?, ?, ?)')
    const query = stmt.run(name, desc, establishment, img)

    if (query.changes === 1) {
      return query.lastInsertRowid
    } else {
      return null
    }
  }

  /**
     * Checks if a drink already exists in the database
     * @param {Integer} id the drink id to search for
     * @returns {boolean} true if in the database, false if not
     */
  isExist (id) {
    const stmt = this.db.prepare('SELECT * FROM drinks WHERE drink_id = ?')
    const query = stmt.all(id)
    return query.length > 0
  }

  /**
     * Gets a drink
     * @param {Integer} id the drink id to search for
     * @returns {Object} drink information
     */
  getDrink (id) {
    const stmt = this.db.prepare('SELECT * FROM drinks WHERE drink_id = ?')
    const query = stmt.get(id)
    return query
  }

  /**
   * Edit a drink
   * @param {Integer} id the drink id to search for
   * @param {String=} name is the new name of the drink (undefined if none)
   * @param {String=} desc is the new description of the drink (undefined if none)
   * @param {Integer=} establishment is the new establishment of the drink (undefined if none)
   * @returns {boolean} true if successful, false if not
   */
  editDrink (id, name, desc, establishment) {
    let edited = false
    let stmtString = 'UPDATE drinks SET '

    if (name !== undefined) {
      edited = true
      stmtString += `drink_name = '${name}',`
    }

    if (desc !== undefined) {
      edited = true
      stmtString += `drink_desc = '${desc}',`
    }

    if (establishment !== undefined) {
      const establishmentsDb = new establishmentsDatabase.EstablishmentsDatabase(this.db)
      if (establishmentsDb.isExist(establishment)) {
        edited = true
        stmtString += `establishment_id = '${establishment}',`
      }
    }

    // Remove last comma
    stmtString = stmtString.substring(0, stmtString.length - 1)
    stmtString += ' WHERE drink_id = ?'

    if (!edited) {
      return false
    }

    const stmt = this.db.prepare(stmtString)
    const query = stmt.run(id)

    if (query.changes === 1) {
      return true
    } else {
      return false
    }
  }

  /**
   * Add/Replace an image source to a drink
   * @param {Integer} id the drink id to search for
   * @param {String=} img is the new source of the image for the drink
   * @returns {boolean} true if successful, false if not
   */
  addImage (id, img) {
    const stmt = this.db.prepare('UPDATE drinks SET drink_img = ? WHERE drink_id = ?')
    const query = stmt.run(img, id)

    if (query.changes === 1) {
      return true
    } else {
      return false
    }
  }

  toString () {
    const stmt = this.db.prepare('SELECT * FROM drinks')
    const query = stmt.all()
    console.log(query)
    return JSON.stringify(query)
  }

  purgeDb () {
    const stmt = this.db.prepare('DELETE FROM drinks')
    stmt.run()
  }

  resetDb () {
    const stmt = this.db.prepare('DROP TABLE drinks')
    stmt.run()
    this.createTable()
  }
}

module.exports = { DrinksDatabase }
