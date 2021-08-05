const { assert } = require('chai')
const session = require('supertest-session')

const app = require('../../app/app')

let authenticatedSession = null

describe('Test Server', function () {
  const taroApp = new app.TaroCardApp()
  taroApp.run()

  let taroSession = null
  taroSession = session(taroApp.app)

  it('test connection', function (done) {
    taroSession.get('/debug/connect').end((err, res) => {
      if (err !== null) {
        console.log(err)
      } else {
        assert.equal(res.text, 'connected')
      }
      return done()
    })
  })

  it('test signup', function (done) {
    taroSession.post('/signup').send(
      {
        email: 'user1@email.com',
        password: 'password',
        repeatPassword: 'password'
      }).end(function (err, res) {
      if (err !== null) {
        console.log(err)
      }
      authenticatedSession = taroSession
      assert.equal(res.text, 'Found. Redirecting to /profile/')
      return done()
    })
  })

  it('test profile', function (done) {
    authenticatedSession.get('/profile').end(function (err, res) {
      if (err !== null) {
        console.log(err)
      } else {
        // console.log(res.header)
        assert.equal(res.header.profileaccess, 'successful')
      }
      return done()
    })
  })

  it('test signout', function (done) {
    authenticatedSession.get('/debug/signout').end(function (err, res) {
      if (err !== null) {
        console.log(err)
      } else {
        assert.equal(res.text, 'Found. Redirecting to /')
      }
      return done()
    })
  })

  it('test login success', function (done) {
    authenticatedSession.post('/login').send(
      {
        email: 'user1@email.com',
        password: 'password'
      }).end(function (err, res) {
      if (err !== null) {
        console.log(err)
      }
      authenticatedSession.get('/profile').end(function (err, res) {
        if (err !== null) {
          console.log(err)
        } else {
          assert.equal(res.header.profileaccess, 'successful')
        }
        return done()
      })
    })
  })

  it('test login failure', function (done) {
    authenticatedSession.get('/debug/signout').end(function (err, res) {
      if (err !== null) {
        console.log(err)
      } else {
        authenticatedSession.post('/login').send(
          {
            email: 'user1@email.com',
            password: 'password_wrong'
          }).end(function (err, res) {
          if (err !== null) {
            console.log(err)
          } else {
            console.log(res.text)
            assert.equal(res.text, 'invalid email and/or password')
          }
          return done()
        })
      }
    })
  })

  after((done) => {
    taroApp.server.close(done)
    taroApp.store.knex.destroy()
    // setTimeout(() => {
    //     wtf.dump()
    // }, 1000)
  })
})
