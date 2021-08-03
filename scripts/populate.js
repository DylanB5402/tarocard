const axios = require('axios').default

const names = ['Olivia', 'Emma', 'Ava', 'Charlotte', 'Sophia', 'Liam', 'Noah', 'Oliver', 'Elijah', 'William']

names.forEach((name) => {
  axios.post('http://localhost:3000/signup',
    {
      email: name,
      username: name,
      password: 'password',
      repeatPassword: 'password'
    }).then((res) => {
    console.log('successfully sign up ' + name)
  }).catch((error) => {
    console.log(error)
  })
})

let userIdJSON
axios.get('http://localhost:3000/debug/users/json').then((res) => {
  userIdJSON = res.data
  console.log(res)
}).then((res) => {
  console.log(userIdJSON.Olivia)
  names.forEach((name) => {
    // axios.post('http://localhost:3000/debug/addFriend', {})
  })
})
