const { assert } = require('chai')
const expect = require('chai').expect
const chai = require('chai')
const chaiHttp = require('chai-http')

const app = require('../src/app')

chai.use(chaiHttp)

let taroCardApp
let agent

describe('User server tests', function () {
  before(function () {
    taroCardApp = new app.TaroCardApp('databases/test_server.db')
    taroCardApp.userDB.deleteAllTableEntries()
    taroCardApp.run()
    agent = chai.request.agent(taroCardApp.app)
  })

  //   it('Test connection to app', function () {
  //     return chai.request(taroCardApp.app).get('/debug/connect').then((res) => {
  //       assert.equal(res.text, 'connected')
  //     })
  //   })

  describe('Test Sign up', function () {
    it('Test connection to app', function () {
      return chai.request(taroCardApp.app).get('/debug/connect').then((res) => {
        assert.equal(res.text, 'connected')
      })
    })

    it('Test post new user success', function () {
      agent.post('/signup').send(
        {
          email: 'test_user@email.com',
          password: 'password',
          repeatPassword: 'password'
        }).then((res) => {
        expect(res).to.have.cookie('sessionid')
        console.log(254)
        return agent.get('/debug/home').then((res) => {
          assert.equal(res.text, 'Welcome test_user@email.com')
        })
      })
    })
  })

  after(function () {
    taroCardApp.server.close()
    taroCardApp.db.close()
    agent.close()
  })
})
