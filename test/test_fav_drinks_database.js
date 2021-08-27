const { assert } = require('chai')
const Database = require('better-sqlite3')

const favDrinksDatabase = require('../app/models/database/fav_drinks_database')
const drinksDatabase = require('../app/models/database/drinks_database')
const userDatabase = require('../app/models/database/user_database')

// const db = new Database('databases/sample.db', {verbose: console.log});
const db = new Database('databases/fav_drink_dummy.db')

const favDrinksDb = new favDrinksDatabase.FavDrinksDatabase(db)
const drinksDb = new drinksDatabase.DrinksDatabase(db)
const userDb = new userDatabase.UserDatabase(db)

favDrinksDb.purgeDb()
drinksDb.purgeDb()
userDb.deleteAllTableEntries()

// describe('Testing Favorite Drinks Relational Database', function () {
//   it('Test: Add New Fav Drink Relation Successfully', function () {
//     const drinkId = drinksDb.addDrink('Oolong Milk Tea')
//     userDb.insertNewUser('bobalover24@aol.com', 'lessIce')
//     const userId = userDb.getUserId('bobalover24@aol.com')
//     assert.equal(favDrinksDb.addFavDrink(userId, drinkId), true)
//   })

//   it('Test: Add New Fav Drink Relation Unsuccessfully', function () {
//     const drinkId = drinksDb.addDrink('Oolong Milk Tea')
//     userDb.insertNewUser('JeefHaWAB@nvidia.com', 'ToxicTeemoMain')
//     const userId = userDb.getUserId('JeefHaWAB@nvidia.com')
//     favDrinksDb.addFavDrink(userId, drinkId) // Checking duplicate entry
//     favDrinksDb.addFavDrink(userId, drinkId) // Checking duplicate entry
//     assert.equal(favDrinksDb.addFavDrink(userId, drinkId), false)
//   })

//   it('Test: Is Fav Drink Relation Exist', function () {
//     const drinkId = drinksDb.addDrink('Wintermelon Milk Tea')
//     userDb.insertNewUser('egirl@gmail.com', 'BobaIsAPersonality')
//     const userId = userDb.getUserId('egirl@gmail.com')
//     favDrinksDb.addFavDrink(userId, drinkId)
//     assert.equal(favDrinksDb.isExist(userId, drinkId), true)
//   })

//   it('Test: Remove User-Drink Relation Successfully', function () {
//     const drinkId = drinksDb.addDrink('coffee')
//     userDb.insertNewUser('starbies@email.com', 'caffeineAddict')
//     const userId = userDb.getUserId('starbies@email.com')
//     favDrinksDb.addFavDrink(userId, drinkId)
//     assert.equal(favDrinksDb.removeFavDrink(userId, drinkId), true)
//   })

//   it('Test: Remove User-Drink Relation Unsuccessfully', function () {
//     const drinkId = drinksDb.addDrink('coffee')
//     userDb.insertNewUser('starbies@email.com', 'caffeineAddict')
//     const userId = userDb.getUserId('starbies@email.com')
//     assert.equal(favDrinksDb.removeFavDrink(userId, drinkId), false)
//   })

//   it('Test: Star Drink Successfully', function () {
//     const drinkId = drinksDb.addDrink('horchata')
//     userDb.insertNewUser('latoxicaaa@email.com', 'laChancla')
//     const userId = userDb.getUserId('latoxicaaa@email.com')
//     favDrinksDb.addFavDrink(userId, drinkId)
//     favDrinksDb.toString()
//     assert.equal(favDrinksDb.starDrink(userId, drinkId), true)
//   })

//   it('Test: Star Drink Unsuccessfully (dupe)', function () {
//     favDrinksDb.purgeDb() // Must purge or else the previous Star drink test will interfere. (Had failed UNIQUE constraint?)
//     const drinkId = drinksDb.addDrink('horchata')
//     userDb.insertNewUser('latoxicaaa@email.com', 'laChancla')
//     const userId = userDb.getUserId('latoxicaaa@email.com')
//     favDrinksDb.addFavDrink(userId, drinkId)
//     favDrinksDb.starDrink(userId, drinkId)
//     assert.equal(favDrinksDb.starDrink(userId, drinkId), false)
//   })

//   it('Test: Unstar Drink Successfully', function () {
//     const drinkId = drinksDb.addDrink('thai tea')
//     userDb.insertNewUser('abg88@email.com', 'falsies')
//     const userId = userDb.getUserId('abg88@email.com')
//     favDrinksDb.addFavDrink(userId, drinkId)
//     favDrinksDb.starDrink(userId, drinkId)
//     assert.equal(favDrinksDb.unstarDrink(userId, drinkId), true)
//   })

//   it('Test: Unstar Drink Unsuccessfully (dupe)', function () {
//     const drinkId = drinksDb.addDrink('thai tea')
//     userDb.insertNewUser('abg88@email.com', 'falsies')
//     const userId = userDb.getUserId('abg88@email.com')
//     assert.equal(favDrinksDb.unstarDrink(userId, drinkId), false)
//   })
// })
