let addFriends = document.getElementById("cardContainer");
  
/*Accessing server and putting information into cards // taken from Johnothan's friendpage*/
let friends = new XMLHttpRequest();
friends.open('GET', '/getFavDrinks', true); 
friends.responseType = 'json';
friends.send( JSON.stringify({id: friendUID}));

async function getEstabName(estabID){
  let response = await fetch("/establishments/get/"+estabID);
  let data = await response.json()
  return data.name;
}

friends.onload = async function () {
  const friendCards = friends.response.drinks;
  for (const drinkCard in friendCards) {
    let drinkEst = friendCards[drinkCard]['establishment'];
    drinkEst = await getEstabName(drinkEst);
    const drinkName = friendCards[drinkCard]['drink name'];
    const drinkDesc = friendCards[drinkCard]['drink desc'];
    const drinkId = friendCards[drinkCard]['drink id'];
    const friendUID = friendCards[drinkCard]['friend uid'];
    const imageURL = friendCards[drinkCard]['image url'];
    const cardDate = friendCards[drinkCard]['date'];
    createFriendCard(drinkEst, drinkName, drinkDesc, '../assets/pfp-placeholder.png', drinkId, friendUID,cardDate);
  }
}

/* Function created to help with creating cards for other pages
*  Styling needed for each one, thus the class added to them so everyone might
*  need to add the stylesheet for cards if they plan to have cards
*/

function createFriendCard(establishment, drink, description, image, drinkId,friendUID,cardDate){
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
      document.getElementById("gO-userID").value = friendUID;
    }
  addToGroupbtn.innerHTML = "+";

  let date = document.createElement('h2');
  date.innerHTML = "created: " + cardDate;
  date.classList.add('card-date');
  date.style.color = "rgba(0, 0, 0,0.5)";

  tagContainer.appendChild(pfp);
  container.appendChild(estab);
  container.appendChild(d);
  container.appendChild(desc);
  container.appendChild(tagContainer);
  container.appendChild(addToGroupbtn);
  container.appendChild(date);

  document.getElementById('cardContainer').appendChild(container);
}