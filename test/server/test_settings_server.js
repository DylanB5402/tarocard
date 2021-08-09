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
  taroUser.signUpUser('user2@email.com', 'password', 'user2')

  beforeEach( (done) => {
    taroUser.loginUser('user2@email.com', 'password', (res) => {
      return done()
    })
  })

  it('test change email', function(done) {
    taroUser.sendPostRequest('/settings/updateEmail', {
        new_email : 'user2@email.com',
        confirm_email : 'user2@email.com'
      }, (res) => {
        console.log(res.text)
        assert.equal(res.text, 'success')
        return done()

      })
  })
  

  after((done) => {
    taroApp.server.close(done)
    taroApp.store.knex.destroy()
  })
})
