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
    const stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS tags ' +
            '(tag_id INTEGER PRIMARY KEY AUTOINCREMENT, tag_name TEXT, tag_desc TEXT)')
    stmt.run()
  }

  /**
     * Adds a new drink to the database
     * @param {String} name the new tag name
     * @param {String=} description an optional description
     * @returns {Integer} Id of the insert, null if none
     */
  addTag (name, desc = '') {
    const stmt = this.db.prepare('INSERT INTO tags (tag_name, tag_desc) VALUES (?, ?)')
    const query = stmt.run(name, desc)

    if (query.changes === 1) {
      return query.lastInsertRowid
    } else {
      return null
    }
  }

  /**
     * Checks if a tag already exists in the database
     * @param {Integer} id the tag id to search for
     * @returns {boolean} true if in the database, false if not
     */
  isExist (id) {
    const stmt = this.db.prepare('SELECT * FROM tags WHERE tag_id = ?')
    const query = stmt.all(id)
    return query.length > 0
  }

  /**
     * Gets a tag
     * @param {Integer} id the tag id to search for
     * @returns {Object} drink information
     */
  getTag (id) {
    const stmt = this.db.prepare('SELECT * FROM tags WHERE tag_id = ?')
    const query = stmt.get(id)
    return query
  }

  /**
   * Edit a tag
   * @param {Integer} id the tag id to search for
   * @param {String=} name is the new name of the tag (null if none)
   * @param {String=} desc is the new description of the tag (null if none)
   * @returns {boolean} true if successful, false if not
   */
  editTag (id, name = null, desc = null) {
    let stmt = null
    let query = null

    if (name !== null && desc !== null) {
      stmt = this.db.prepare('UPDATE tags SET tag_name = ?, tag_desc = ? WHERE tag_id = ?')
      query = stmt.run(name, desc, id)
    } else if (name !== null) {
      stmt = this.db.prepare('UPDATE tags SET tag_name = ? WHERE tag_id = ?')
      query = stmt.run(name, id)
    } else if (desc !== null) {
      stmt = this.db.prepare('UPDATE tags SET tag_desc = ? WHERE tag_id = ?')
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
    const stmt = this.db.prepare('SELECT * FROM tags')
    const query = stmt.all()
    console.log(query)
    return query.toString()
  }

  purgeDb () {
    const stmt = this.db.prepare('DELETE FROM tags')
    stmt.run()
  }

  resetDb () {
    const stmt = this.db.prepare('DROP TABLE tags')
    stmt.run()
    this.createTable()
  }
}

module.exports = { TagsDatabase }
