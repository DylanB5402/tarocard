const express = require('express')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const indexRouter = require('./routes/index')
const debugRouter = require('./routes/debug_router')
const uploadRouter = require('./routes/upload_router')

// This code is clownfiesta. I have tried to clean it up
// Please read: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes

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

    this.app.use(express.static('static'))

    // Using the routers
    this.app.use('/', indexRouter)
    this.app.use('/debug', debugRouter)
    this.app.use('/upload', uploadRouter)

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
