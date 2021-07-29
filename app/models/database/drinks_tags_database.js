/**
 * @fileoverview drinks_tags_database
 * @package better-sqlite3
 */

const Database = require('better-sqlite3')
const drinksDatabase = require('./drinks_database')
const tagsDatabase = require('./tags_database')
const config = require('../../config.json');

/** A class that manages the drinks tags database relations table. */
class DrinksTagsDatabase {
  constructor (database) {
    if (database === undefined) {
      this.db = new Database(config.db)
    } else {
      this.db = database
    }
    this.createTable()
  }

  createTable () {
    const stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS drinks_tags ' +
            '(drink_id INTEGER, tag_id INTEGER)')
    stmt.run()
  }

  /**
     * Adds a new drink-tag relation to the database
     * @param {Integer} drinkId the drink id
     * @param {Integer} tagId the tag id
     * @returns {boolean} false if failed, true is succeed
     */
  addDrinkTag (drinkId, tagId) {
    const drinkDb = new drinksDatabase.DrinksDatabase(this.db)
    const tagsDb = new tagsDatabase.TagsDatabase(this.db)

    if (!drinkDb.isExist(drinkId) || !tagsDb.isExist(tagId) || this.isExist(drinkId, tagId)) {
      return false
    } else {
      const stmt = this.db.prepare('INSERT INTO drinks_tags (drink_id, tag_id) VALUES (?, ?)')
      const query = stmt.run(drinkId, tagId)

      if (query.changes === 1) {
        return true
      } else {
        return false
      }
    }
  }

  /**
     * Removes an existing drink-tag relation in the database
     * @param {Integer} drinkId the drink id
     * @param {Integer} tagId the tag id
     * @returns {boolean} false if failed, true is succeed
     */
  removeDrinkTag (drinkId, tagId) {
    const stmt = this.db.prepare('DELETE FROM drinks_tags WHERE drink_id = ? AND tag_id = ?')
    const query = stmt.run(drinkId, tagId)

    if (query.changes > 0) {
      return true
    } else {
      return false
    }
  }

  /**
     * Checks if a drink-tag relation already exists in the database
     * @param {Integer} drinkId the drink id to search for
     * @param {Integer} tagId the tag id to search for
     * @returns {boolean} true if in the database, false if not
     */
  isExist (drinkId, tagId) {
    const stmt = this.db.prepare('SELECT * FROM drinks_tags WHERE drink_id = ? AND tag_id = ?')
    const query = stmt.all(drinkId, tagId)
    return query.length > 0
  }

  /**
   * Obtains all the tags associated with the drink in the database
   * @param {Integer} id the drink id to search for
   * @returns {Array<row>} array of row objects containing the result from the query
   */
  getTagsFromDrink (id) {
    const stmt = this.db.prepare('SELECT tags.tag_id AS id, tags.tag_name AS name, tags.tag_desc AS desc ' +
            'FROM drinks_tags ' +
            'INNER JOIN drinks ON drinks_tags.drink_id = drinks.drink_id ' +
            'INNER JOIN tags ON drinks_tags.tag_id = tags.tag_id ' +
            'WHERE drinks_tags.drink_id = ?')
    const query = stmt.all(id)
    return query
  }

  /**
   * Obtains all the drinks associated with the tag(s) in the database
   * @param {Array<Integer>} ids the tag id(s) to search for
   * @returns {Array<row>} array of row objects containing the result from the query
   */
  getDrinksFromTags (ids) {
    let stmtString = 'SELECT drinks.drink_id AS id, drinks.drink_name AS name, drinks.drink_desc AS desc ' +
            'FROM drinks_tags ' +
            'INNER JOIN drinks ON drinks_tags.drink_id = drinks.drink_id ' +
            'INNER JOIN tags ON drinks_tags.tag_id = tags.tag_id ' +
            'GROUP BY drinks_tags.drink_id ' +
            'HAVING '

    for (let i = 0; i < ids.length; i++) {
      if (i !== ids.length - 1) {
        stmtString += `SUM(tags.tag_id = '${ids[i]}')` + ' AND '
      } else {
        stmtString += `SUM(tags.tag_id = '${ids[i]}')`
      }
    }

    const stmt = this.db.prepare(stmtString)
    const query = stmt.all()
    return query
  }

  toString () {
    const stmt = this.db.prepare('SELECT * FROM drinks_tags')
    const query = stmt.all()
    console.log(query)
    return query.toString()
  }

  purgeDb () {
    const stmt = this.db.prepare('DELETE FROM drinks_tags')
    stmt.run()
  }

  resetDb () {
    const stmt = this.db.prepare('DROP TABLE drinks_tags')
    stmt.run()
    this.createTable()
  }
}

module.exports = { DrinksTagsDatabase }
