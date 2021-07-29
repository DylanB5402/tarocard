const { assert } = require('chai')
const Database = require('better-sqlite3')

const drinksTagsDatabase = require('../app/models/database/drinks_tags_database')
const drinksDatabase = require('../app/models/database/drinks_database')
const tagsDatabase = require('../app/models/database/tags_database')

const db = new Database('databases/sample.db')

const drinksTagsDb = new drinksTagsDatabase.DrinksTagsDatabase(db)
const drinksDb = new drinksDatabase.DrinksDatabase(db)
const tagsDb = new tagsDatabase.TagsDatabase(db)

drinksTagsDb.resetDb()
drinksDb.resetDb()
tagsDb.resetDb()

describe('Testing Drinks-Tags Relational Database', function () {
  it('Test: Add New Drink-Tag Relation Successfully', function () {
    const drinkId = drinksDb.addDrink('coke')
    const tagId = tagsDb.addTag('carbonated')
    assert.equal(drinksTagsDb.addDrinkTag(drinkId, tagId), true)
  })

  it('Test: Add New Drink-Tag Relation Unsuccessfully', function () {
    const drinkId = drinksDb.addDrink('coke')
    const tagId = tagsDb.addTag('teeth-eroding')
    drinksTagsDb.addDrinkTag(drinkId, tagId)
    assert.equal(drinksTagsDb.addDrinkTag(drinkId, tagId), false)
  })

  it('Test: Is Drink-Tag Relation Exist', function () {
    const drinkId = drinksDb.addDrink('boba')
    const tagId = tagsDb.addTag('egirl drink wtf')
    drinksTagsDb.addDrinkTag(drinkId, tagId)
    assert.equal(drinksTagsDb.isExist(drinkId, tagId), true)
  })

  it('Test: Remove Drink-Tag Relation Successfully', function () {
    const drinkId = drinksDb.addDrink('coffee')
    const tagId = tagsDb.addTag('disgusting')
    drinksTagsDb.addDrinkTag(drinkId, tagId)
    assert.equal(drinksTagsDb.removeDrinkTag(drinkId, tagId), true)
  })

  it('Test: Remove Drink-Tag Relation Unsuccessfully', function () {
    const drinkId = drinksDb.addDrink('coffee')
    const tagId = tagsDb.addTag('disgusting')
    assert.equal(drinksTagsDb.removeDrinkTag(drinkId, tagId), false)
  })

  it('Test: Get Tags From Drink', function () {
    drinksTagsDb.purgeDb()
    drinksDb.purgeDb()
    tagsDb.purgeDb()

    const drinkId = drinksDb.addDrink('cocoa')

    const tag1Name = 'sweet'
    const tag1Desc = 'a savoury flavor'
    let tagId = tagsDb.addTag(tag1Name, tag1Desc)
    const tag1 = { id: tagId, name: tag1Name, desc: tag1Desc }

    drinksTagsDb.addDrinkTag(drinkId, tagId)

    const tag2Name = 'sour'
    const tag2Desc = 'dog flavor'
    tagId = tagsDb.addTag(tag2Name, tag2Desc)
    const tag2 = { id: tagId, name: tag2Name, desc: tag2Desc }

    drinksTagsDb.addDrinkTag(drinkId, tagId)

    const tag3Name = 'chocolate'
    const tag3Desc = 'comes from dried rasins'
    tagId = tagsDb.addTag(tag3Name, tag3Desc)
    const tag3 = { id: tagId, name: tag3Name, desc: tag3Desc }

    drinksTagsDb.addDrinkTag(drinkId, tagId)

    const tagArr = [tag1, tag2, tag3]

    assert.deepEqual(drinksTagsDb.getTagsFromDrink(drinkId), tagArr)
  })

  it('Test: Get Drinks From Tags', function () {
    drinksTagsDb.purgeDb()
    drinksDb.purgeDb()
    tagsDb.purgeDb()

    // Simulated Tags
    const tag1Name = 'sweet'
    const tag1Desc = 'a savoury flavor'
    const tag1Id = tagsDb.addTag(tag1Name, tag1Desc)

    const tag2Name = 'sour'
    const tag2Desc = 'dog flavor'
    const tag2Id = tagsDb.addTag(tag2Name, tag2Desc)

    const tag3Name = 'chocolate'
    const tag3Desc = 'comes from dried rasins'
    const tag3Id = tagsDb.addTag(tag3Name, tag3Desc)

    const tag4Name = 'boba'
    const tag4Desc = 'egirl flavor'
    const tag4Id = tagsDb.addTag(tag4Name, tag4Desc)

    const tag5Name = 'fruit'
    const tag5Desc = 'fruity'
    const tag5Id = tagsDb.addTag(tag5Name, tag5Desc)

    // Simulate Drinks
    const drink1Name = 'coco'
    const drink1Desc = 'flavor of sweet choco'
    const drink1Id = drinksDb.addDrink(drink1Name, drink1Desc)
    const drink1 = { id: drink1Id, name: drink1Name, desc: drink1Desc }

    const drink2Name = 'milk tea'
    const drink2Desc = 'trash'
    const drink2Id = drinksDb.addDrink(drink2Name, drink2Desc)
    const drink2 = { id: drink2Id, name: drink2Name, desc: drink2Desc }

    const drink3Name = 'coconut '
    const drink3Desc = 'tropical'
    const drink3Id = drinksDb.addDrink(drink3Name, drink3Desc)
    const drink3 = { id: drink3Id, name: drink3Name, desc: drink3Desc }

    const drink4Name = 'lemonade'
    const drink4Desc = 'sour'
    const drink4Id = drinksDb.addDrink(drink4Name, drink4Desc)
    const drink4 = { id: drink4Id, name: drink4Name, desc: drink4Desc }

    const drink5Name = 'sprite'
    const drink5Desc = 'refreshing'
    const drink5Id = drinksDb.addDrink(drink5Name, drink5Desc)
    const drink5 = { id: drink5Id, name: drink5Name, desc: drink5Desc }

    const drink6Name = 'acetone'
    const drink6Desc = 'totally edible'
    const drink6Id = drinksDb.addDrink(drink6Name, drink6Desc)
    // const drink6 = { id: drink6Id, name: drink6Name, desc: drink6Desc }

    // Drink 1 Tags
    drinksTagsDb.addDrinkTag(drink1Id, tag1Id)
    drinksTagsDb.addDrinkTag(drink1Id, tag3Id)

    // Drink 2 Tags
    drinksTagsDb.addDrinkTag(drink2Id, tag1Id)
    drinksTagsDb.addDrinkTag(drink2Id, tag4Id)

    // Drink 3 Tags
    drinksTagsDb.addDrinkTag(drink3Id, tag1Id)
    drinksTagsDb.addDrinkTag(drink3Id, tag5Id)

    // Drink 4 Tags
    drinksTagsDb.addDrinkTag(drink4Id, tag1Id)
    drinksTagsDb.addDrinkTag(drink4Id, tag2Id)
    drinksTagsDb.addDrinkTag(drink4Id, tag5Id)

    // Drink 5 Tags
    drinksTagsDb.addDrinkTag(drink5Id, tag1Id)
    drinksTagsDb.addDrinkTag(drink5Id, tag2Id)
    drinksTagsDb.addDrinkTag(drink5Id, tag5Id)

    // Drink 6 Tags

    // Test 1: Result for searching: Sweet
    const result1 = [drink1, drink2, drink3, drink4, drink5]
    const tags1 = [tag1Id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags1), result1)

    // Test 2: Result for searching: Sweet & Sour
    const result2 = [drink4, drink5]
    const tags2 = [tag1Id, tag2Id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags2), result2)

    // Test 3: Result for searching: boba
    const result3 = [drink2]
    const tags3 = [tag4Id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags3), result3)

    // Test 4: Result for searching: Sweet & Fruity
    const result4 = [drink3, drink4, drink5]
    const tags4 = [tag1Id, tag5Id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags4), result4)

    // Test 5: Result for searching: Boba & Chocolate
    const result5 = []
    const tags5 = [tag3Id, tag4Id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags5), result5)

    // Test 6: Result for searching: Sweet, Sour, & Fruity
    const result6 = [drink4, drink5]
    const tags6 = [tag1Id, tag2Id, tag5Id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags6), result6)

    // Test 7: Result for searching: All
    const result7 = []
    const tags7 = [tag1Id, tag2Id, tag3Id, tag4Id, tag5Id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags7), result7)
  })
})
