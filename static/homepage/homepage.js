

function openCardCreate( formID){
  document.getElementById(formID).style.display='block';
  document.getElementById('add-card-btn').style.display='none';
  if( document.getElementById(formID).classList.contains('dezoom')){
      document.getElementById(formID).classList.remove('dezoom');
  }
  document.getElementById("modal-sheet").style.display="none";
  document.getElementById(formID).classList.add('animate');
}

function closeCardCreate( formID ){
  document.getElementById(formID).classList.remove('animate');
  document.getElementById(formID).classList.add('dezoom');
  setTimeout(function(){
      console.log("We did it bitches");
      document.getElementById(formID).style.display='none';

  },500);
  document.getElementById('add-card-btn').style.display='block';
}



/* 
* Request from server the cards information 
* Then add that information into the cards
* After insertion of information, insert card into div "card-container"
*/

let cardDiv = document.getElementById("cardContainer");

function createCard(establishment, drink, description){
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
request.open('GET', 'https://my-json-server.typicode.com/shadydrako/cardData/cards', true); //change to /cards/ for Alex later
request.responseType = 'json';
request.send();

request.onload = function() {
  /* This should be the array of cards */
  const cards = request.response; 
  /*getAllDrinks(uid) */
  console.log(cards);
  for(let i = 0; i < cards.length; i++) {
         const cards = request.response.cards;
          for(let i = 0; i < cards.length; i++) {
              let u = cards[i]["drink_id"];
              let x =  cards[i]["establishment"];
              let y = cards[i]["name"];
              let z =cards[i]["desc"];
              createCard(x,y,z,"../assets/pfp-placeholder.png",u);
              console.log(i);
          }
     createCard2(x,y,z,"../assets/pfp-placeholder.png"); //drink_img
     console.log(i);
  }
}

/* Function created to help with creating cards for other pages
*  Styling needed for each one, thus the class added to them so everyone might
*  need to add the stylesheet for cards if they plan to have cards
*/

function createCard2(establishment, drink, description, image, drinkId){
  const container = document.createElement("div"); //This creates div element
  container.classList.add("card-template");
  /* Create establishment element */
  let estab = document.createElement("h1");
  estab.classList.add("fonts");
  estab.innerHTML = establishment;
  /* Create drink element */
  let d = document.createElement("h2");
  d.classList.add("fonts");
  d.innerHTML = drink;

  /* Create description element */

  let desc = document.createElement("h2");
  desc.classList.add("fonts");
  desc.classList.add("description");
  desc.style = "font-weight: 100";
  desc.innerHTML = description;

  /*Create tag container*/

  let tagContainer = document.createElement("div");
  tagContainer.classList.add("tag-container");

  /* profile picture */
  let pfp = document.createElement("img");
  pfp.classList.add("pfp-pic");
  pfp.setAttribute("src", image);

  /* Options Button */
  let options = document.createElement("img");
  options.src = "../assets/menu-button.png";
  options.classList.add("option-btn");
  options.onclick = function(event){
      openCardCreate("updateCard");
      let form = document.getElementById('updateCard');
      /* 
      form.setAttribute("action", "/{id}/edit_drink_card");
      */
      let estabInput = document.getElementById("estabInput");
      estabInput.value = establishment;
      let orderInput = document.getElementById("orderInput");
      orderInput.value = drink;
      let descInput = document.getElementById("descInput");
      descInput.value = description;

      form.action = "/drinks/editDrinkCard/" + drinkId;

  }

  tagContainer.appendChild(pfp);

  container.appendChild(estab);
  container.appendChild(options)
  container.appendChild(d);
  container.appendChild(desc);
  container.appendChild(tagContainer);
  document.getElementById('cardContainer').appendChild(container);
}

/* Function to Create a Group Card Div */ 
/* add parameters so that it goes to a different page depending on group order */
function createGroupCard(){
  const link = document.createElement('a'); // creates a link 
  link.style.textDecoration = 'none'
  link.href="groupOrderView.html";
  const container = document.createElement('div') // creates div element
  link.appendChild(container); //this will put the div into the link

  container.classList.add('group-card');
  container.style.alignItems = "center";

  let groupImage = document.createElement('img');
  groupImage.src ="../assets/group-order.png"; //this should be replaced with variable
  groupImage.style.width="50px"

  let groupName = document.createElement('h1');
  groupName.classList.add('fonts');
  groupName.style.color ='white';
  groupName.innerHTML = 'Hello World 2' //This should also be replaced with variable
  
  let optionLink = document.createElement('a');
  optionLink.href = "./groupOrder-edit.html";
  let options = document.createElement("img");
  options.src = "../assets/menu-button.png";
  options.classList.add("option-btn");
  optionLink.appendChild(options)
  container.appendChild(groupImage);
  container.appendChild(groupName);
  container.appendChild(optionLink);
  document.getElementById('cardContainer').appendChild(link);

  container.onclick = function(event){
      if(event.target.classList.contains("option-btn")){
          window.location.replace("http://www.w3schools.com")
      }
  }
}

createGroupCard()



/* Open Modal Sheet */

function openModalSheet(){
  document.getElementById("modal-sheet").classList.add('slide-in');
  document.getElementById("modal-sheet").classList.remove('slide-out');
  document.getElementById("modal-sheet").style.display= 'block';
  document.getElementById('add-card-btn').style.display='none';
}

function closeModalSheet(){
  if( document.getElementById("modal-sheet").style.display == "block"){
      document.getElementById("modal-sheet").classList.remove("slide-in");
      document.getElementById("modal-sheet").classList.add('slide-out');
      setTimeout(function(){
          document.getElementById('modal-sheet').style.display='none';
      },200);

      document.getElementById("add-card-btn").style.display ="block";
  }
}

document.addEventListener('click',function(event){
  let OptionsBtn = document.getElementById("add-card-btn");
  let sheet = document.getElementById("modal-sheet");
  if( OptionsBtn.contains(event.target)){
      openModalSheet();
  } else {
      if( sheet.style.display == "block"){
          closeModalSheet();
      }
  }
});


