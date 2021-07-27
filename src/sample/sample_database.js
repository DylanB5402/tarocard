const Database = require('better-sqlite3')

class SampleDatabase {
  constructor (database) {
    /**
         * @type {!Database}
         */
    this.db = database
    this.createTable()
  }

  createTable () {
    this.db.prepare('CREATE TABLE IF NOT EXISTS table1 (id INTEGER PRIMARY KEY AUTOINCREMENT, word TEXT, number INTEGER);').run()
  }

  insertData (word, number) {
    const info = this.db.prepare(`INSERT INTO table1 (word, number) VALUES ('${word}', '${number}');`).run()
    return info.changes
  }
}

module.exports = { SampleDatabase }
