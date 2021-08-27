![TC Logo](./readme_aj.png)

## Prologue
Since the dawn of man, the first Australopithecus to have ever wandered the Earth continually looked for ways to share (to their friends) knowledge of their favorite boba tea.

## Taro Cards
Taro Cards is an webapp designed to cater to the needs of drink lovers who want to share their current favorites among their friends. 

## Features
* Fully featured account creation
    * Username and password login
    * Editable user display name
    * Profile picture and profile banner upload
    * Profile page display
* Add and remove new friends
	* Search for friends
    * Get notifications for incoming friend requests
    * See your friends' favorite drinks
* Add / Edit / Remove / Star "drink cards" of your favorite drinks
	* Add custom drink names
	* Display these "drink cards" to your profile to show off to friends
	* Scan through a database of over 2000 San Diego establishments 
* Create group orders to manage favorites from multiple friends


## Local Development
1. Clone this repository into a new directory using git 
```bash 
$ git clone https://gitlab.com/sdsc-rds/rds-interns-su21/ahjintpcc/tarocard.git
```
2. Make sure that Node.js [(Latest LTS Version)](https://nodejs.org/en/) is installed on your computer
3. Inside the new directory, use node package manager to install all dependencies 
```bash
$ npm install
```
4. Make a `databases` folder at the root level of the repository
```bash
$ mkdir databases
```
5. Get a [Yelp API Key](https://www.yelp.com/developers/documentation/v3/authentication)
6. Create a `.env` file with the contents 
```
YELP_API_KEY = <YOUR_API_KEY>
```
7. Fill the database with valid establishments from Yelp
```bash
$ npm run establishments
```
8. Run the node.js app
```bash
$ npm start
```

## Testing
Debug pages are available at `<url>/debug` to make it easy to add test users, view users and friend data, and add users as friends without logging into those users.

Unit tests are written using the Mocha and Chai testing libraries.

Populate the database with sample users
```bash
$ npm run populate
```

**npm run populate** populates the database with 10 test users with the following emails:
* Olivia@email.com
* Emma@email.com
* Ava@email.com
* Charlotte@email.com
* Sophia@email.com
* Liam@email.com
* Noah@email.com
* Oliver@email.com
* Elijah@email.com
* William@email.com

The password for each of these users is ‘password’.

Then run the mocha testing suite
```bash
$ npm run test
```


## Project structure
Taro Cards is written in the standard Model-Routes-Controllers-Services model.

![routes](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes/mvc_express.png)
```
root
├── app/
│   ├── controllers/
│   │  contains JS files linking database classes to routes
│   │
│   ├── models/
│   │   └── database/
|   │      contains JS files that define database classes and their functions
│   │
│   └── routes/
│      contains JS files with routes
│
├── databases/
│  contains SQLite3 database files
│
├── scripts/
│  contains scripts for populating databases
│
├── static/
│  contains static HTML/CSS/JS files for the website
│
├── templates/ 
│  contains Pug templates for pages
│
├── test/
│  contains unit tests for the server backend
│
└── app.js
```

## Future Plans
Taro Cards is dead


