const axios = require('axios').default

// names taken from https://www.ssa.gov/oact/babynames/
const names = ['Olivia', 'Emma', 'Ava', 'Charlotte', 'Sophia', 'Liam', 'Noah', 'Oliver', 'Elijah', 'William']

names.forEach((name) => {
  axios.post('http://localhost:3000/signup',
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
axios.get('http://localhost:3000/debug/users/json').then((res) => {
  userIdJSON = res.data
  // console.log(res)
}).then((res) => {
  // console.log(userIdJSON.Olivia)
  names.forEach((name) => {
    axios.post('http://localhost:3000/debug/addFriend',
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
    axios.post('http://localhost:3000/debug/addFriend',
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
