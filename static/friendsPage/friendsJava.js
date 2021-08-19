
const body = document.querySelector('body')

const request = new XMLHttpRequest()
request.open('GET', '/friends/current', true)
request.responseType = 'json'
request.send()

request.onload = function () {
  const users = request.response
  populateFriends(users)
}

// function is used to fill page with list of friends from a json file.
function populateFriends (obj) {
  let template, divAll, div, divCopy, divHeader, divHeaderCopy, currentLetter, char
  divAll = document.createElement('div')
  divAll.id = 'friendsAll'
  template = document.getElementById('friendsTemp')
  div = template.content.querySelector('.friendElement')
  divHeader = template.content.querySelector('#headerElement')
  const users = obj.users
  currentLetter = users[0]['display name'].charAt(0).toUpperCase()
  divHeaderCopy = document.importNode(divHeader, true)
  divHeaderCopy.querySelector('h1').textContent = currentLetter
  divAll.appendChild(divHeaderCopy)
  for (let i = 0; i < users.length; i++) {
    divCopy = document.importNode(div, true)
    char =  users[i]['display name'].charAt(0).toUpperCase()
    if (currentLetter !== char) {
      currentLetter = char
      divHeaderCopy = document.importNode(divHeader, true)
      divHeaderCopy.querySelector('h1').textContent = currentLetter
      divAll.appendChild(divHeaderCopy)
    }
    divCopy.querySelector('img', true).src = users[i]['image url']
    divCopy.querySelector('h2', true).textContent = users[i]['display name']
    divCopy.querySelector('h3', true).textContent = users[i].username;
    let links = divCopy.querySelectorAll(".userProLink");
    links.forEach(element => {
        element.href = "/profile/" + users[i]["id"];
    });
    divAll.appendChild(divCopy)
    body.appendChild(divAll)
  }
}

function searchFriends (obj) {
  let template, divAll, div, divCopy, divHeader, divHeaderCopy, currentLetter, char
  divAll = document.getElementById('friendsAll')
  divAll.innerHTML = ''
  template = document.getElementById('friendsTemp')
  div = template.content.querySelector('.friendElement')
  divHeader = template.content.querySelector('#headerElement')
  const users = obj.users
  if (users[0] === undefined) {
    return undefined;
  }
  currentLetter = users[0]['display name'].charAt(0).toUpperCase()
  divHeaderCopy = document.importNode(divHeader, true)
  divHeaderCopy.querySelector('h1').textContent = currentLetter
  divAll.appendChild(divHeaderCopy)
  for (let i = 0; i < users.length; i++) {
    divCopy = document.importNode(div, true)
    // char refers to first letter of current users display name
    char = users[i]['display name'].charAt(0).toUpperCase()
    if (currentLetter !== char) {
      currentLetter = char
      divHeaderCopy = document.importNode(divHeader, true)
      divHeaderCopy.querySelector('h1').textContent = currentLetter
      divAll.appendChild(divHeaderCopy)
    }
    divCopy.querySelector('img', true).src = users[i]['image url'];
    divCopy.querySelector('h2', true).textContent = users[i]['display name'];
    divCopy.querySelector('h3', true).textContent = users[i].username;
    let links = divCopy.querySelectorAll(".ActivityLinks");
    links.forEach(element => {
        element.href = "/profile/" + users[i]["id"];
    });
    divAll.appendChild(divCopy)
    body.appendChild(divAll)
  }
}
