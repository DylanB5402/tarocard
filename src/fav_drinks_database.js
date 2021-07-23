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

const drinksDatabase = require('./drinks_database')
const userDatabase = require('./user_database')

class FavDrinksDatabase {
  constructor (database) {
    this.db = database
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
      '(uid INTEGER UNIQUE, drink_id INTEGER UNIQUE, fav BOOL, date DATETIME);')
    stmt.run();
  }

  /**
   * get all favorited drinks
   * @param {Response} http_response
   */
  getAllDrinks (http_response) {
    let response_string = ''
    this.db.prepare('SELECT * FROM fav_drinks;', (err, rows) => {
      rows.forEach((row) => {
        response_string += '<p>' + JSON.stringify(row, null, 2) + '</p>'
      })
      http_response.send(response_string)
    })
  }

  /**
   * Get a specific drink by its id
   * @param {Integer} drinkId
   * @param {Response} http_response
   */
  getDrink (drinkId, http_response) {
    this.db.prepare(`SELECT * FROM fav_drinks WHERE drink_id = ${drinkId};`, (err, row) => {
      const response_string = JSON.stringify(row, null, 2)
      // console.log(response_string);
      if (response_string != undefined) {
        http_response.send(response_string)
      } else {
        http_response.send(`Drink with id ${id} not found`)
      }
    })
  }

  // /**
  //  * View a drink using the template from template_engine.js
  //  * @param {Integer} id
  //  * @param {Response} http_response
  //  */
  // viewDrink(id, http_response) {
  //   this.db.prepare(`SELECT * FROM fav_drinks WHERE id = ${id};`,(err, row) => {
  //     if (row != undefined) {
  //       var name = row['name'];
  //       var desc = row['desc'];
  //       var store = row['store'];
  //       http_response.send(this.temp_engine.getUser(id, name, desc, store));
  //     } else {
  //       http_response.send(`Drink with id ${id} not found`);
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
    const stmt = this.db.prepare(`SELECT * FROM fav_drinks WHERE drink_id = '${drinkId}' ` +
            `AND uid = '${uid}'`)
    const query = stmt.all() // all() returns an array or rows
    return query.length > 0
  }

  /**
   * Favorites a drink for a user
   * @param {Integer} uid
   * @param {Integer} drinkId
   * @returns {Boolean} true if successful, false if failed
   */
  addFavDrink (uid, drinkId) {
    const userDB = new userDatabase.UserDatabase(this.db)
    const drinksDB = new drinksDatabase.DrinksDatabase(this.db)

    console.log(`This is the user id: ${uid}`);

    if (!userDB.isExist(uid) && !drinksDB.isExist(drinkId)) {
      return false
    } else {
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

  /**
   * unfavorites a drink for a user
   * @param {Integer} uid
   * @param {Integer} drinkId
   * @returns {Boolean} true if successful, false if failed
   */
   removeFavDrink (uid, drinkId) {
    const userDB = new userDatabase.UserDatabase(this.db)
    const drinksDB = new drinksDatabase.DrinksDatabase(this.db)

    // Check to make params are valid/exists
    if (!userDB.isExist(uid) || !drinksDB.isExist(drinkId)) {
      return false
    } else {
      const stmt = this.db.prepare('DELETE FROM fav_drinks WHERE ' + 
              `uid = '${uid}' AND drink_id = '${drinkId}'`)
      const query = stmt.run()

      if (query.changes === 1) {
        return true
      } else {
        return false
      }
    }
  }

  /**
   * Stars a drink for a user from the database using its user id and drink id
   * @param {Integer} uid
   * @param {Integer} id
   * @returns {Boolean} true if successful, false otherwise
   */
   starDrink (uid, drinkId) {
    const stmt = this.db.prepare(`UPDATE fav_drinks SET fav = 1 WHERE uid = '${uid}' ` +
            `AND drink_id = '${drinkId}'`)
    const query = stmt.run()

    // Checks if changes were made; changes are made upon successful boolean change
    if (query.changes > 0) {
      return true
    } else {
      return false
    }
  }

  /**
   * Unfavorites a drink for a user from the database using its user id and drink id
   * @param {Integer} uid
   * @param {Integer} id
   * @returns {Boolean} true if successful, false otherwise
   */
  unstarDrink (uid, drinkId) {
    const stmt = this.db.prepare(`UPDATE fav_drinks SET fav = 0 WHERE uid = '${uid}' ` +
            `AND drink_id = '${drinkId}'`)
    const query = stmt.run()

    // Checks if changes were made; changes are made upon successful boolean change
    if (query.changes > 0) {
      return true
    } else {
      return false
    }
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
