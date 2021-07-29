const userDatabase = require('../models/database/user_database')
const templateEngine = require('../views/template_engine')

const userDB = new userDatabase.UserDatabase()
const tempEngine = new templateEngine.TemplateEngine()

exports.signup = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  const repeatPassword = req.body.repeatPassword
  const username = req.body.username
  if (password !== repeatPassword) {
    res.redirect('/signup.html')
  } else {
    const result = userDB.insertNewUser(email, password, username)
    if (result !== -1) {
      userDB.logInUser(req, email, password)
    }
    res.redirect('/profile/')
  }
}

exports.login = (req, res) => {
  // console.log(req)
  const email = req.body.email
  const password = req.body.password
  if (userDB.logInUser(req, email, password)) {
    // res.redirect('/debug/home')
    res.redirect('/profile/')
  } else {
    res.send('invalid email and/or password')
  }
}

exports.signout = (req, res) => {
  req.session.email = undefined
  req.session.loggedin = false
  req.session.uid = -1
  res.redirect('/debug/home')
}

exports.profile = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const profileData = userDB.getUserByUID(uid)
    if (profileData !== undefined) {
      const bio = profileData.bio
      const username = profileData.username
      const displayName = profileData.display_name
      res.send(tempEngine.getUserProfile(username, displayName, bio))
    } else {
      res.redirect('/404')
    }
  } else {
    res.redirect('/')
  }
}