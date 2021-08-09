const { assert } = require('chai')
const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)

const app = require('../../app/app')
const TaroCardUser = require('./taro_card_user').TaroCardUser
const taroApp = new app.TaroCardApp()
taroApp.run()

describe('Test Server', function () {
  const taroUser = new TaroCardUser(taroApp.app)
  taroUser.signUpUser('user1@email.com', 'password', 'user1@email.com')

  this.beforeEach( (function(done) {
    taroUser.loginUser('user1@email.com', 'password', (res) => {
      return done()
    })
    
  }))
  
  it('test is logged in', function(done) {
    taroUser.getLogInStatus((res) => {
            console.log(res.text)
            assert.equal(JSON.parse(res.text)['user-logged-in'], true)
            return done()
          })
  })

  it('test profile', function(done) {
    taroUser.getProfile((res) => {
      assert.equal(res.headers.profileaccess, 'successful')
      return done()
    })
  })

  after((done) => {
    taroApp.server.close(done)
    taroApp.store.knex.destroy()
  })
})
