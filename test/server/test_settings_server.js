const { assert } = require('chai')
const session = require('supertest-session')

const app = require('../../app/app')

let authenticatedSession = null

// const taroApp = null
// const taroSession = null

describe('Test Server', function () {
  const taroApp = new app.TaroCardApp()
  taroApp.run()

  let taroSession = null
  taroSession = session(taroApp.app)

  //   before((done) => {
  //     taroApp = new app.TaroCardApp()
  //     taroApp.run()

  //     taroSession = session(taroApp.app)
  //     return done()
  //   })

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

  it('test update email', function (done) {
    taroSession.post('/signup').send(
      {
        email: 'user1@email.com',
        password: 'password',
        repeatPassword: 'password',
        username: 'user1'
      }).end(function (err, res) {
      if (err !== null) {
        console.log(err)
      }
      authenticatedSession = taroSession
      authenticatedSession.post('/settings/updateEmail').send({
        new_email: 'user2@email.com',
        confirm_email: 'user2@email.com'
      }).end((err, res) => {
        if (err) {
          console.log(err)
        }
        assert.equal(res.text, 'success')
        return done()
      })
    })
  })

  after((done) => {
    taroApp.server.close(done)
    taroApp.store.knex.destroy()
  })
})
