const express = require('express')

const app = express()
const port = 3000

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get('/', (req, res) => {
  res.json({
    users: [
	  {
	    'display name': 'Avery',
	    username: '@sweetTooth49',
	    'image url': 'https://cdna.artstation.com/p/assets/images/images/019/293/032/large/kiki-andriansyah-hex-y.jpg?1562838735'
	  },
	  {
	    'display name': 'jay',
	    username: '@flowerPower',
	    'image url': 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/4e795204-5695-4330-9f4f-7ea75454aebb/dcwpjst-fa6af0c1-9090-4ca2-87ad-ac95e3b4f7a4.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzRlNzk1MjA0LTU2OTUtNDMzMC05ZjRmLTdlYTc1NDU0YWViYlwvZGN3cGpzdC1mYTZhZjBjMS05MDkwLTRjYTItODdhZC1hYzk1ZTNiNGY3YTQucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.b6j_C5Uw3OhEyG6MXRXkirYPjbbr75HJyh1Tu1W4aRU'
	  },
	  {
	    'display name': 'Ravi',
	    username: '@GitDrink',
	    'image url': 'https://wallpapercave.com/wp/wp8040223.jpg'
	  }
    ]
  })
})

app.post('/', (req, res) => {
  console.log(req.body)
  // console.log(req.body['687'])
  resp = ''
  option = req.body.option
  if (option == 'one') {
    resp = 'taco'
  } else if (option == 'two') {
    resp = 'potato'
  }
  res.send(resp)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
