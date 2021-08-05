/*
File: group_database.js
Author: Alex Nguyen
Purpose: This is a separate class/file to create a database for groups
  and all its properties
Credits: Dylan Barva & Peter Liu for skeleton code
*/

/**
 * @fileoverview groups_database
 * @package better-sqlite3
 */

 const Database = require('better-sqlite3')
 const drinksDatabase = require('./drinks_database')
 const userDatabase = require('./user_database')
 const config = require('../../config.json')
 
 class GroupDatabase {
   constructor (database) {
     if (database === undefined) {
       this.db = new Database(config.db)
     } else {
       this.db = database
     }
     this.createGroupTable()
   }
 
   /**
    * Creates a new drink database if DNE. Otherwise, does not create table.
    * Table has 4 columns: Group Id, User Id, Friend Id, Drink ID
    * Schema: multiple rows with the same group id designate a single group
    *         whenever a new GROUP is created, the group id is autoincremented
    *         whenever a new user-drink pair is added to the GROUP, then keep
    *         the same group id
    * @param none
    * @return none
    */
   createGroupTable () {
     const stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS groups' +
       '(group_id INTEGER AUTOINCREMENT, uid INTEGER, group_name TEXT,' +
       ' friend_uid INTEGER, friends_drink_id INTEGER);')
     stmt.run()
   }
 
/**
    * TODO:
    * get all favorited drinks
    * @param {Integer} uid
    * @returns {Array[Object]} an array of drink objects
    */
  getGroup (uid, groupId) {
    const drinksDB = new drinksDatabase.DrinksDatabase() // Using methods from drinks_database
    const drinkArray = new Array() // array to be filled with drink objects

    // SQL Statement:
    //   selects all fields of drinks from the joining of groups and drinks
    //     tables to get all drinks that correspond to a user
    const stmt = this.db.prepare('SELECT d.* FROM groups g INNER JOIN drinks d USING(drink_id) WHERE uid = ?')
    const query = stmt.all(uid) // an array of row (drink) objects

    // Iterate through the array of objects
    // `value` = drink object
    query.forEach((value) => {
      // Function to be called on each element (object) in the array

      drinkArray.push(value) // Push the drink object into the array
    })
    return drinkArray // return the filled array of drink objects
  }

  /**
  * TODO:
  * get all favorited drinks
  * @param {Integer} uid
  * @returns {Array[Object]} an array of drink objects
  */
  getAllGroups (uid) {
    const drinksDB = new drinksDatabase.DrinksDatabase() // Using methods from drinks_database
    const drinkArray = new Array() // array to be filled with drink objects

    // SQL Statement:
    //   selects all fields of drinks from the joining of groups and drinks
    //     tables to get all drinks that correspond to a user
    const stmt = this.db.prepare('SELECT d.* FROM groups g INNER JOIN drinks d USING(drink_id) WHERE uid = ?')
    const query = stmt.all(uid) // an array of row (drink) objects

    // Iterate through the array of objects
    // `value` = drink object
    query.forEach((value) => {
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
   //   this.db.prepare(`SELECT * FROM groups WHERE id = ${id};`,(err, row) => {
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
    * @param {Integer} groupId id of group
    * @return {Boolean} false if DNE, true if it does
    */
   isExist (groupId) {
     const stmt = this.db.prepare(`SELECT COUNT(*) count FROM groups WHERE group_id = ? `)
     const query = stmt.get(groupId) // get runs the statement
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
     const stmt = this.db.prepare(`SELECT COUNT(*) count FROM groups WHERE drink_id = '${drinkId}' ` +
             `AND uid = '${uid}' AND fav = 1`)
     const query = stmt.get() // get runs the statement
     const numStar = query.count
     return numStar > 0
   }
 
  /**
  * Creates a new group
  * Duplicate group names are allowed
  * Upon creating a new group, all initial fields for friend id, drink id are null
  * @param {Integer} uid
  * @param {String} groupName initially empty string
  * @param {Integer} friendUID initially -1 because this method only creates new group
  * @param {Integer} friendsDrinkID same as friendUID
  * @returns {Boolean} true if successful, false if failed
  */
  createNewGroup (uid, groupName = '', friendUID = -1, friendsDrinkID = -1) {
    const userDB = new userDatabase.UserDatabase()

    // Check if user id exists in other DBs in the first place
    if (!userDB.getUserByUID(uid)) {
      return false
    } else {
      const stmt = this.db.prepare('INSERT INTO groups (uid, group_name, friend_uid, friends_drink_id)' +
              `VALUES (?, ?, ?, ?)`)
      const query = stmt.run(uid, groupName, friendUID, friendsDrinkID)

      if (query.changes === 1) {
        return true
      } else {
        return false
      }
    }
  }

   /**
    * Adds friend-drink pair to group
    * Make sure to check if this is a fresh new group to update null values
    * @param {Integer} groupId
    * @param {Integer} uid
    * @param {Integer} friendUID
    * @param {Integer} drinkId
    * @returns {Boolean} true if successful, false if failed
    */
    addToGroup (groupId, uid, friendUID, drinkId) {
      const userDB = new userDatabase.UserDatabase()
      const drinksDB = new drinksDatabase.DrinksDatabase()
  
      // Check if ids exists in the first place
      if (userDB.getUserByUID(uid) &&
              userDB.getUserByUID(friendUID) &&
              drinksDB.isExist(drinkId) &&
              this.isExist(groupId)) {

        // Get group name for data insertion
        const nameStmt = this.db.prepare('SELECT group_name FROM groups WHERE' +
                ' group_id = ?')
        const groupName = nameStmt.get(groupId).group_name

        // insert user-drink pair into table
        const stmt = this.db.prepare('INSERT INTO groups ' + 
                '(group_id, uid, group_name, friend_uid, friends_drink_id)' +
                `VALUES (?, ?, ?, ?, ?)`)
        const query = stmt.run(groupId, uid, groupName, friendUID, drinkId)
  
        // Check to make sure table was changed
        if (query.changes === 1) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    }
 
   // Need an edit drink method in drinks_database.js
   // Implementation is to modify the drink desc in database and to keep uid and
   // drinkId pair the same in groups_database.js
 
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
         const stmt = this.db.prepare('DELETE FROM groups WHERE ' +
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
       const stmt = this.db.prepare(`UPDATE groups SET fav = 1 WHERE uid = '${uid}' ` +
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
       const stmt = this.db.prepare(`UPDATE groups SET fav = 0 WHERE uid = '${uid}' ` +
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
     const stmt = this.db.prepare('SELECT * FROM groups')
     const query = stmt.all()
     console.log(query)
     return query.toString()
   }
 
   purgeDb () {
     const stmt = this.db.prepare('DELETE FROM groups')
     const query = stmt.run()
   }
 }
 
 module.exports = { FavDrinksDatabase }
 