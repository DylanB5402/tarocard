const { assert } = require('chai')
const Database = require('better-sqlite3')

const tagsDatabase = require('../src/tags_database')

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/sample.db')
const tagsDb = new tagsDatabase.TagsDatabase(db)
tagsDb.purgeDb()

describe('Testing Tags Database', function () {
  it('Test: Add New Tag', function () {
    assert.isAtLeast(tagsDb.addTag('tag1'), 0)
  })

  it('Test: Is Tag Exist', function () {
    let name = 'taga'
    let desc = 'this tag is cool'
    let id = tagsDb.addTag(name, desc)
    assert.equal(tagsDb.isExist(id), true)
  })

  it('Test: Get Tag', function () {
    let name = 'salty'
    let desc = 'why would you ever want a salty drink?????!!'
    let id = tagsDb.addTag(name, desc)
    let testTag = {
      tag_id: id,
      tag_name: name,
      tag_desc: desc
    } 
    assert.deepEqual(tagsDb.getTag(id), testTag)
  })

})