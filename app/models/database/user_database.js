const Database = require('better-sqlite3')
const bcrypt = require('bcrypt')
const config = require('../../config.json')

class UserDatabase {
  /**
   *
   * @param {!String} database
   */
  constructor (database) {
    if (database === undefined) {
      this.db = new Database(config.db)
    } else {
      this.db = database
    }
    this.createUserTable()
  }

  createUserTable () {
    this.db.prepare('CREATE TABLE IF NOT EXISTS users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, display_name TEXT, bio TEXT, profile_picture BLOB, banner BLOB);').run()
  }

  getSchema () {
    const schema = this.db.prepare("SELECT sql FROM sqlite_master WHERE name='users'").get()
    return schema
  }

  /**
     *
     * @param {String} email
     * @param {String} password
     * @returns {Integer} the UID assigned to the user, -1 if the operation failed
     */
  insertNewUser (email, password, username) {
    if (this.isEmailInDatabase(email)) {
      return -1
    } else {
      const hash = this.encryptPassword(password)
      const stmt = this.db.prepare('INSERT INTO users (email, password, username, display_name, bio, profile_picture, banner) VALUES (?, ?, ?, ?, ?,  ?, ?);')
      const info = stmt.run(email, hash, username, username, '', 0, 0)
      if (info.changes > 0) {
        return info.lastInsertRowid
      } else {
        return -1
      }
    }
  }

  /**
     * Check if an email address is stored in the database
     * @param {String} email
     * @returns {boolean} true if in the database, false if not
     */
  isEmailInDatabase (email) {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?;')
    const rows = stmt.all(email)
    return (rows.length > 0)
  }

  printAll () {
    console.log(this.getAllUsers())
  }

  /**
   *
   * @returns {Array}
   */
  getAllUsers () {
    return this.db.prepare('SELECT * FROM users;').all()
  }

  encryptPassword (password) {
    const saltRounds = 5
    return bcrypt.hashSync(password, saltRounds)
  }

  selectHashedPassword (email) {
    const stmt = this.db.prepare('SELECT password FROM users WHERE email = ?;')
    const row = stmt.get(email)
    if (row === undefined) {
      return undefined
    } else {
      return row.password
    }
  }

  /**
     * @returns {Boolean}, true if successful, false otherwise
     */
  checkPassword (email, password) {
    const hashFromDatabase = this.selectHashedPassword(email)
    if (hashFromDatabase !== undefined) {
      return bcrypt.compareSync(password, hashFromDatabase)
    } else {
      return false
    }
  }

  selectPasswordByUID (uid) {
    const stmt = this.db.prepare('SELECT password FROM users WHERE uid = ?')
    return stmt.get(uid).password
  }

  checkPasswordByUid (uid, password) {
    const hashFromDatabase = this.selectPasswordByUID(uid)
    if (hashFromDatabase !== undefined) {
      return bcrypt.compareSync(password, hashFromDatabase)
    } else {
      return false
    }
  }

  /**
     *
     * @param {*} httpsRequest
     * @param {*} email
     * @param {*} password
     * @returns {Boolean} true if login successful, false otherwise
     */
  logInUser (httpsRequest, email, password) {
    if (this.checkPassword(email, password)) {
      httpsRequest.session.loggedin = true
      httpsRequest.session.email = email
      httpsRequest.session.uid = this.selectUserId(email)
      return true
    } else {
      httpsRequest.session.loggedin = false
      return false
    }
  }

  selectUserId (email) {
    const row = this.db.prepare('SELECT uid FROM users WHERE email = ?;').get(email)
    if (row !== undefined) {
      return row.uid
    } else {
      return undefined
    }
  }

  selectUserSessionData (email) {
    const stmt = this.db.prepare('SELECT uid, username, display_name FROM users WHERE email = ?;')
    return stmt.get(email)
  }

  insertProfileData (uid, displayName, username, bio) {
    const stmt = this.db.prepare('UPDATE users SET display_name = ?, username = ?, bio = ? WHERE uid = ?;')
    const info = stmt.run(displayName, username, bio, uid)
    return info.changes > 0
  }

  selectProfileData (email) {
    return this.db.prepare('SELECT username, display_name, bio FROM users WHERE email = ?').get(email)
  }

  getUserByUID (uid) {
    if (!isNaN(uid)) {
      return this.db.prepare('SELECT username, display_name, bio FROM users WHERE uid = ?;').get(uid)
    } else {
      return undefined
    }
  }

  getUserNamesByUID (uid) {
    return this.db.prepare('SELECT username, display_name FROM users WHERE uid = ?;').get(uid)
  }

  getAllProfileData (uid) {
    return this.db.prepare('SELECT * FROM users WHERE uid = ?;').get(uid)
  }

  /**
     * Delete all entries in table, should only be used for testing/debugging
     */
  deleteAllTableEntries () {
    this.db.prepare('DELETE FROM users;').run()
  }

  /**
   *
   * @param {*} username
   * @returns {Array}
   */
  searchDatabase (username) {
    return this.db.prepare('SELECT username, display_name, uid, profile_picture FROM users WHERE username LIKE ?%\';').all(username)
  }

  updateEmail (uid, email) {
    const info = this.db.prepare('UPDATE users SET email = ? WHERE uid = ?;').run(email, uid)
    return info.changes > 0
  }

  getUserDataByID (uid) {
    // return this.db.prepare(`SELECT * FROM users WHERE uid = ${uid};`).get()
    return this.db.prepare('SELECT * FROM users WHERE uid = ?;').get(uid)
  }

  updatePassword (uid, password) {
    const hashedPassword = this.encryptPassword(password)
    const info = this.db.prepare('UPDATE users SET password = ? WHERE uid = ?;').run(hashedPassword, uid)
    return info.changes > 0
  }

  getEmailByUID (uid) {
    const stmt = this.db.prepare('SELECT email FROM users WHERE uid = ?;')
    return stmt.get(uid)
  }
}

/**
 * @enum {String}
 */
const InsertNewUserResult = {
  SUCCESS: 'success',
  INVALID_EMAIL: 'invalid email',
  ERROR: 'error'
}

module.exports = { UserDatabase, InsertNewUserResult }
