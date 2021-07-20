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
     * @returns {boolean} true if successful, false otherwise
     */
    insertNewUser(email, password) {
        // default username is first 5 characters of email
        var username = email.substring(0, 6);
        
        var info = this.db.prepare(`INSERT INTO users (email, password, username, display_name, profile_picture, banner) VALUES ('${email}', '${password}', '${username}', '${username}', 0, 0);`).run();
        // console.log(info);
        if (info["changes"] > 0) {
            return true;
        } else {
            return false;
        }
    }

    printAll() {
        console.log(this.db.prepare("SELECT * FROM users;").all());
    }

    encryptPassword(password) {

    }

    checkPassword() {

    }
    

}

module.exports = {UserDatabase};