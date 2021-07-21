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
        });

        it("Test isEmailInDatabase", function() {
            user_db.insertNewUser("user3@email.com", "password");
            assert.equal(user_db.isEmailInDatabase("user3@email.com"), true);
        });

        it("Test isEmailInDatabase false", function() {
            assert.equal(user_db.isEmailInDatabase("user4@email.com"), false);
        });

        it("Test selectUserSessionData check username", function() {
            user_db.insertNewUser("user5@email.com", "password");
            var session_data = user_db.selectUserSessionData("user5@email.com");
            assert.equal(session_data["username"], "user5");
        });

        it("Test selectUserSessionData check display_name", function() {
            user_db.insertNewUser("user6@email.com", "password");
            var session_data = user_db.selectUserSessionData("user6@email.com");
            assert.equal(session_data["display_name"], "user6");
        });

        it("Test selectUserSessionData email does not exist", function() {
            var session_data = user_db.selectUserSessionData("user7@email.com");
            assert.isUndefined(session_data);
        });

        it("Test checkPassword success", function() {
            user_db.insertNewUser("user7@email.com", "password");
            assert.isTrue(user_db.checkPassword("user7@email.com", "password"));
        }) 

        it("Test checkPassword failure", function() {
            user_db.insertNewUser("user8@email.com", "password");
            assert.isFalse(user_db.checkPassword("user8@email.com", "password123"));
        }) 
    }
)