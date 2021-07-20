const assert = require('assert');
const Database = require('better-sqlite3');

const sample_database = require('../src/sample/sample_database');

describe('Testing SampleDatabase', () => {
    it('insert into database', () => {
        const db = new Database('sample.db', {verbose: console.log});
        const user_db = new sample_database.SampleDatabase(db)
        assert.strictEqual(user_db.insertData("hi", 687), 1);
    })
})