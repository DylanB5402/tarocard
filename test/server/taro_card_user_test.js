const { assert } = require('chai')
const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)

const app = require('../../app/app')
const TaroCardUser = require('./taro_card_user').TaroCardUser

describe('Test Server', function () {
  const taroApp = new app.TaroCardApp()
  taroApp.run()

  const taroUser = new TaroCardUser(taroApp.app)

  it('test signup', function (done) {
    taroUser.signUpUser('user@email.com', 'password', 'user', (res) => {
      console.log(687)
      console.log(res.text)
      console.log(res)
      assert.equal(1, 2)
      return done()
    })
  })

  after((done) => {
    taroApp.server.close(done)
    taroApp.store.knex.destroy()
  })
})
