const { assert, expect } = require('chai')
const chai = require('chai')
const chaiHttp = require('chai-http')

const app = require('../src/app')

chai.use(chaiHttp)

let taroCardApp

describe('User server tests', function () {
  before(function () {
    taroCardApp = new app.TaroCardApp()
    taroCardApp.run()
  })

  it('Test connection to app', function () {
    return chai.request(taroCardApp.app).get('/debug/connect').then((res) => {
      assert.equal(res.text, 'connected')
    })
  })

  describe('Test Sign up', function () {
    it('Test post new user', function () {
      // return chai.request(taroCardApp.app).get('/')
    })
  })

  after(function () {
    // taroCardApp.server.close()
    // taroCardApp.db.close()
  })
})
