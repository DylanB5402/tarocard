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
             '(establishment_id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
             'establishment_name TEXT, establishment_desc TEXT, establishment_img TEXT)')
    stmt.run()
  }

  /**
      * Adds a new establishment to the database
      * @param {String} name the new establishment name
      * @param {String=} description an optional description
      * @param {String=} img an optional image source
      * @returns {Integer} Id of the insert, null if none
      */
  addEstablishment (name, desc = '', img = '') {
    if (!fs.existsSync(img)) {
      img = ''
    }

    const stmt = this.db.prepare('INSERT INTO establishments (establishment_name, establishment_desc, establishment_img)' +
            'VALUES (?, ?, ?)')
    const query = stmt.run(name, desc, img)

    if (query.changes === 1) {
      return query.lastInsertRowid
    } else {
      return null
    }
  }

  /**
      * Checks if a establishments already exists in the database
      * @param {Integer} id the establishment id to search for
      * @returns {boolean} true if in the database, false if not
      */
  isExist (id) {
    const stmt = this.db.prepare('SELECT * FROM establishments WHERE establishment_id = ?')
    const query = stmt.all(id)
    return query.length > 0
  }

  /**
      * Gets an establishment
      * @param {Integer} id the establishments id to search for
      * @returns {Object} establishments information
      */
  getEstablishment (id) {
    const stmt = this.db.prepare('SELECT * FROM establishments WHERE establishment_id = ?')
    const query = stmt.get(id)
    return query
  }

  /**
   * Edit a establishment
   * @param {Integer} id the establishment id to search for
   * @param {String=} name is the new name of the establishment (undefined if none)
   * @param {String=} desc is the new description of the establishment (undefined if none)
   * @returns {boolean} true if successful, false if not
   */
  editEstablishment (id, name, desc) {
    let edited = false
    let stmtString = 'UPDATE establishments SET '

    if (name !== undefined) {
      edited = true
      stmtString += `establishment_name = '${name}',`
    }

    if (desc !== undefined) {
      edited = true
      stmtString += `establishment_desc = '${desc}',`
    }

    // Remove last comma
    stmtString = stmtString.substring(0, stmtString.length - 1)
    stmtString += ' WHERE establishment_id = ?'

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
   * Add/Replace an image source to an establishment
   * @param {Integer} id the establishment id to search for
   * @param {String=} img is the new source of the image for the establishment
   * @returns {boolean} true if successful, false if not
   */
  addImage (id, img) {
    if (!fs.existsSync(img)) {
      return false
    }

    const stmt = this.db.prepare('UPDATE establishments SET establishment_img = ? WHERE establishment_id = ?')
    const query = stmt.run(img, id)

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
    return query.toString()
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
