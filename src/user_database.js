const Database = require('better-sqlite3')
const bcrypt = require('bcrypt')
const { threadId } = require('worker_threads')

class UserDatabase {
  constructor (database) {
    /**
         * @type {!Database}
         */
    this.db = database
    this.createUserTable()
    this.printAll()
  }

  createUserTable () {
    this.db.prepare('CREATE TABLE IF NOT EXISTS users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, display_name TEXT, bio TEXT, profile_picture BLOB, banner BLOB);').run()
  }

  getSchema () {
    // var schema = this.db.prepare(".schema").get();
    const schema = this.db.prepare("SELECT sql FROM sqlite_master WHERE name='users'").get()
    return schema
  }

  /**
     *
     * @param {String} email
     * @param {String} password
     * @returns {InsertNewUserResult} true if successful, false otherwise
     */
  insertNewUser (email, password) {
    // default username is first 5 characters of email
    const username = email.substring(0, 6)
    if (this.isEmailInDatabase(email)) {
      return InsertNewUserResult.INVALID_EMAIL
    } else {
      const saltRounds = 10
      const hash = bcrypt.hashSync(password, saltRounds)
      const info = this.db.prepare(`INSERT INTO users (email, password, username, display_name, bio, profile_picture, banner) VALUES ('${email}', '${hash}', '', '${username}', '${username}', 0, 0);`).run()
      if (info.changes > 0) {
        return InsertNewUserResult.SUCCESS
      } else {
        return InsertNewUserResult.ERROR
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

  /**
     * Checks if a user already exists in the database
     * @param {Integer} uid the user id to search for
     * @returns {boolean} true if in the database, false if not
     */
  isExist (uid) {
    const stmt = this.db.prepare(`SELECT * FROM users WHERE uid = '${uid}'`)
    const query = stmt.all()
    return query.length > 0
  }

  /**
   * Gets the uid of a user through email
   * @param {String} email 
   * @returns {Integer} uid
   */
  getUserId(email) {
    const stmt = this.db.prepare(`SELECT uid FROM users WHERE email = '${email}'`)
    const uid_query = stmt.pluck(); // Returns value of the first column that it retrieves
    return uid_query
  }

  printAll () {
    console.log(this.db.prepare('SELECT * FROM users;').all())
  }

  encryptPassword (password) {

  }

  checkPassword () {

  }

  purgeDb () {
    const stmt = this.db.prepare('DELETE FROM users')
    const query = stmt.run()
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
