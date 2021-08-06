const { assert } = require('chai')
const Database = require('better-sqlite3')

const tagsDatabase = require('../app/models/database/tags_database')

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/sample.db')
const tagsDb = new tagsDatabase.TagsDatabase(db)
tagsDb.resetDb()

describe('Testing Tags Database', function () {
  it('Test: Add New Tag', function () {
    assert.isAtLeast(tagsDb.addTag('tag1'), 0)
  })

  it('Test: Is Tag Exist', function () {
    const name = 'taga'
    const desc = 'this tag is cool'
    const id = tagsDb.addTag(name, desc)
    assert.equal(tagsDb.isExist(id), true)
  })

  it('Test: Get Tag', function () {
    const name = 'salty'
    const desc = 'why would you ever want a salty drink?????!!'
    const id = tagsDb.addTag(name, desc)
    const testTag = {
      tag_id: id,
      tag_name: name,
      tag_desc: desc,
      tag_img: ''
    }
    assert.deepEqual(tagsDb.getTag(id), testTag)
  })

  it('Test: Edit Tag, Both Name And Desc', function () {
    const name = 'sour'
    const desc = 'it tastes kinda strange'
    const id = tagsDb.addTag(name, desc)

    const newname = 'puckering'
    const newdesc = 'it tastes kinda funky'
    const testTag = {
      tag_id: id,
      tag_name: newname,
      tag_desc: newdesc,
      tag_img: ''
    }

    tagsDb.editTag(id, newname, newdesc)
    assert.deepEqual(tagsDb.getTag(id), testTag)
  })

  it('Test: Edit Tag, Name Only', function () {
    const name = 'sour'
    const desc = 'it tastes kinda strange'
    const id = tagsDb.addTag(name, desc)

    const newname = 'puckering'
    // const newdesc = 'it tastes kinda funky'
    const testTag = {
      tag_id: id,
      tag_name: newname,
      tag_desc: desc,
      tag_img: ''
    }

    tagsDb.editTag(id, newname, undefined)
    assert.deepEqual(tagsDb.getTag(id), testTag)
  })

  it('Test: Edit Tag, Desc Only', function () {
    const name = 'sour'
    const desc = 'it tastes kinda strange'
    const id = tagsDb.addTag(name, desc)

    // const newname = 'puckering'
    const newdesc = 'it tastes kinda funky'
    const testTag = {
      tag_id: id,
      tag_name: name,
      tag_desc: newdesc,
      tag_img: ''
    }

    tagsDb.editTag(id, undefined, newdesc)
    assert.deepEqual(tagsDb.getTag(id), testTag)
  })

  it('Test: Edit Tag, None', function () {
    const name = 'sour'
    const desc = 'it tastes kinda strange'
    const id = tagsDb.addTag(name, desc)

    assert.equal(tagsDb.editTag(id), false)
  })

  it('Test: Edit Tag, Does Not Exist', function () {
    assert.equal(tagsDb.editTag(-1), false)
  })

  it('Test: Add Image To Tag Successfully', function () {
    const name = 'sour'
    const desc = 'it tastes kinda strange'
    const id = tagsDb.addTag(name, desc)

    const img = '/uploads/image/avatar/4CE68898-123A-4FD9-ACD4-C96342D67AC9.jpg'
    tagsDb.addImage(id, img)
    assert.equal(tagsDb.getTag(id).tag_img, img)
  })
})
