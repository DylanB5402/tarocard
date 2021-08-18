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
   * Creates a new groups database if DNE. Otherwise, does not create table.
   * Table has 5 columns: Group Id, User Id, Group Name, Friend Id, Drink ID
   * Schema: multiple rows with the same group id designate a single group
   *         whenever a new GROUP is created, the group id is autoincremented
   *         whenever a new user-drink pair is added to the GROUP, then keep
   *         the same group id
   * @param none
   * @return none
   */
  createGroupTable () {
    const stmt = this.db.prepare('CREATE TABLE IF NOT EXISTS groups' +
      '(group_id INTEGER, uid INTEGER, group_name TEXT,' +
      ' friend_uid INTEGER, friends_drink_id INTEGER);')
    stmt.run()
  }

  /**
   * TODO:
   * Gets a group of a user by group id. The group is a collection (array) of
   * rows from the table
   * @param {Integer} uid
   * @param {Integer} groupId
   * @returns {Array[Object]} an array of friend-drink objects (the group)
   */
  getGroup (uid, groupId) {
    const userDB = new userDatabase.UserDatabase() // Using methods from user_database

    // Safety check
    if (userDB.getUserByUID(uid) && this.isExist(groupId)) {
      // SQL Statement:
      //   selects all friend-drink pair associated with a specific groupId
      const stmt = this.db.prepare('SELECT * FROM groups WHERE uid = ? AND group_id = ?')
      const query = stmt.all(uid, groupId) // an array of row objects (group)

      return query
    } else {
      return null
    }
  }

  /**
   * TODO:
   * Get all Groups associated with a specific user
   * Want to return group card info i.e. just id and name to display as preview
   * @param {Integer} uid
   * @returns {Array[Object]} an array of objects containing group id and group name
   */
  getAllGroups (uid) {
    const userDB = new userDatabase.UserDatabase() // Using methods from user_database

    // Safety Check
    if (userDB.getUserByUID(uid)) {
      // SQL Statement:
      //   selects all groups with the same uid from the table, sorted by alphabetical order
      const stmt = this.db.prepare('SELECT DISTINCT group_id, group_name FROM groups WHERE uid = ? ' +
              'ORDER BY group_name')
      const query = stmt.all(uid) // an array of row objects containing group id and group name

      return query
    } else {
      return null
    }
  }

  /**
    * Checks if a group already exists
    * @param {Integer} groupId id of group
    * @return {Integer} 0 if DNE, any integer > 0 if it does
    */
  isExist (groupId) {
    const stmt = this.db.prepare('SELECT COUNT(*) count FROM groups WHERE group_id = ? ')
    const query = stmt.get(groupId) // get runs the statement
    const numEntries = query.count
    return numEntries
  }

  /**
  * Creates a new group
  * Duplicate group names are allowed
  * Upon creating a new group, all initial fields for friend id, drink id are null
  * IDEA: open a popup where the user enters the name of the group then proceed
  * to adding friends drinks to the group
  * @param {Integer} uid
  * @param {String} groupName initially empty string
  * @param {Integer} friendUID initially -1 because this method only creates new group
  * @param {Integer} friendsDrinkID same as friendUID
  * @returns {Integer} id of group
  */
  createNewGroup (uid, groupName = '', friendUID = -1, friendsDrinkID = -1) {
    const userDB = new userDatabase.UserDatabase()

    // Check if user id exists in other DBs in the first place
    if (!userDB.getUserByUID(uid)) {
      return null
    } else {
      const emptyData = this.db.prepare('select count(*) count from (select 1) where exists (select * from groups);')
      const emptyQuery = emptyData.get()
      const empty = emptyQuery.count

      let query
      // Check for empty table
      if (empty === 0) {
        const stmt = this.db.prepare('INSERT INTO groups (group_id, uid, group_name, friend_uid, friends_drink_id)' +
                'VALUES (?, ?, ?, ?, ?)')
        query = stmt.run(0, uid, groupName, friendUID, friendsDrinkID)
      } else {
        const stmt = this.db.prepare('INSERT INTO groups (group_id, uid, group_name, friend_uid, friends_drink_id)' +
                'VALUES ((SELECT max(group_id) + 1 FROM groups), ?, ?, ?, ?)')
        query = stmt.run(uid, groupName, friendUID, friendsDrinkID)
      }
      if (query.changes === 1) {
        return query.lastInsertRowid
      } else {
        return null
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

      // Cover case of brand new group (friend id and drink id = -1)
      const checkNewGroupStmt = this.db.prepare('SELECT COUNT(*) count from ' +
              'groups WHERE group_id = ? AND friend_uid = -1')
      const numEntries = checkNewGroupStmt.get(groupId).count

      let query // declare query outside of if-else blocks
      if (numEntries === 1) {
        // update first and only entry where ids = -1
        const firstStmt = this.db.prepare('UPDATE groups SET friend_uid = ?, ' +
                  'friends_drink_id = ? WHERE group_id = ?')
        query = firstStmt.run(friendUID, drinkId, groupId)
      } else {
        // insert user-drink pair into table

        const stmt = this.db.prepare('INSERT INTO groups ' +
                  '(group_id, uid, group_name, friend_uid, friends_drink_id)' +
                  'VALUES (?, ?, ?, ?, ?)')
        query = stmt.run(groupId, uid, groupName, friendUID, drinkId)
      }

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

  editGroupName(uid, groupId, groupName) {
    const userDB = new userDatabase.UserDatabase()
    
    // Check to make params are valid/exists
    if (userDB.getUserByUID(uid) && this.isExist(groupId)) {
      // Update group name
      const stmt = this.db.prepare('UPDATE groups SET group_name = ? WHERE ' +
              'uid = ? AND group_id = ?')
      const query = stmt.run(groupName, uid, groupId)

      // Check to make sure changes are made to DB
      if (query.changes === 1) {
        return true
      }
      return false
    }
  }

  // Need an edit group method
  // Implementation is to modify the drink desc in database and to keep uid and
  // drinkId pair the same in groups_database.js

  /**
  * Removes an entire group for a user
  * @param {Integer} uid id for a specific user
  * @param {Integer} groupId id given to remove group
  * @returns {Boolean} true if successful, false if failed
  */
  removeGroup (uid, groupId) {
    const userDB = new userDatabase.UserDatabase()
    const drinksDB = new drinksDatabase.DrinksDatabase()

    // Check to make params are valid/exists
    if (userDB.getUserByUID(uid) && this.isExist(groupId)) {
      // Delete group from DB
      const stmt = this.db.prepare('DELETE FROM groups WHERE ' +
              'uid = ? AND group_id = ?')
      const query = stmt.run(uid, groupId)

      // Check to make sure changes are made to DB
      if (query.changes === 1) {
        return true
      }

      return false // No changes made to table
    } else {
      return false // at least 1 ID DNE
    }
  }

  /**
   * Removes a specific entry from a group for a user
   * @param {Integer} uid id for a specific user
   * @param {Integer} groupId
   * @param {Integer} drinkId // id of friend's drink NOTE: drinkIds are always associated with a single person
   *                            every single drink created is created by one person
   * @returns {Boolean} true if successful, false if failed
   */
  removeFromGroup (uid, groupId, drinkId) {
    const userDB = new userDatabase.UserDatabase()
    const drinksDB = new drinksDatabase.DrinksDatabase()

    // Check to make params are valid/exists
    if (userDB.getUserByUID(uid) &&
            drinksDB.isExist(drinkId) &&
            this.isExist(groupId)) {
      // Delete from group in DB
      const stmt = this.db.prepare('DELETE FROM groups WHERE ' +
              'uid = ? AND group_id = ? AND friends_drink_id = ?')
      const query = stmt.run(uid, groupId, drinkId)

      // Check to make sure changes are made to DB
      if (query.changes === 1) {
        return true
      }

      return false // No changes made to table
    } else {
      return false // at least 1 ID DNE
    }
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

module.exports = { GroupDatabase }
