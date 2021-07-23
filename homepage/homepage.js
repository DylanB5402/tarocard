function openCardCreate(){
    document.getElementById('id01').style.display='block';
    document.getElementById('add-card-btn').style.display='none';
    if( document.getElementById('id01').classList.contains('dezoom')){
        document.getElementById('id01').classList.remove('dezoom');
    }
    document.getElementById('id01').classList.add('animate');
}

function closeCardCreate(){
    document.getElementById('id01').classList.remove('animate');
    document.getElementById('id01').classList.add('dezoom');
    setTimeout(function(){
        console.log("We did it bitches");
        document.getElementById('id01').style.display='none';

    },500);
    document.getElementById('add-card-btn').style.display='block';
}
/* 
* Request from server the cards information 
* Then add that information into the cards
* After insertion of information, insert card into div "card-container"
*/

let cardDiv = document.getElementById("cardContainer");

function createCard(establishment, drink, description,){
    /* first step is to get the template*/
    let template = document.getElementById('card-template');
    let tcontent = template.content.querySelector('div');
    let divCopy = document.importNode(tcontent,true);
    /* Adds the class 'card-template' so cards will look like actual template'*/
    divCopy.classList.add('card-template');

    /* Changes fields */

     divCopy.querySelector("#establishment").innerHTML = establishment; //establishment
     divCopy.querySelector("#drink").innerHTML = drink; //drinks
     divCopy.querySelector("#description").innerHTML = description; //description
     divCopy.querySelector('div').querySelector('img').setAttribute("src","https://hatrabbits.com/wp-content/uploads/2017/01/random.jpg");

    /*Adds the card to the card container div */
    cardDiv.appendChild(divCopy);
}


/*Accessing server and putting information into cards // taken from Johnothan's friendpage*/
let request = new XMLHttpRequest();
request.open('GET', 'https://my-json-server.typicode.com/shadydrako/cardData/db', true);
request.responseType = 'json';
request.send();

request.onload = function() {
    const cards = request.response.cards;
    for(let i = 0; i < cards.length; i++) {
        let x =  cards[i]["Name of Establishment"];
        let y = cards[i]["Name of Order"];
       let z =cards[i]["Description"];
       createCard(x,y,z);
       console.log(i);
    }
}
