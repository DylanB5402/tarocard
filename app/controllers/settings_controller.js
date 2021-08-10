const e = require('express')
const userDatabase = require('../models/database/user_database')
const userDB = new userDatabase.UserDatabase()

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.settingsPage = (req, res) => {
  if (req.session.loggedin) {
    res.redirect('/settings-page/Settings_HTML.html')
  } else {
    res.redirect('/')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.updateEmail = (req, res) => {
  const email = req.body['new-email']
  const confirmEmail = req.body['confirm-email']
  if (req.session.loggedin && email === confirmEmail) {
    const uid = req.session.uid
    if (userDB.updateEmail(uid, email)) {
      req.session.email = email
      // res.send('success')
      res.redirect('/settings-page/ChangeEmailSuccess.html')
    } else {
      res.send('failure')
    }
  } else {
    res.send('failure')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.currentEmail = (req, res) => {
  if (req.session.loggedin) {
    res.json({'email-address' : req.session.email})
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.updatePassword = (req, res) => {
  const currentPassword = req.body.current_password
  const newPassword = req.body.new_password
  const confirmPassword = req.body.confirm_password
  console.log(currentPassword, newPassword, confirmPassword)
  if (req.session.loggedin && newPassword === confirmPassword && userDB.checkPasswordByUid(req.session.uid, currentPassword)) {
    const uid = req.session.uid
    if (userDB.updatePassword(uid, newPassword)) {
      // res.send('success')
      res.redirect('/updatePassword/success')
    } else {
      res.status(500).send('failure')
    }
  } else {
    res.status(500).send('failure')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.updatePasswordSuccess = (req, res) => {
  if (req.session.loggedin) {
    res.redirect('/settings-page/ChangePasswordSuccess.html')
  } else {
    res.status(500).redirect('/index.html')
  }
}

exports.get