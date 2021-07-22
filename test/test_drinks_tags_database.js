const { assert } = require('chai')
const Database = require('better-sqlite3')

const drinksTagsDatabase = require('../src/drinks_tags_database')
const drinksDatabase = require('../src/drinks_database')
const tagsDatabase = require('../src/tags_database')

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/sample.db')

const drinksTagsDb = new drinksTagsDatabase.DrinksTagsDatabase(db)
const drinksDb = new drinksDatabase.DrinksDatabase(db)
const tagsDb = new tagsDatabase.TagsDatabase(db)

drinksTagsDb.purgeDb()
drinksDb.purgeDb()
tagsDb.purgeDb()

describe('Testing Drinks-Tags Relational Database', function () {
  it('Test: Add New Drink-Tag Relation Successfully', function () {
    const drink_id = drinksDb.addDrink('coke')
    const tag_id = tagsDb.addTag('carbonated')
    assert.equal(drinksTagsDb.addDrinkTag(drink_id, tag_id), true)
  })

  it('Test: Add New Drink-Tag Relation Unsuccessfully', function () {
    const drink_id = drinksDb.addDrink('coke')
    const tag_id = tagsDb.addTag('teeth-eroding')
    drinksTagsDb.addDrinkTag(drink_id, tag_id)
    assert.equal(drinksTagsDb.addDrinkTag(drink_id, tag_id), false)
  })

  it('Test: Is Drink-Tag Relation Exist', function () {
    const drink_id = drinksDb.addDrink('boba')
    const tag_id = tagsDb.addTag('egirl drink wtf')
    drinksTagsDb.addDrinkTag(drink_id, tag_id)
    assert.equal(drinksTagsDb.isExist(drink_id, tag_id), true)
  })

  it('Test: Remove Drink-Tag Relation Successfully', function () {
    const drink_id = drinksDb.addDrink('coffee')
    const tag_id = tagsDb.addTag('disgusting')
    drinksTagsDb.addDrinkTag(drink_id, tag_id)
    assert.equal(drinksTagsDb.removeDrinkTag(drink_id, tag_id), true)
  })

  it('Test: Remove Drink-Tag Relation Unsuccessfully', function () {
    const drink_id = drinksDb.addDrink('coffee')
    const tag_id = tagsDb.addTag('disgusting')
    assert.equal(drinksTagsDb.removeDrinkTag(drink_id, tag_id), false)
  })

  it('Test: Get Tags From Drink', function () {
    drinksTagsDb.purgeDb()
    drinksDb.purgeDb()
    tagsDb.purgeDb()

    const drink_id = drinksDb.addDrink('cocoa')

    const tag1_name = 'sweet'
    const tag1_desc = 'a savoury flavor'
    let tag_id = tagsDb.addTag(tag1_name, tag1_desc)
    const tag1 = { id: tag_id, name: tag1_name, desc: tag1_desc }

    drinksTagsDb.addDrinkTag(drink_id, tag_id)

    const tag2_name = 'sour'
    const tag2_desc = 'dog flavor'
    tag_id = tagsDb.addTag(tag2_name, tag2_desc)
    const tag2 = { id: tag_id, name: tag2_name, desc: tag2_desc }

    drinksTagsDb.addDrinkTag(drink_id, tag_id)

    const tag3_name = 'chocolate'
    const tag3_desc = 'comes from dried rasins'
    tag_id = tagsDb.addTag(tag3_name, tag3_desc)
    const tag3 = { id: tag_id, name: tag3_name, desc: tag3_desc }

    drinksTagsDb.addDrinkTag(drink_id, tag_id)

    const tagArr = [tag1, tag2, tag3]

    assert.deepEqual(drinksTagsDb.getTagsFromDrink(drink_id), tagArr)
  })

  it('Test: Get Drinks From Tags', function () {
    drinksTagsDb.purgeDb()
    drinksDb.purgeDb()
    tagsDb.purgeDb()

    // Simulated Tags
    const tag1_name = 'sweet'
    const tag1_desc = 'a savoury flavor'
    const tag1_id = tagsDb.addTag(tag1_name, tag1_desc)

    const tag2_name = 'sour'
    const tag2_desc = 'dog flavor'
    const tag2_id = tagsDb.addTag(tag2_name, tag2_desc)

    const tag3_name = 'chocolate'
    const tag3_desc = 'comes from dried rasins'
    const tag3_id = tagsDb.addTag(tag3_name, tag3_desc)

    const tag4_name = 'boba'
    const tag4_desc = 'egirl flavor'
    const tag4_id = tagsDb.addTag(tag4_name, tag4_desc)

    const tag5_name = 'fruit'
    const tag5_desc = 'fruity'
    const tag5_id = tagsDb.addTag(tag5_name, tag5_desc)

    // Simulate Drinks
    const drink1_name = 'coco'
    const drink1_desc = 'flavor of sweet choco'
    const drink1_id = drinksDb.addDrink(drink1_name, drink1_desc)
    const drink1 = { id: drink1_id, name: drink1_name, desc: drink1_desc }

    const drink2_name = 'milk tea'
    const drink2_desc = 'trash'
    const drink2_id = drinksDb.addDrink(drink2_name, drink2_desc)
    const drink2 = { id: drink2_id, name: drink2_name, desc: drink2_desc }

    const drink3_name = 'coconut '
    const drink3_desc = 'tropical'
    const drink3_id = drinksDb.addDrink(drink3_name, drink3_desc)
    const drink3 = { id: drink3_id, name: drink3_name, desc: drink3_desc }

    const drink4_name = 'lemonade'
    const drink4_desc = 'sour'
    const drink4_id = drinksDb.addDrink(drink4_name, drink4_desc)
    const drink4 = { id: drink4_id, name: drink4_name, desc: drink4_desc }

    const drink5_name = 'sprite'
    const drink5_desc = 'refreshing'
    const drink5_id = drinksDb.addDrink(drink5_name, drink5_desc)
    const drink5 = { id: drink5_id, name: drink5_name, desc: drink5_desc }

    const drink6_name = 'acetone'
    const drink6_desc = 'totally edible'
    const drink6_id = drinksDb.addDrink(drink6_name, drink6_desc)
    const drink6 = { id: drink6_id, name: drink6_name, desc: drink6_desc }

    // Drink 1 Tags
    drinksTagsDb.addDrinkTag(drink1_id, tag1_id)
    drinksTagsDb.addDrinkTag(drink1_id, tag3_id)

    // Drink 2 Tags
    drinksTagsDb.addDrinkTag(drink2_id, tag1_id)
    drinksTagsDb.addDrinkTag(drink2_id, tag4_id)

    // Drink 3 Tags
    drinksTagsDb.addDrinkTag(drink3_id, tag1_id)
    drinksTagsDb.addDrinkTag(drink3_id, tag5_id)

    // Drink 4 Tags
    drinksTagsDb.addDrinkTag(drink4_id, tag1_id)
    drinksTagsDb.addDrinkTag(drink4_id, tag2_id)
    drinksTagsDb.addDrinkTag(drink4_id, tag5_id)

    // Drink 5 Tags
    drinksTagsDb.addDrinkTag(drink5_id, tag1_id)
    drinksTagsDb.addDrinkTag(drink5_id, tag2_id)
    drinksTagsDb.addDrinkTag(drink5_id, tag5_id)

    // Drink 6 Tags

    // Test 1: Result for searching: Sweet
    const result1 = [drink1, drink2, drink3, drink4, drink5]
    const tags1 = [tag1_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags1), result1)

    // Test 2: Result for searching: Sweet & Sour
    const result2 = [drink4, drink5]
    const tags2 = [tag1_id, tag2_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags2), result2)

    // Test 3: Result for searching: boba
    const result3 = [drink2]
    const tags3 = [tag4_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags3), result3)

    // Test 4: Result for searching: Sweet & Fruity
    const result4 = [drink3, drink4, drink5]
    const tags4 = [tag1_id, tag5_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags4), result4)

    // Test 5: Result for searching: Boba & Chocolate
    const result5 = []
    const tags5 = [tag3_id, tag4_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags5), result5)

    // Test 6: Result for searching: Sweet, Sour, & Fruity
    const result6 = [drink4, drink5]
    const tags6 = [tag1_id, tag2_id, tag5_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags5), result5)

    // Test 7: Result for searching: All
    const result7 = []
    const tags7 = [tag1_id, tag2_id, tag3_id, tag4_id, tag5_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags7), result7)
  })
})
