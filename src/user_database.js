const Database = require("better-sqlite3");

class UserDatabase {

    constructor(database) {
        /**
         * @type {!Database}
         */
        this.db = database;
        this.createUserTable();
        this.printAll();
    }

    createUserTable() {
        this.db.prepare("CREATE TABLE IF NOT EXISTS users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, display_name TEXT, profile_picture BLOB, banner BLOB);").run();
    }

    /**
     * 
     * @param {String} email 
     * @param {String} password 
     * @returns {InsertNewUserResult} true if successful, false otherwise
     */
    insertNewUser(email, password) {
        // default username is first 5 characters of email
        var username = email.substring(0, 6); 
        if (this.isEmailInDatabase(email)) {
            return InsertNewUserResult.INVALID_EMAIL;
        } else {
            var info = this.db.prepare(`INSERT INTO users (email, password, username, display_name, profile_picture, banner) VALUES ('${email}', '${password}', '${username}', '${username}', 0, 0);`).run();
            if (info["changes"] > 0) {
                return InsertNewUserResult.SUCCESS;
            } else {
                return InsertNewUserResult.ERROR;
            }
        }
    }


    /**
     * Check if an email address is stored in the database
     * @param {String} email 
     * @returns {boolean} true if in the database, false if not 
     */
    isEmailInDatabase(email) {
        var rows = this.db.prepare(`SELECT * FROM users WHERE email = '${email}'`).all();
        return (rows.length > 0);
    }

    printAll() {
        console.log(this.db.prepare("SELECT * FROM users;").all());
    }

    encryptPassword(password) {

    }

    checkPassword() {

    }
    

}

/**
 * @enum {String}
 */
const InsertNewUserResult = {
    SUCCESS: "success",
    INVALID_EMAIL: "invalid email",
    ERROR: "error"
}

module.exports = {UserDatabase, InsertNewUserResult};