const e = require('express')
const userDatabase = require('../models/database/user_database')
const userDB = new userDatabase.UserDatabase()

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.settingsPage = (req, res) => {
  if (req.session.loggedin) {
    // res.redirect()
    res.send('settings')
  } else {
    res.redirect('/')
  }
}

exports.updateEmail = (req, res) => {
  const email = req.body.new_email
  const confirmEmail = req.body.confirm_email
  if (req.session.loggedin && email === confirmEmail) {
    const uid = req.session.uid
    if (userDB.updateEmail(uid, email)) {
      res.send('success')
    } else {
      res.send('failure')
    }
  } else {
    res.send('failure')
  }
}
