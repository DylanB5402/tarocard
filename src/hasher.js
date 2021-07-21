const bcrypt = require('bcrypt')

const start = Date.now()
const hash = bcrypt.hashSync('p4ssword192_', 10)
console.log(Date.now() - start)
console.log(hash)

const taco = async (a, b, c) => {
  console.log(a, b, c)
}

taco(1, 2, 3)
