// const wtf = require('wtfnode')

const { assert } = require('chai')
// const expect = require('chai').expect
// const chai = require('chai')
const request = require('supertest')

const app = require('../src/app')

describe('Test App', function() {

    const taroApp = new app.TaroCardApp('databases/test_server.db')
    taroApp.run()
    const agent = request.agent(taroApp.app)

    it("test connection", function(done) {
        agent.get('/debug/connect').end((err, res) => {
            // console.log(res)
            assert.equal(res.text, "connected")
            return done()
        })
    })

    after((done)=> {
        taroApp.server.close(done)
        taroApp.db.close()
        taroApp.store.knex.destroy()
        // setTimeout(() => {
        //     wtf.dump()    
        // }, 1000)
        
    })
})
