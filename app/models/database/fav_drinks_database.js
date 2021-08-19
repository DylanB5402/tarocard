/*
File: fav_drinks_database.js
Author: Alex Nguyen
Purpose: This is a separate class/file to create a database for favorite drinks
  and all its properties
Credits: Dylan Barva & Peter Liu for skeleton code
*/

/**
 * @fileoverview fav_drinks_database
 * @package better-sqlite3
 */

const Database = require('better-sqlite3')
const drinksDatabase = require('./drinks_database')
const userDatabase = require('./user_database')
const config = require('../../config.json')

// Constant Static Variables //
const NUM_STARRED_LIM = 3

class FavDrinksDatabase {
  constructor (database) {
    if (database === undefined) {
      this.db = new Database(config.db)
    } else {
      this.db = database
    }
    this.createFavDrinkTable()
  }

  /**
   * Creates a new drink database if DNE. Otherwise, does not create table.
   * Table has 4 columns: User Id, Drink ID, Favorite (bool), and date
   * @param none
   * @return none
   */
  createFavDrinkTable () {
    const stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS fav_drinks' +
      '(uid INTEGER, drink_id INTEGER, fav BOOL, date DATETIME DEFAULT CURRENT_TIMESTAMP);')
    stmt.run()
  }

  /**
   * get all favorited drinks
   * @param {Integer} uid
   * @returns {Array[Object]} an array of drink objects
   */
  getAllDrinks (uid) {
    const userDB = new userDatabase.UserDatabase()
    const drinksDB = new drinksDatabase.DrinksDatabase() // Using methods from drinks_database
    // SQL Statement:
    //   selects all fields of drinks from the joining of fav_drinks and drinks
    //     tables to get all drinks that correspond to a user
    if (userDB.getUserByUID(uid)) {
      const stmt = this.db.prepare('SELECT f.fav, f.date, d.* FROM fav_drinks f INNER JOIN drinks d USING(drink_id) WHERE uid = ? ' +
            'ORDER BY fav DESC, drink_name COLLATE NOCASE ASC')
      const query = stmt.all(uid) // an array of row (drink) objects

      return query // return the filled array of drink objects
    }
    return null
  }

  /**
   * Checks if a drink already favorited for a user
   * @param {Integer} uid user id
   * @param {Integer} drinkId id of drink
   * @return {Boolean} false if DNE, true if it does
   */
  isExist (uid, drinkId) {
    const stmt = this.db.prepare('SELECT COUNT(*) count FROM fav_drinks WHERE ' +
            'drink_id = ? AND uid = ?')
    const query = stmt.get(drinkId, uid) // get runs the statement
    const numEntries = query.count
    return numEntries > 0
  }

  /**
   * Checks if a drink already favorited for a user
   * @param {Integer} uid user id
   * @param {Integer} drinkId id of drink
   * @return {Boolean} false if DNE, true if it does
   */
  isStar (uid, drinkId) {
    const stmt = this.db.prepare('SELECT COUNT(*) count FROM fav_drinks WHERE ' +
            'drink_id = ? AND uid = ? AND fav = TRUE')
    const query = stmt.get(drinkId, uid) // get runs the statement
    const numStar = query.count
    return numStar > 0
  }

  /**
   * get all favorited drinks
   * @param {Integer} uid
   * @returns {Array[Object]} an array of drink objects
   */
  getAllDrinks (uid) {
    // SQL Statement:
    //   selects all fields of drinks from the joining of fav_drinks and drinks
    //     tables to get all drinks that correspond to a user
    const stmt = this.db.prepare('SELECT f.fav, f.date, d.* FROM fav_drinks f ' +
            'INNER JOIN drinks d USING(drink_id) WHERE uid = ? ' +
            'ORDER BY fav DESC, drink_name COLLATE NOCASE ASC')
    const query = stmt.all(uid) // an array of row (drink) objects
    return query // return the filled array of drink objects
  }

  /**
   * Favorites a drink for a user
   * @param {Integer} uid
   * @param {Integer} drinkId
   * @returns {Boolean} true if successful, false if failed
   */
  addFavDrink (uid, drinkId) {
    const userDB = new userDatabase.UserDatabase()
    const drinksDB = new drinksDatabase.DrinksDatabase()

    // Check if user id and drink id exists in other DBs in the first place
    if (!userDB.getUserByUID(uid) && !drinksDB.isExist(drinkId)) {
      return false
    } else {
      // Check if the user-drink pair exists in fav_drinks_database already
      // Duplicate Check
      if (this.isExist(uid, drinkId)) {
        console.log('This drink is already favorited!')
        return false
      }
      const stmt = this.db.prepare('INSERT INTO fav_drinks (uid, drink_id, fav, date)' +
              'VALUES (?, ?, 0, date(\'now\'))')
      const query = stmt.run(uid, drinkId)

      if (query.changes === 1) {
        return true
      } else {
        return false
      }
    }
  }

  /**
   * unfavorites a drink for a user
   * @param {Integer} uid
   * @param {Integer} drinkId
   * @returns {Boolean} true if successful, false if failed
   */
  removeFavDrink (uid, drinkId) {
    const userDB = new userDatabase.UserDatabase()
    const drinksDB = new drinksDatabase.DrinksDatabase()

    console.log('User exists? ' + userDB.getUserByUID(uid))
    console.log('Drink Exists? ' + drinksDB.isExist(drinkId))

    // Check to make params are valid/exists
    if (userDB.getUserByUID(uid) && drinksDB.isExist(drinkId)) {
      if (this.isExist(uid, drinkId)) {
        // Delete uid-drinkId pair from DB
        const stmt = this.db.prepare('DELETE FROM fav_drinks WHERE ' +
                'uid = ? AND drink_id = ?')
        const query = stmt.run(uid, drinkId)

        console.log('deleted a drink') // debug

        // Check to make sure changes are made to DB
        if (query.changes === 1) {
          return true
        }
      }

      return false
    } else {
      return false
    }
  }

  /**
   * Stars a drink for a user from the database using its user id and drink id
   * @param {Integer} uid
   * @param {Integer} drinkId
   * @returns {Boolean} true if successful, false otherwise
   */
  starDrink (uid, drinkId) {
    // Get number of starred drinks for check > 3
    const numStarStmt = this.db.prepare('SELECT COUNT(*) AS count ' +
            'FROM fav_drinks WHERE uid = ? AND fav = 1')
    const numStarred = numStarStmt.get(uid).count
    // Check if not starred yet and limit not exceeded
    if (!this.isStar(uid, drinkId) && numStarred < NUM_STARRED_LIM) {
      // Updates the DB
      const stmt = this.db.prepare('UPDATE fav_drinks SET fav = TRUE WHERE uid = ? ' +
      'AND drink_id = ?')
      const query = stmt.run(uid, drinkId) // run the statement; returns 'info' object

      // Checks if changes were made; changes are made upon successful boolean change
      if (query.changes > 0) {
        return true
      }
    }
    return false // return false since query.changes was not greater than 0 or
    //   drink is already starred
  }

  /**
   * Unfavorites a drink for a user from the database using its user id and drink id
   * @param {Integer} uid
   * @param {Integer} drinkId
   * @returns {Boolean} true if successful, false otherwise
   */
  unstarDrink (uid, drinkId) {
    // Check if starred
    if (this.isStar(uid, drinkId)) {
      const stmt = this.db.prepare('UPDATE fav_drinks SET fav = FALSE WHERE uid = ? ' +
              'AND drink_id = ?')
      const query = stmt.run(uid, drinkId)

      // Checks if changes were made; changes are made upon successful boolean change
      if (query.changes > 0) {
        return true
      }
    }
    return false // false if failed both if statements
  }

  /**
   * Sends a JSON of drinks that are related by friends of a user
   * @param {Integer} uid
   * @returns {Array[Object]} an array of drink objects
   */
  displayDrinksToHomePage (uid) {
    // SQL Statement:
    //   selects all fields of drinks, the drink_id and date from fav_drinks,
    //     and mainly status from friends joined by uids between fav_drinks and
    //     friends and drink_id between fav_drinks and drinks to return a query
    //     for outputting a table of all recent drinks made by friends of a user
    //     within the last month
    const stmt = this.db.prepare('SELECT fd.drink_id, fd.date, f.friend_uid, d.* ' +
            'FROM ((fav_drinks fd ' +
            'INNER JOIN friends f ON fd.uid = f.friend_uid) ' +
            'INNER JOIN drinks d USING(drink_id)) ' +
            "WHERE f.uid = ? AND status = 'friends' " +
            "AND date > DATE('now', '-30 days') " +
            'ORDER BY date COLLATE NOCASE DESC')
    const query = stmt.all(uid) // an array of row (drink) objects

    return query // return the filled array of drink objects
  }

  /**
   * Returns how many drinks cards a user has
   * @param {Integer} uid
   * @returns {Integer} number of drink cards a user has
   */
  numCards (uid) {
    const stmt = this.db.prepare('SELECT COUNT(*) AS count FROM fav_drinks WHERE uid = ?')
    const query = stmt.get(uid)
    if (query !== undefined) {
      return query.count
    } else {
      return 0
    }
  }

  toString () {
    const stmt = this.db.prepare('SELECT * FROM fav_drinks')
    const query = stmt.all()
    console.log(query)
    return query
  }

  purgeDb () {
    const stmt = this.db.prepare('DELETE FROM fav_drinks')
    const query = stmt.run()
  }
}

module.exports = { FavDrinksDatabase }
