/* This has been commented out but can later be used to recommend certain users.
const body = document.querySelector('body');

let request = new XMLHttpRequest();
request.open('GET', 'https://my-json-server.typicode.com/VitalKilla/userData/db', true);
request.responseType = 'json';
request.send();

request.onload = function() {
    const users = request.response;
    populateFriends(users);
}
*/

// function is used to fill page with list of friends from a json file.
function populateFriends(obj) {
    let template, divAll, div, divCopy, divHeader, divHeaderCopy, currentLetter, char;
    divAll = document.createElement("div");
    divAll.id = "UsersAll";
    template = document.getElementById('UsersTemp');
    div = template.content.querySelector(".UserElement");
    divHeader = template.content.querySelector("#headerElement")
    const users = obj.users;
    currentLetter = users[0]["display name"].charAt(0);
    divHeaderCopy = document.importNode(divHeader, true);
    divHeaderCopy.querySelector("h1").textContent = currentLetter;
    divAll.appendChild(divHeaderCopy);
    for(let i = 0; i < users.length; i++) {
        divCopy = document.importNode(div, true);
        // char refers to first letter of current users display name
        char = users[i]["display name"].charAt(0);
        if (currentLetter !== char) {
           currentLetter = char;
           divHeaderCopy = document.importNode(divHeader, true);
           divHeaderCopy.querySelector("h1").textContent = currentLetter;
           divAll.appendChild(divHeaderCopy);
        }
        divCopy.querySelector("img", true).src = users[i]["image url"];
        divCopy.querySelector("h2",true).textContent = users[i]["display name"];
        divCopy.querySelector("h3",true).textContent = users[i]["username"];
        divAll.appendChild(divCopy);
        body.appendChild(divAll);
    }
}

function afterSearchDisplay() {
    document.getElementById("UsersAll").style.display = "none";
}