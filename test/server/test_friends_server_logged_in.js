const { assert } = require('chai')
const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)
const session = require('supertest-session')

const app = require('../../app/app')

// let authenticatedSession = null

describe('Test Server', function () {
  const taroApp = new app.TaroCardApp()
  taroApp.run()

  let taroSession = null
  taroSession = session(taroApp.app)

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
      // authenticatedSession = taroSession
      assert.equal(res.text, 'Found. Redirecting to /profile/')
      return done()
    })
  })

  after((done) => {
    taroApp.server.close(done)
    taroApp.store.knex.destroy()
  })
})
