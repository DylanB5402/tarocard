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

  it('test friend request success', function(done) {
      taroSession.post('/friends/request/1/2').end((err, res) => {
          assert.equal(res.text, "success")
      })
      return done()
  })

  it('test friend request failure', function(done) {
    taroSession.post('/friends/request/1/2').end((err, res) => {
        assert.equal(res.text, "failure")
    })
    return done()
})

  

  after((done) => {
    taroApp.server.close(done)
    taroApp.store.knex.destroy()
  })
})