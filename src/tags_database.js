/**
 * @fileoverview tags_database
 * @package better-sqlite3
 */

// const Database = require('better-sqlite3')

/** A class that manages the tags database table. */
class TagsDatabase {
  constructor (database) {
    this.db = database
    this.createTable()
  }

  createTable () {
    let stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS tags ' +
            '(tag_id INTEGER PRIMARY KEY AUTOINCREMENT, tag_name TEXT, tag_desc TEXT)')
    let query = stmt.run()
  }

  /**
     * Adds a new drink to the database
     * @param {String} name the new tag name
     * @param {String=} description an optional description
     * @returns {Integer} Id of the insert, null if none
     */
  addTag (name, desc = '') {
    const stmt = this.db.prepare('INSERT INTO tags (tag_name, tag_desc) ' +
            `VALUES ('${name}', '${desc}')`)
    const query = stmt.run()

    if (query.changes === 1) {
      return query.lastInsertRowid;
    } else {
      return null;
    }
  }

  /**
     * Checks if a tag already exists in the database
     * @param {Integer} id the tag id to search for
     * @returns {boolean} true if in the database, false if not
     */
  isExist (id) {
    const stmt = this.db.prepare(`SELECT * FROM tags WHERE tag_id = '${id}'`)
    const query = stmt.all()
    return query.length > 0
  }

  /**
     * Gets a tag
     * @param {Integer} id the tag id to search for
     * @returns {Object} drink information
     */
  getTag (id) {
    const stmt = this.db.prepare(`SELECT * FROM tags WHERE tag_id = '${id}'`)
    const query = stmt.get()
    return query
  }

  toString () {
    const stmt = this.db.prepare('SELECT * FROM tags')
    const query = stmt.all()
    console.log(query)
    return query.toString()
  }

  purgeDb() {
    const stmt = this.db.prepare(`DELETE FROM tags`)
    const query = stmt.run()
  }
}

module.exports = { TagsDatabase }
