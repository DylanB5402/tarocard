const session = require('supertest-session')
const { use } = require('../../app/routes')

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
      }).end(
      function (err, res) {
        if (err !== null) {
          console.log(err)
        }
        if (callback !== undefined) {
          return callback(res)
        }
      })
  }

//   }
}

module.exports = { TaroCardUser }
