let addFriends = document.getElementById("cardContainer");
  
/*Accessing server and putting information into cards // taken from Johnothan's friendpage*/
let friends = new XMLHttpRequest();
friends.open('GET', 'https://my-json-server.typicode.com/shadydrako/cardData/cards', true); 
friends.responseType = 'json';
friends.send();

friends.onload = function () {
  const friendCards = friends.response;
  console.log(friendCards)
  for(let i = 0; i < 2;i++){
    let a,b,c,d;
    a = friendCards[i]["Name of Establishment"];
    b = friendCards[i]["Name of Order"];
    c = friendCards[i]["Description"];
    d = friendCards[i]["id"];
    createFriendCard(a, b, c, '../assets/pfp-placeholder.png', d)
  }
}

/* Function created to help with creating cards for other pages
*  Styling needed for each one, thus the class added to them so everyone might
*  need to add the stylesheet for cards if they plan to have cards
*/

function createFriendCard(establishment, drink, description, image, drinkId){
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


  let addToGroupbtn = document.createElement('p');
  addToGroupbtn.classList.add('add-gO-btn-friend');
  addToGroupbtn.style.display = "block";
      /* Open Group Add Form  */
  addToGroupbtn.onclick = function ( drinkID, userID ){
      document.getElementById("groupOrder-add").style.display = 'block';
      document.getElementById("gO-drinkID").value = drinkId;
      //document.getElementById("gO-userID").value = userID; unsure how to get USERID
    }
  addToGroupbtn.innerHTML = "+";

  tagContainer.appendChild(pfp);

  container.appendChild(estab);
  container.appendChild(d);
  container.appendChild(desc);
  container.appendChild(tagContainer);
  container.appendChild(addToGroupbtn);
  document.getElementById('cardContainer').appendChild(container);
}