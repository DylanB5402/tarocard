const express = require('express')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const indexRouter = require('./routes/index')
const debugRouter = require('./routes/debug_router')
const uploadRouter = require('./routes/upload_router')
const friendRouter = require('./routes/friend_router')
const settingsRouter = require('./routes/settings_router')
const groupsRouter = require('./routes/groups_router')
const drinksRouter = require('./routes/drink_router')

class TaroCardApp {
  constructor () {
    this.store = new KnexSessionStore()

    this.app = express()
    this.app.use(express.json()) // for parsing this.application/json
    this.app.use(express.urlencoded({ extended: true })) // for parsing this.application/x-www-form-urlencoded

    this.app.use(
      session({
        secret: 'ahjintpcc',
        store: this.store,
        saveUninitialized: false,
        resave: false
      })
    )

    // Using the routers
    this.app.use('/', indexRouter)
    this.app.use(express.static('static'))
    this.app.use('/debug', debugRouter)
    this.app.use('/upload', uploadRouter)
    this.app.use('/friends', friendRouter)
    this.app.use('/settings', settingsRouter)
    this.app.use('/groups', groupsRouter)
    this.app.use('/drinks', drinksRouter)

    // 404, page can't be found
    this.app.use(function (req, res) {
      res.status(404).send('404 page not found')
    })
  }

  run () {
    const port = 3000
    this.server = this.app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  }
}

module.exports = { TaroCardApp }
