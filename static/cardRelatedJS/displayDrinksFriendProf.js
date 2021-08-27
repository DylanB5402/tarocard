let frienduid = document.currentScript.getAttribute('friendUID');
let cardDiv = document.getElementById("cardContainer");
/*Accessing server and putting information into cards // taken from Johnothan's friendpage*/
let friends = new XMLHttpRequest();
friends.open('GET', '/drinks/getFavDrinks/'+frienduid, true); 
friends.responseType = 'json';
friends.send();

async function getEstabName(estabID){
  let response = await fetch("/establishments/get/"+estabID);
  let data = await response.json()
  return data.name;
}

friends.onload = async function () {
  const friendCards = friends.response.drinks;
  let currentLetter = "-2"; //idk lmao
  let favsExist = false;
  for (const drinkCard in friendCards) {
    let drinkEst = friendCards[drinkCard]['establishment'];
    drinkEst = await getEstabName(drinkEst);
    const drinkName = friendCards[drinkCard]['name'];
    const drinkDesc = friendCards[drinkCard]['desc'];
    const drinkId = friendCards[drinkCard]['id'];
    const friendUID = friendCards[drinkCard]['friend uid'];
    const imageURL = friendCards[drinkCard]['image url'];
    console.log(imageURL)
    const friendPFP = friendCards[drinkCard]['pfp'];
    console.log(friendPFP);
    const cardDate = friendCards[drinkCard]['date'];
    const fav = friendCards[drinkCard]['fav']

    if( fav == false && drinkEst.charAt(0).toUpperCase() !== currentLetter){
      console.log(drinkEst);
      currentLetter = drinkEst.charAt(0).toUpperCase();    
      let letterBar = document.createElement('div');
      letterBar.id = "headerElement";
      let letterHeading = document.createElement('h1');
      letterHeading.id="letterHeading";
      letterHeading.innerHTML = currentLetter;
      let headingLine = document.createElement('hr');
      headingLine.id = "headingLine";

      letterBar.appendChild(letterHeading);
      letterBar.appendChild(headingLine);
      cardDiv.appendChild(letterBar);
  }

  if( favsExist == false &&  fav == true ){
      favsExist = true;
      let favSection = document.createElement('div');
      favSection.id = 'favoritesSection';
      let favoriteStar = document.createElement('img');
      favoriteStar.id = "favoritesStar";
      favoriteStar.src ="../assets/star-purple.png";
      let favText = document.createElement('p');
      favSection.appendChild(favoriteStar);
      favText.id="favorites";
      favText.innerHTML = "Favorites"
      favSection.appendChild(favText);
      let bar = document.createElement('hr');
      bar.style.width = "100%";
      bar.style.height = "0.1px";
      favSection.appendChild(bar);
      document.getElementById('cardContainer').appendChild(favSection);
  }
    createFriendCard(drinkEst, drinkName, drinkDesc, friendPFP, drinkId, frienduid,cardDate,fav);
  }
}

/* Function created to help with creating cards for other pages
*  Styling needed for each one, thus the class added to them so everyone might
*  need to add the stylesheet for cards if they plan to have cards
*/

function createFriendCard(establishment, drink, description, image, drinkId,friendUID,cardDate,fav){
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
  date.style.fontSize = "20px"


  container.appendChild(estab);
  container.appendChild(d);
  container.appendChild(desc);
  container.appendChild(addToGroupbtn);
  container.appendChild(date);

  document.getElementById('cardContainer').appendChild(container);
}