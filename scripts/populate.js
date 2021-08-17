const axios = require('axios').default

// names taken from https://www.ssa.gov/oact/babynames/
const names = ['Olivia', 'Emma', 'Ava', 'Charlotte', 'Sophia', 'Liam', 'Noah', 'Oliver', 'Elijah', 'William']

var url = 'http://localhost:3000'
// var url = 'http://132.249.242.96'

names.forEach((name) => {
  axios.post(url + '/signup',
    {
      email: name,
      username: name,
      password: 'password',
      repeatPassword: 'password'
    }).then((res) => {
    // console.log('successfully sign up ' + name)
  }).catch((error) => {
    if (error) {
      console.log(error)
    }
  })
})

let userIdJSON
axios.get(url + '/debug/users/json').then((res) => {
  userIdJSON = res.data
  // console.log(res)
}).then((res) => {
  // console.log(userIdJSON.Olivia)
  names.forEach((name) => {
    axios.post(url + '/debug/addFriend',
      {
        uid: userIdJSON.Olivia,
        friend_uid: userIdJSON[name],
        status: 'friends'
      }).then((res) => {
    }).catch((err) => {
      console.log(err)
    })
  })
  for (let i = 1; i < names.length; i++) {
    console.log(names[i])
    axios.post(url + '/debug/addFriend',
      {
        uid: userIdJSON.Emma,
        friend_uid: userIdJSON[names[i]],
      status: 'friends'
      }).then((res) => {
    }).catch((err) => {
      console.log(err)
    })
  }
})
