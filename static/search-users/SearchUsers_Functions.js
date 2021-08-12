
const body = document.querySelector('body');
/* This has been commented out but can later be used to recommend certain users.


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
function populateUsers(obj) {
    let template, divAll, div, divCopy;
    divAll = document.getElementById('UsersAll')
    // divAll = document.createElement("div");
    // divAll.id = "UsersAll";
    $("#UsersAll").empty();
    template = document.getElementById('UsersTemp');
    div = template.content.querySelector(".UserElement");
    const users = obj.users;
    for (let i = 0; i < users.length; i++) {
        divCopy = document.importNode(div, true);
        divCopy.querySelector("img", true).src = users[i]["image url"];
        divCopy.querySelector("h2", true).textContent = users[i]["display name"];
        divCopy.querySelector("h3", true).textContent = users[i]["username"];
        divAll.appendChild(divCopy);
        body.appendChild(divAll);
    }
}

function afterSearchDisplay() {
    document.getElementById("UsersAll").style.display = "none";
}