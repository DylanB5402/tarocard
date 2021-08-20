const axios = require('axios').default

// names taken from https://www.ssa.gov/oact/babynames/
const names = ['Olivia@email.com', 'Emma@email.com', 'Ava@email.com', 'Charlotte@email.com', 'Sophia@email.com', 'Liam@email.com', 'Noah@email.com', 'Oliver@email.com', 'Elijah@email.com', 'William@email.com']

const url = 'http://localhost:3000'
// var url = 'http://132.249.242.96'

names.forEach((name) => {
  axios.post(url + '/signup',
    {
      email: name,
      username: name.slice(0, -10),
      password: 'password',
      repeatPassword: 'password'
    }).then((res) => {
    // console.log('successfully sign up ' + name)
    // console.log(name.slice(0, -10))
  }).catch((error) => {
    if (error) {
      console.log(error)
    }
  })
})

let userIdJSON
axios.get(url + '/debug/users/json').then((res) => {
  userIdJSON = res.data
}).then((res) => {
  names.forEach((name) => {
    axios.post(url + '/debug/addFriend',
      {
        uid: userIdJSON.Olivia,
        friend_uid: userIdJSON[name.slice(0, -10)],
        status: 'friends'
      }).then((res) => {
      // console.log(userIdJSON)
    }).catch((err) => {
      console.log(err)
    })
  })
  for (let i = 1; i < names.length; i++) {
    console.log(names[i])
    // console.log(userIdJSON[names[i].slice(0, -10)])
    axios.post(url + '/debug/addFriend',
      {
        uid: userIdJSON.Emma,
        friend_uid: userIdJSON[names[i].slice(0, -10)],
        status: 'friends'
      }).then((res) => {
    }).catch((err) => {
      console.log(err)
    })
  }
})
