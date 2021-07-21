const {assert} = require('chai');
const Database = require('better-sqlite3');

const user_database = require('../src/user_database');

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/sample.db');
const user_db = new user_database.UserDatabase(db);
user_db.deleteAllTableEntries();

describe("Testing UserDatabase", function() {
        it("Test Database Schema", function() {
            var table_schema = "CREATE TABLE users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, display_name TEXT, bio TEXT, profile_picture BLOB, banner BLOB)"
            assert.equal(user_db.getSchema()['sql'], table_schema);
        });
        it("Test InsertNewUser for a new user", function() {
            assert.equal(user_db.insertNewUser("user@email.com", "password"), user_database.InsertNewUserResult.SUCCESS);
        });
        it("Test InsertNewUser user already exits", function() {
            user_db.insertNewUser("user2@email.com", "password");
            assert.equal(user_db.insertNewUser("user2@email.com", "password"), user_database.InsertNewUserResult.INVALID_EMAIL);
        })
        it("Test isEmailInDatabase", function() {
            user_db.insertNewUser("user3@email.com", "password");
            assert.equal(user_db.isEmailInDatabase("user3@email.com"), true);
        })
        it("Test isEmailInDatabase false", function() {
            assert.equal(user_db.isEmailInDatabase("user4@email.com"), false);
        })
    }
)