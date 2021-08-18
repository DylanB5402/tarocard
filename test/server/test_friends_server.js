const { assert, expect } = require('chai')
const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)
const session = require('supertest-session')

const app = require('../../app/app')

// const authenticatedSession = null

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

  it('test send friend request success', function (done) {
    taroSession.post('/friends/test/request/1/2').end((err, res) => {
      if (err) { console.log(err) }
      assert.equal(res.text, 'success')
    })
    return done()
  })

  it('test send friend request failure', function (done) {
    taroSession.post('/friends/test/request/1/2').end((err, res) => {
      if (err) { console.log(err) }
      assert.equal(res.text, 'failure')
    })
    return done()
  })

  it('test accept friend request', function (done) {
    taroSession.post('/friends/test/request/2/3').end((err, res) => {
      if (err) { console.log(err) }
      taroSession.post('/friends/test/accept/3/2').end((err, res) => {
        if (err) { console.log(err) }
        assert.equal(res.text, 'success')
        return done()
      })
    })
  })

  it('test outgoing friends', function (done) {
    taroSession.post('/friends/test/request/6/7').end((err, res) => {
      if (err) { console.log(err) }
      taroSession.post('/friends/test/request/6/8').end((err, res) => {
        if (err) { console.log(err) }
        taroSession.post('/friends/test/request/6/9').end((err, res) => {
          if (err) { console.log(err) }
          taroSession.post('/friends/test/request/6/10').end((err, res) => {
            if (err) { console.log(err) }
            taroSession.post('/friends/outgoing/6').end((err, res) => {
              if (err) { console.log(err) }
              const friendsArr = JSON.parse(res.text).friend_ids
              expect(friendsArr).to.be.containingAllOf([7, 8, 9, 10])
              return done()
            })
          })
        })
      })
    })
  })

  it('test incoming friends', function (done) {
    taroSession.post('/friends/test/request/7/11').end((err, res) => {
      if (err) { console.log(err) }
      taroSession.post('/friends/test/request/8/11').end((err, res) => {
        if (err) { console.log(err) }
        taroSession.post('/friends/test/request/9/11').end((err, res) => {
          if (err) { console.log(err) }
          taroSession.post('/friends/test/request/10/11').end((err, res) => {
            if (err) { console.log(err) }
            taroSession.post('/friends/incoming/11').end((err, res) => {
              if (err) { console.log(err) }
              const friendsArr = JSON.parse(res.text).friend_ids
              expect(friendsArr).to.be.containingAllOf([7, 8, 9, 10])
              return done()
            })
          })
        })
      })
    })
  })

  after((done) => {
    taroApp.server.close(done)
    taroApp.store.knex.destroy()
  })
})
