/**
 * @fileoverview tags_database
 * @package better-sqlite3, fs
 */

const Database = require('better-sqlite3')
const fs = require('fs')
const config = require('../../config.json')

/** A class that manages the tags database table. */
class TagsDatabase {
  constructor (database) {
    if (database === undefined) {
      this.db = new Database(config.db)
    } else {
      this.db = database
    }
    this.createTable()
  }

  createTable () {
    const stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS tags ' +
            '(tag_id INTEGER PRIMARY KEY AUTOINCREMENT, tag_name TEXT, tag_desc TEXT, tag_img TEXT)')
    stmt.run()
  }

  /**
     * Adds a new drink to the database
     * @param {String} name the new tag name
     * @param {String=} description an optional description
     * @returns {Integer} Id of the insert, null if none
     */
  addTag (name, desc = '', img = '') {
    if (!fs.existsSync(img)) {
      img = ''
    }

    const stmt = this.db.prepare('INSERT INTO tags (tag_name, tag_desc, tag_img) VALUES (?, ?, ?)')
    const query = stmt.run(name, desc, img)

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
   * @param {String=} name is the new name of the tag (undefined if none)
   * @param {String=} desc is the new description of the tag (undefined if none)
   * @returns {boolean} true if successful, false if not
   */
  editTag (id, name, desc) {
    let stmtString = 'UPDATE tags SET '
    let parameters = []

    if (name !== undefined) {
      stmtString += `tag_name = ?,`
      parameters.push(name) 
    }

    if (desc !== undefined) {
      stmtString += `tag_desc = ?,`
      parameters.push(desc) 
    }

    // Remove last comma
    stmtString = stmtString.substring(0, stmtString.length - 1)
    stmtString += ' WHERE tag_id = ?'
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

  /**
   * Add/Replace an image source to a drink
   * @param {Integer} id the drink id to search for
   * @param {String=} img is the new source of the image for the drink
   * @returns {boolean} true if successful, false if not
   */
  addImage (id, img) {
    const stmt = this.db.prepare('UPDATE tags SET tag_img = ? WHERE tag_id = ?')
    const query = stmt.run(img, id)

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
    return JSON.stringify(query)
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
