const session = require('supertest-session')

class TaroCardUser {
  constructor (app) {
    this.session = session(app)
  }

  signUpUser (email, password, username, callback) {
    this.session.post('/signup').send(
      {
        email: email,
        password: password,
        repeatPassword: password,
        username: username
      }).end((err, res) => {
      if (err) {
        console.log(err)
      }
      if (callback !== undefined) {
        return callback(res)
      }
    })
  }

  loginUser (email, password, callback) {
    this.session.post('/login').send(
      {
        email: email,
        password: password
      }).end((err, res) => {
      if (err) {
        console.log(err)
      }
      if (callback !== undefined) {
        return callback(res)
      }
    })
  }

  getLogInStatus (callback) {
    this.session.get('/debug/loggedin').end((err, res) => {
      if (err) {
        console.log(err)
      }
      return callback(res)
    })
  }

  getProfile (callback) {
    this.session.get('/profile').end((err, res) => {
      if (err) {
        console.log(err)
      }
      return callback(res)
    })
  }

  getProfileData (callback) {
    this.session.get('/debug/profile').end((err, res) => {
      if (err) {
        console.log(err)
      }
      return callback(res)
    })
  }

  sendGetRequest (route, callback) {
    this.session.get(route).end((err, res) => {
      if (err) {
        console.log(err)
      }
      return callback(res)
    })
  }

  sendPostRequest (route, formData, callback) {
    this.session.post(route).send(formData).end((err, res) => {
      if (err) {
        console.log(err)
      }
      return callback(res)
    })
  }
}

module.exports = { TaroCardUser }
