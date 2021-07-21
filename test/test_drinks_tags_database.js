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

drinksTagsDb.purgeDb();
drinksDb.purgeDb();
tagsDb.purgeDb();

describe('Testing Drinks-Tags Relational Database', function () {
  it('Test: Add New Drink-Tag Relation Successfully', function () {
    let drink_id = drinksDb.addDrink('coke')
    let tag_id = tagsDb.addTag('carbonated')
    assert.equal(drinksTagsDb.addDrinkTag(drink_id, tag_id), true)
  })

  it('Test: Add New Drink-Tag Relation Unsuccessfully', function () {
    let drink_id = drinksDb.addDrink('coke')
    let tag_id = tagsDb.addTag('teeth-eroding')
    drinksTagsDb.addDrinkTag(drink_id, tag_id)
    assert.equal(drinksTagsDb.addDrinkTag(drink_id, tag_id), false)
  })

  it('Test: Is Drink-Tag Relation Exist', function () {
    let drink_id = drinksDb.addDrink('boba')
    let tag_id = tagsDb.addTag('egirl drink wtf')
    drinksTagsDb.addDrinkTag(drink_id, tag_id);
    assert.equal(drinksTagsDb.isExist(drink_id, tag_id), true)
  })

  it('Test: Remove Drink-Tag Relation Successfully', function () {
    let drink_id = drinksDb.addDrink('coffee')
    let tag_id = tagsDb.addTag('disgusting')
    drinksTagsDb.addDrinkTag(drink_id, tag_id);
    assert.equal(drinksTagsDb.removeDrinkTag(drink_id, tag_id), true)
  })

  it('Test: Remove Drink-Tag Relation Unsuccessfully', function () {
    let drink_id = drinksDb.addDrink('coffee')
    let tag_id = tagsDb.addTag('disgusting')
    assert.equal(drinksTagsDb.removeDrinkTag(drink_id, tag_id), false)
  })

  it('Test: Get Tags From Drink', function () {
    drinksTagsDb.purgeDb();
    drinksDb.purgeDb();
    tagsDb.purgeDb();

    let drink_id = drinksDb.addDrink('cocoa')

    let tag1_name = 'sweet';
    let tag1_desc = 'a savoury flavor';
    let tag_id = tagsDb.addTag(tag1_name, tag1_desc)
    let tag1 = {id: tag_id, name: tag1_name, desc: tag1_desc}

    drinksTagsDb.addDrinkTag(drink_id, tag_id);

    let tag2_name = 'sour';
    let tag2_desc = 'dog flavor';
    tag_id = tagsDb.addTag(tag2_name, tag2_desc)
    let tag2 = {id: tag_id, name: tag2_name, desc: tag2_desc}

    drinksTagsDb.addDrinkTag(drink_id, tag_id);

    let tag3_name = 'chocolate';
    let tag3_desc = 'comes from dried rasins';
    tag_id = tagsDb.addTag(tag3_name, tag3_desc)
    let tag3 = {id: tag_id, name: tag3_name, desc: tag3_desc}

    drinksTagsDb.addDrinkTag(drink_id, tag_id);

    let tagArr = [tag1, tag2, tag3]

    assert.deepEqual(drinksTagsDb.getTagsFromDrink(drink_id), tagArr)
  })

  it('Test: Get Drinks From Tags', function () {
    drinksTagsDb.purgeDb();
    drinksDb.purgeDb();
    tagsDb.purgeDb();

    // Simulated Tags
    let tag1_name = 'sweet';
    let tag1_desc = 'a savoury flavor';
    let tag1_id = tagsDb.addTag(tag1_name, tag1_desc)

    let tag2_name = 'sour';
    let tag2_desc = 'dog flavor';
    let tag2_id = tagsDb.addTag(tag2_name, tag2_desc)

    let tag3_name = 'chocolate';
    let tag3_desc = 'comes from dried rasins';
    let tag3_id = tagsDb.addTag(tag3_name, tag3_desc)

    let tag4_name = 'boba';
    let tag4_desc = 'egirl flavor';
    let tag4_id = tagsDb.addTag(tag4_name, tag4_desc)

    let tag5_name = 'fruit';
    let tag5_desc = 'fruity';
    let tag5_id = tagsDb.addTag(tag5_name, tag5_desc)

    // Simulate Drinks
    let drink1_name = 'coco';
    let drink1_desc = 'flavor of sweet choco'
    let drink1_id = drinksDb.addDrink(drink1_name, drink1_desc)
    let drink1 = {id: drink1_id, name: drink1_name, desc: drink1_desc}

    let drink2_name = 'milk tea';
    let drink2_desc = 'trash'
    let drink2_id = drinksDb.addDrink(drink2_name, drink2_desc)
    let drink2 = {id: drink2_id, name: drink2_name, desc: drink2_desc}

    let drink3_name = 'coconut ';
    let drink3_desc = 'tropical'
    let drink3_id = drinksDb.addDrink(drink3_name, drink3_desc)
    let drink3 = {id: drink3_id, name: drink3_name, desc: drink3_desc}

    let drink4_name = 'lemonade';
    let drink4_desc = 'sour'
    let drink4_id = drinksDb.addDrink(drink4_name, drink4_desc)
    let drink4 = {id: drink4_id, name: drink4_name, desc: drink4_desc}

    let drink5_name = 'sprite';
    let drink5_desc = 'refreshing'
    let drink5_id = drinksDb.addDrink(drink5_name, drink5_desc)
    let drink5 = {id: drink5_id, name: drink5_name, desc: drink5_desc}

    let drink6_name = 'acetone';
    let drink6_desc = 'totally edible'
    let drink6_id = drinksDb.addDrink(drink6_name, drink6_desc)
    let drink6 = {id: drink6_id, name: drink6_name, desc: drink6_desc}

    // Drink 1 Tags
    drinksTagsDb.addDrinkTag(drink1_id, tag1_id);
    drinksTagsDb.addDrinkTag(drink1_id, tag3_id);

    // Drink 2 Tags
    drinksTagsDb.addDrinkTag(drink2_id, tag1_id);
    drinksTagsDb.addDrinkTag(drink2_id, tag4_id);

    // Drink 3 Tags
    drinksTagsDb.addDrinkTag(drink3_id, tag1_id);
    drinksTagsDb.addDrinkTag(drink3_id, tag5_id);

    // Drink 4 Tags
    drinksTagsDb.addDrinkTag(drink4_id, tag1_id);
    drinksTagsDb.addDrinkTag(drink4_id, tag2_id);
    drinksTagsDb.addDrinkTag(drink4_id, tag5_id);

    // Drink 5 Tags
    drinksTagsDb.addDrinkTag(drink5_id, tag1_id);
    drinksTagsDb.addDrinkTag(drink5_id, tag2_id);
    drinksTagsDb.addDrinkTag(drink5_id, tag5_id);

    // Drink 6 Tags

    // Test 1: Result for searching: Sweet
    let result1 = [drink1, drink2, drink3, drink4, drink5]
    let tags1 = [tag1_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags1), result1)

    // Test 2: Result for searching: Sweet & Sour
    let result2 = [drink4, drink5]
    let tags2 = [tag1_id, tag2_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags2), result2)

    // Test 3: Result for searching: boba
    let result3 = [drink2]
    let tags3 = [tag4_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags3), result3)

    // Test 4: Result for searching: Sweet & Fruity
    let result4 = [drink3, drink4, drink5]
    let tags4 = [tag1_id, tag5_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags4), result4)

    // Test 5: Result for searching: Boba & Chocolate
    let result5 = []
    let tags5 = [tag3_id, tag4_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags5), result5)

    // Test 6: Result for searching: Sweet, Sour, & Fruity
    let result6 = [drink4, drink5]
    let tags6 = [tag1_id, tag2_id, tag5_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags5), result5)

    // Test 7: Result for searching: All
    let result7 = []
    let tags7 = [tag1_id, tag2_id, tag3_id, tag4_id, tag5_id]

    assert.deepEqual(drinksTagsDb.getDrinksFromTags(tags7), result7)
  })

})
