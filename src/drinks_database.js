/**
 * @fileoverview drinks_database
 * @package better-sqlite3
 */

// const Database = require('better-sqlite3')

/** A class that manages the drinks database table. */
class DrinksDatabase {
  constructor (database) {
    this.db = database
    this.createTable()
  }

  createTable () {
    const stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS drinks ' +
            '(drink_id INTEGER PRIMARY KEY AUTOINCREMENT, drink_name TEXT, drink_desc TEXT)')
    stmt.run()
  }

  /**
     * Adds a new drink to the database
     * @param {String} name the new drink name
     * @param {String=} description an optional description
     * @returns {Integer} Id of the insert, null if none
     */
  addDrink (name, desc = '') {
    const stmt = this.db.prepare('INSERT INTO drinks (drink_name, drink_desc) VALUES (?, ?)')
    const query = stmt.run(name, desc)

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
   * @param {String=} name is the new name of the drink (null if none)
   * @param {String=} desc is the new description of the drink (null if none)
   * @returns {boolean} true if successful, false if not
   */
  editDrink (id, name = null, desc = null) {
    let stmt = null
    let query = null

    if (name !== null && desc !== null) {
      stmt = this.db.prepare('UPDATE drinks SET drink_name = ?, drink_desc = ? WHERE drink_id = ?')
      query = stmt.run(name, desc, id)
    } else if (name !== null) {
      stmt = this.db.prepare('UPDATE drinks SET drink_name = ? WHERE drink_id = ?')
      query = stmt.run(name, id)
    } else if (desc !== null) {
      stmt = this.db.prepare('UPDATE drinks SET drink_desc = ? WHERE drink_id = ?')
      query = stmt.run(desc, id)
    } else {
      return false
    }

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
    return query.toString()
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
