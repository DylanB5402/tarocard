const Database = require('better-sqlite3')
const bcrypt = require('bcrypt')
const config = require('../../config.json')

class UserDatabase {
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
    // default username is first 5 characters of email
    // const username = email.substring(0, 5)
    if (this.isEmailInDatabase(email)) {
      return -1
    } else {
      const hash = this.encryptPassword(password)
      const info = this.db.prepare(`INSERT INTO users (email, password, username, display_name, bio, profile_picture, banner) VALUES ('${email}', '${hash}', '${username}', '${username}', '',  0, 0);`).run()
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
    const rows = this.db.prepare(`SELECT * FROM users WHERE email = '${email}'`).all()
    return (rows.length > 0)
  }

  printAll () {
    console.log(this.db.prepare('SELECT * FROM users;').all())
  }

  encryptPassword (password) {
    const saltRounds = 5
    return bcrypt.hashSync(password, saltRounds)
  }

  selectHashedPassword (email) {
    const row = this.db.prepare(`SELECT password FROM users WHERE email = '${email}';`).get()
    if (row === undefined) {
      return undefined
    } else {
      return row.password
    }
  }

  /**
     *
     * @param {*} password unencrypted password
     * @param {*} hashFromDatabase encrypted password from the database
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
    return this.db.prepare(`SELECT uid FROM users WHERE email = '${email}';`).get().uid
  }

  selectUserSessionData (email) {
    return this.db.prepare(`SELECT uid, username, display_name FROM users WHERE email = '${email}';`).get()
  }

  insertProfileData (email, displayName, username, bio) {
    return this.db.prepare(`UPDATE users SET display_name = '${displayName}', username = '${username}', bio = '${bio}' WHERE email = '${email}';`).run()
  }

  selectProfileData (email) {
    return this.db.prepare(`SELECT username, display_name, bio FROM users WHERE email = '${email}';`).get()
  }

  getUserByUID (uid) {
    // console.log('receive uid ' + uid)
    if (!isNaN(uid)) {
      return this.db.prepare(`SELECT username, display_name, bio FROM users WHERE uid = ${uid};`).get()
    } else {
      return undefined
    }
  }

  /**
     * Delete all entries in table, should only be used for testing/debugging
     */
  deleteAllTableEntries () {
    this.db.prepare('DELETE FROM users;').run()
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
