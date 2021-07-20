const {assert} = require('chai');
const Database = require('better-sqlite3');

const user_database = require('../src/user_database');

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/sample.db');
const user_db = new user_database.UserDatabase(db);

describe("Testing UserDatabase", function() {
    it("Test Database Schema", function() {
        var table_schema = "CREATE TABLE users (uid INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, username TEXT, display_name TEXT, bio TEXT, profile_picture BLOB, banner BLOB)"
        assert.equal(user_db.getSchema()['sql'], table_schema);
    })
    
    }
)