const { assert } = require('chai')
const Database = require('better-sqlite3')

const favDrinksDatabase = require('../src/fav_drinks_database')
const drinksDatabase = require('../src/drinks_database')
const userDatabase = require('../src/user_database')

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/fav_drink_dummy.db')

const favDrinksDb = new favDrinksDatabase.FavDrinksDatabase(db)
const drinksDb = new drinksDatabase.DrinksDatabase(db)
const userDb = new userDatabase.UserDatabase(db)

favDrinksDb.purgeDb()
drinksDb.purgeDb()
userDb.purgeDb()

describe('Testing Favorite Drinks Relational Database', function () {
  it('Test: Add New Fav Drink Relation Successfully', function () {
    const drink_id = drinksDb.addDrink('Oolong Milk Tea')
    userDb.insertNewUser('bobalover24@aol.com', 'lessIce') 
    const user_id = userDb.getUserId('bobalover24@aol.com')
    assert.equal(favDrinksDb.addFavDrink(user_id, drink_id), true)
  })

  it('Test: Add New Fav Drink Relation Unsuccessfully', function () {
    const drink_id = drinksDb.addDrink('Oolong Milk Tea')
    userDb.insertNewUser('JeefHaWAB@nvidia.com', 'ToxicTeemoMain')
    const user_id = userDb.getUserId('JeefHaWAB@nvidia.com')
    favDrinksDb.addFavDrink(user_id, drink_id) // Checking duplicate entry
    favDrinksDb.addFavDrink(user_id, drink_id) // Checking duplicate entry
    assert.equal(favDrinksDb.addFavDrink(user_id, drink_id), false)
  })

  it('Test: Is Fav Drink Relation Exist', function () {
    const drink_id = drinksDb.addDrink('Wintermelon Milk Tea')
    userDb.insertNewUser('egirl@gmail.com', 'BobaIsAPersonality')
    const user_id = userDb.getUserId('egirl@gmail.com')
    favDrinksDb.addFavDrink(user_id, drink_id)
    assert.equal(favDrinksDb.isExist(user_id, drink_id), true)
  })

  it('Test: Remove User-Drink Relation Successfully', function () {
    const drink_id = drinksDb.addDrink('coffee')
    userDb.insertNewUser('starbies@email.com', 'caffeineAddict')
    const user_id = userDb.getUserId('starbies@email.com')
    favDrinksDb.addFavDrink(user_id, drink_id)
    assert.equal(favDrinksDb.removeFavDrink(user_id, drink_id), true)
  })

  it('Test: Remove User-Drink Relation Unsuccessfully', function () {
    const drink_id = drinksDb.addDrink('coffee')
    userDb.insertNewUser('starbies@email.com', 'caffeineAddict')
    const user_id = userDb.getUserId('starbies@email.com')
    assert.equal(favDrinksDb.removeFavDrink(user_id, drink_id), false)
  })

  it('Test: Star Drink Successfully', function () {
    const drink_id = drinksDb.addDrink('horchata')
    userDb.insertNewUser('latoxicaaa@email.com', 'laChancla')
    const user_id = userDb.getUserId('latoxicaaa@email.com')
    favDrinksDb.addFavDrink(user_id, drink_id);
    assert.equal(favDrinksDb.starDrink(user_id, drink_id), true)
  })

  it('Test: Star Drink Unsuccessfully (dupe)', function () {
    favDrinksDb.purgeDb(); // Must purge or else the previous Star drink test will interfere. (Had failed UNIQUE constraint?)
    const drink_id = drinksDb.addDrink('horchata')
    userDb.insertNewUser('latoxicaaa@email.com', 'laChancla')
    const user_id = userDb.getUserId('latoxicaaa@email.com')
    favDrinksDb.addFavDrink(user_id, drink_id);
    favDrinksDb.starDrink(user_id, drink_id)
    assert.equal(favDrinksDb.starDrink(user_id, drink_id), false)
  })

  it('Test: Unstar Drink Successfully', function () {
    const drink_id = drinksDb.addDrink('thai tea')
    userDb.insertNewUser('abg88@email.com', 'falsies')
    const user_id = userDb.getUserId('abg88@email.com')
    favDrinksDb.addFavDrink(user_id, drink_id)
    favDrinksDb.starDrink(user_id, drink_id)
    assert.equal(favDrinksDb.unstarDrink(user_id, drink_id), true)
  })

  it('Test: Unstar Drink Unsuccessfully (dupe)', function () {
    const drink_id = drinksDb.addDrink('thai tea')
    userDb.insertNewUser('abg88@email.com', 'falsies')
    const user_id = userDb.getUserId('abg88@email.com')
    assert.equal(favDrinksDb.unstarDrink(user_id, drink_id), false)
  })

})
