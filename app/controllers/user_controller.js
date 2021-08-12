const userDatabase = require('../models/database/user_database')
const templateEngine = require('../views/template_engine')
const userDB = new userDatabase.UserDatabase()
const tempEngine = new templateEngine.TemplateEngine()

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.signup = (req, res) => {
  if (req.session.loggedin) {
    // res.append({'already-logged-in' : true})
    res.redirect('/profile/')
  } else {
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
}

exports.login = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  if (userDB.logInUser(req, email, password)) {
    res.redirect('/profile/')
  } else {
    res.send('invalid email and/or password')
  }
}

exports.signout = (req, res) => {
  req.session.email = undefined
  req.session.loggedin = false
  req.session.uid = -1
  res.redirect('/index.html')
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.profile = (req, res) => {
  if (req.session.loggedin) {
    const uid = req.session.uid
    const profileData = userDB.getUserByUID(uid)
    if (profileData !== undefined) {
      const bio = profileData.bio
      const username = profileData.username
      const displayName = profileData.display_name
      res.append('profileaccess', 'successful')
      res.send(tempEngine.getUserProfile(username, displayName, bio))
    } else {
      res.redirect('/')
    }
  } else {
    res.redirect('/')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.profileById = (req, res) => {
  const uid = req.params.id
  const profileData = userDB.getUserByUID(uid)
  if (profileData !== undefined) {
    const bio = profileData.bio
    const username = profileData.username
    const displayName = profileData.display_name
    res.append('profileaccess', 'successful')
    res.send(tempEngine.getUserProfile(username, displayName, bio))
  } else {
    res.send('no user with id ' + uid + 'found')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.updateProfile = (req, res) => {
  const username = req.body.username
  const displayName = req.body.display_name
  const bio = req.body.bio
  if (req.session.loggedin && userDB.insertProfileData(req.session.uid, displayName, username, bio)) {
    res.send('success')
  } else {
    res.send('failure')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.searchPage = (req, res) => {
  if (req.session.loggedin) {
    res.redirect('/search-users/SearchUsers.html')
  } else {
    res.redirect('/index.html')
  }
}

/**
 * @param {!import('express').Request} req
 * @param {!import('express').Response} res
 */
exports.searchAllUsers = (req, res) => {
  const search = req.body.string
  if (req.session.loggedin) {
    const userArray = []
    const users = userDB.searchDatabase(search)
    users.forEach((user) => {
      userArray.push({
        'display name': user.display_name,
        username: user.username,
        'image url': '',
        id: user.uid
      })
    })
    res.json({ users: userArray, success: true })
  } else {
    res.json({ users: [], success: false })
  }
}