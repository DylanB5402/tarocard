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
    const drinksDB = new drinksDatabase.DrinksDatabase() // Using methods from drinks_database
    let drinkArray = new Array() // array to be filled with drink objects

    // SQL Statement:
    //   selects all fields of drinks from the joining of fav_drinks and drinks 
    //     tables to get all drinks that correspond to a user
    const stmt = this.db.prepare('SELECT d.* FROM fav_drinks f INNER JOIN drinks d USING(drink_id) WHERE uid = ?')
    const query = stmt.all(uid) // an array of row (drink) objects

    // Iterate through the array of objects
    // `value` = drink object
    query.forEach( (value) => {

      // Function to be called on each element (object) in the array

      drinkArray.push(value) // Push the drink object into the array
    })
    return drinkArray // return the filled array of drink objects
  }


  // UNSURE TODO: display drinks and stuff prettily
  // /**
  //  * View a drink using the template from template_engine.js
  //  * @param {Integer} id
  //  * @param {Response} httpResponse
  //  */
  // viewDrink(id, httpResponse) {
  //   this.db.prepare(`SELECT * FROM fav_drinks WHERE id = ${id};`,(err, row) => {
  //     if (row != undefined) {
  //       var name = row['name'];
  //       var desc = row['desc'];
  //       var store = row['store'];
  //       httpResponse.send(this.temp_engine.getUser(id, name, desc, store));
  //     } else {
  //       httpResponse.send(`Drink with id ${id} not found`);
  //     }
  //   })
  // }

  /**
   * Checks if a drink already favorited for a user
   * @param {Integer} uid user id
   * @param {Integer} drinkId id of drink
   * @return {Boolean} false if DNE, true if it does
   */
  isExist (uid, drinkId) {
    const stmt = this.db.prepare(`SELECT COUNT(*) count FROM fav_drinks WHERE drink_id = '${drinkId}' ` +
            `AND uid = '${uid}'`)
    const query = stmt.get() // get runs the statement
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
    const stmt = this.db.prepare(`SELECT COUNT(*) count FROM fav_drinks WHERE drink_id = '${drinkId}' ` +
            `AND uid = '${uid}' AND fav = 1`)
    const query = stmt.get() // get runs the statement
    const numStar = query.count
    return numStar > 0
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
              `VALUES ('${uid}', '${drinkId}', 0, date('now'))`)
      const query = stmt.run()

      if (query.changes === 1) {
        return true
      } else {
        return false
      }
    }
  }

  // Need an edit drink method in drinks_database.js
  // Implementation is to modify the drink desc in database and to keep uid and
  // drinkId pair the same in fav_drinks_database.js

  /**
   * unfavorites a drink for a user
   * @param {Integer} uid
   * @param {Integer} drinkId
   * @returns {Boolean} true if successful, false if failed
   */
  removeFavDrink (uid, drinkId) {
    const userDB = new userDatabase.UserDatabase()
    const drinksDB = new drinksDatabase.DrinksDatabase()

    // Check to make params are valid/exists
    if (userDB.getUserByUID(uid) && drinksDB.isExist(drinkId)) {
      if (this.isExist(uid, drinkId)) {
        // Delete uid-drinkId pair from DB
        const stmt = this.db.prepare('DELETE FROM fav_drinks WHERE ' +
                `uid = '${uid}' AND drink_id = '${drinkId}'`)
        const query = stmt.run()

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
    // Check if not starred yet
    if (!this.isStar(uid, drinkId)) {
      // Updates the DB
      const stmt = this.db.prepare(`UPDATE fav_drinks SET fav = 1 WHERE uid = '${uid}' ` +
            `AND drink_id = '${drinkId}'`)
      const query = stmt.run() // run the statement; returns 'info' object

      // Checks if changes were made; changes are made upon successful boolean change
      if (query.changes > 0) {
        return true
      }
    }
    return false // return false since query.changes was not greater than 0 or
    // drink is already starred
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
      const stmt = this.db.prepare(`UPDATE fav_drinks SET fav = 0 WHERE uid = '${uid}' ` +
              `AND drink_id = '${drinkId}'`)
      const query = stmt.run()

      // Checks if changes were made; changes are made upon successful boolean change
      if (query.changes > 0) {
        return true
      }
    }
    return false // false if failed both if statements
  }

  toString () {
    const stmt = this.db.prepare('SELECT * FROM fav_drinks')
    const query = stmt.all()
    console.log(query)
    return query.toString()
  }

  purgeDb () {
    const stmt = this.db.prepare('DELETE FROM fav_drinks')
    const query = stmt.run()
  }
}

module.exports = { FavDrinksDatabase }
