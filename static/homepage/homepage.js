function openCardCreate () {
  document.getElementById('id01').style.display = 'block'
  document.getElementById('add-card-btn').style.display = 'none'
  if (document.getElementById('id01').classList.contains('dezoom')) {
    document.getElementById('id01').classList.remove('dezoom')
  }
  document.getElementById('id01').classList.add('animate')
}

function closeCardCreate () {
  document.getElementById('id01').classList.remove('animate')
  document.getElementById('id01').classList.add('dezoom')
  setTimeout(function () {
    console.log('We did it bitches')
    document.getElementById('id01').style.display = 'none'
  }, 500)
  document.getElementById('add-card-btn').style.display = 'block'
}
/*
* Request from server the cards information
* Then add that information into the cards
* After insertion of information, insert card into div "card-container"
*/

const cardDiv = document.getElementById('cardContainer')

function createCard (establishment, drink, description) {
  /* first step is to get the template */
  const template = document.getElementById('card-template')
  const tcontent = template.content.querySelector('div')
  const divCopy = document.importNode(tcontent, true)
  /* Adds the class 'card-template' so cards will look like actual template' */
  divCopy.classList.add('card-template')

  /* Changes fields */

  divCopy.querySelector('#establishment').innerHTML = establishment // establishment
  divCopy.querySelector('#drink').innerHTML = drink // drinks
  divCopy.querySelector('#description').innerHTML = description // description
  divCopy.querySelector('div').querySelector('img').setAttribute('src', 'https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg')

  /* Adds the card to the card container div */
  cardDiv.appendChild(divCopy)
}

/* Accessing server and putting information into cards // taken from Johnothan's friendpage */
const request = new XMLHttpRequest()
request.open('GET', '/drinks/', true)
request.responseType = 'json'
request.send()

request.onload = function () {
  const cards = request.response.drinks
  console.log(cards)
  for (const drinkCard in cards) {
    console.log(drinkCard)
    const x = cards[drinkCard]['establishment']
    const y = cards[drinkCard]['name']
    const z = cards[drinkCard]['desc']
    createCard2(x, y, z, '../assets/pfp-placeholder.png')
  }
}

/* Function created to help with creating cards for other pages
*  Styling needed for each one, thus the class added to them so everyone might
*  need to add the stylesheet for cards if they plan to have cards
*/

function createCard2 (establishment, drink, description, image) {
  const container = document.createElement('div') // This creates div element
  container.classList.add('card-template')
  /* Create establishment element */
  const estab = document.createElement('h1')
  estab.classList.add('fonts')
  estab.innerHTML = establishment
  /* Create drink element */

  const d = document.createElement('h2')
  d.classList.add('fonts')
  d.innerHTML = drink

  /* Create description element */

  const desc = document.createElement('h2')
  desc.classList.add('fonts')
  desc.style = 'font-weight: 100'
  desc.innerHTML = description

  /* Create tag container */

  const tagContainer = document.createElement('div')
  tagContainer.classList.add('tag-container')

  /* profile picture */
  const pfp = document.createElement('img')
  pfp.classList.add('pfp-pic')
  pfp.setAttribute('src', image)

  tagContainer.appendChild(pfp)

  container.appendChild(estab)
  container.appendChild(d)
  container.appendChild(desc)
  container.appendChild(tagContainer)
  document.getElementById('cardContainer').appendChild(container)
}

