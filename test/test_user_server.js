const { assert } = require('chai')
// const expect = require('chai').expect
// const chai = require('chai')
const session = require('supertest-session')

const app = require('../src/app')

let authenticatedSession = null

describe('Test App', function () {
  const taroApp = new app.TaroCardApp('databases/test_server.db')
  taroApp.userDB.deleteAllTableEntries()
  taroApp.run()

  let taroSession = null
  taroSession = session(taroApp.app)

  it('test connection', function (done) {
    taroSession.get('/debug/connect').end((err, res) => {
      if (err !== undefined) {
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
      if (err !== undefined) {
        console.log(err)
      }
      authenticatedSession = taroSession
      assert.equal(res.text, 'Found. Redirecting to /profile/')
      return done()
    })
  })

  it('test profile', function (done) {
    authenticatedSession.get('/profile').end(function (err, res) {
      if (err !== undefined) {
        console.log(err)
      } else {
        assert.equal(res.header.profileaccess, 'successful')
      }
      return done()
    })
  })

  after((done) => {
    taroApp.server.close(done)
    taroApp.db.close()
    taroApp.store.knex.destroy()
    // setTimeout(() => {
    //     wtf.dump()
    // }, 1000)
  })
})
