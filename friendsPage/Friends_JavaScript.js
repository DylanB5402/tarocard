
const body = document.querySelector('body');

let request = new XMLHttpRequest();
request.open('GET', 'https://my-json-server.typicode.com/VitalKilla/userData/db', true);
request.responseType = 'json';
request.send();

request.onload = function() {
    const users = request.response;
    populateFriends(users);
}


function populateFriends(obj) {
    let template, div, divCopy;
    template = document.getElementById('friendsTemp');
    div = template.content.querySelector("div");
    const users = obj.users;
    for(let i = 0; i < users.length; i++) {
        divCopy = document.importNode(div, true);
        divCopy.querySelector("img", true).src = users[i]["image url"];
        divCopy.querySelector("h2",true).textContent = users[i]["display name"];
        divCopy.querySelector("h3",true).textContent = users[i]["username"];
        body.appendChild(divCopy);
    }
}