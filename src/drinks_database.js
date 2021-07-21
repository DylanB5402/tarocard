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
    let stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS drinks ' +
            '(drink_id INTEGER PRIMARY KEY AUTOINCREMENT, drink_name TEXT, drink_desc TEXT)')
    let query = stmt.run()
  }

  /**
     * Adds a new drink to the database
     * @param {String} name the new drink name
     * @param {String=} description an optional description
     * @returns {Integer} Id of the insert, null if none
     */
  addDrink (name, desc = '') {
    const stmt = this.db.prepare('INSERT INTO drinks (drink_name, drink_desc) ' +
            `VALUES ('${name}', '${desc}')`)
    const query = stmt.run()

    if (query.changes === 1) {
      return query.lastInsertRowid;
    } else {
      return null;
    }
  }

  /**
     * Checks if a drink already exists in the database
     * @param {Integer} id the drink id to search for
     * @returns {boolean} true if in the database, false if not
     */
  isExist (id) {
    const stmt = this.db.prepare(`SELECT * FROM drinks WHERE drink_id = '${id}'`)
    const query = stmt.all()
    return query.length > 0
  }

  /**
     * Gets a drink
     * @param {Integer} id the drink id to search for
     * @returns {Object} drink information
     */
  getDrink (id) {
    const stmt = this.db.prepare(`SELECT * FROM drinks WHERE drink_id = '${id}'`)
    const query = stmt.get()
    return query
  }

  toString () {
    const stmt = this.db.prepare('SELECT * FROM drinks')
    const query = stmt.all()
    console.log(query)
    return query.toString()
  }

  purgeDb() {
    const stmt = this.db.prepare(`DELETE FROM drinks`)
    const query = stmt.run()
  }
}

module.exports = { DrinksDatabase }
