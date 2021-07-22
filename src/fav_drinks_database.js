/* 
File: fav_drinks_database.js
Author: Alex Nguyen
Purpose: This is a separate class/file to create a database for favorite drinks
  and all its properties
Credits: Dylan Barva for skeleton code
*/

const bSQLite3 = require('better-sqlite3');
const drinksDatabase = require('./drinks_database')
const userDatabase = require('./user_database');

class FavDrinksDatabase {
    constructor (database) {
        this.db = database;
        this.createFavDrinkTable();
    }

    /**
     * Creates a new drink database if DNE. Otherwise, does not create table.
     * Table has 4 columns: User Id, Drink ID, Favorite (bool), and date
     * @param none
     * @return none
     */
    createFavDrinkTable() {
        this.db.prepare("CREATE TABLE IF NOT EXISTS fav_drinks (uid INTEGER , drink_id INTEGER, fav BOOL, date DATETIME);").run();
    }

    /**
     * get all favorited drinks
     * @param {Response} http_response 
     */
    getAllDrinks(http_response) {
        var response_string = "";
        this.db.prepare("SELECT * FROM fav_drinks;", (err, rows) => {
            rows.forEach((row) => {
                response_string += "<p>" + JSON.stringify(row, null, 2) + "</p>";
            })
            http_response.send(response_string);
        })
    }

    /**
     * Get a specific drink by its id
     * @param {Integer} id 
     * @param {Response} http_response 
     */
    getDrink(id, http_response) {
        this.db.prepare(`SELECT * FROM fav_drinks WHERE id = ${id};`, (err, row) => {
            var response_string = JSON.stringify(row, null, 2);
            // console.log(response_string);
            if (response_string != undefined) {
                http_response.send(response_string);
            } else {
                http_response.send(`Drink with id ${id} not found`);
            }
        })
    }

    /**
     * View a drink using the template from template_engine.js
     * @param {Integer} id 
     * @param {Response} http_response 
     */
    viewDrink(id, http_response) {
        this.db.prepare(`SELECT * FROM fav_drinks WHERE id = ${id};`, (err, row) => {
            if (row != undefined) {
                var name = row['name'];
                var desc = row['desc'];
                var store = row['store'];
                http_response.send(this.temp_engine.getUser(id, name, desc, store));
            } else {
                http_response.send(`Drink with id ${id} not found`);
            }
        })
    }



    /**
     * querys a drink by its name
     * @param {String} name of drink
     * @return {Integer} id of drink
     */
    queryDrink(name) {
        return id;
    }

    /**
     * Checks if a drink already favorited
     * @param {Integer} id of drink
     * @return {Boolean} false if DNE, true if it does
     */
    isDrinkExists(id) {
        return false
    }

    /**
     * Unfavorites a drink from the database using its id
     * @param {Integer} id 
     * @returns {Boolean} true if successful, false otherwise
     */
    unfavDrink(id) {
        return false;
    }


}

module.exports = {DrinksDatabase}