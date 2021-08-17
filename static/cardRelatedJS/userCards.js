/* GENERATES USER'S CARDS */
/* 
  * Request from server the cards information 
  * Then add that information into the cards
  * After insertion of information, insert card into div "card-container"
  */
  
let cardDiv = document.getElementById("cardContainer");
  
/*Accessing server and putting information into cards // taken from Johnothan's friendpage*/
let request = new XMLHttpRequest();
request.open('GET', '/drinks', true); 
request.responseType = 'json';
request.send();

request.onload = function () {
  const cards = request.response.drinks;
  let currentLetter;
  for (const drinkCard in cards) {
    console.log(drinkCard)
    const drinkEst = cards[drinkCard]['establishment'];
    const drinkName = cards[drinkCard]['name'];
    console.log(drinkName);
    const drinkDesc = cards[drinkCard]['desc'];
    const drinkId = cards[drinkCard]['id'];
    console.log(drinkId);
    const ifFav = cards[drinkCard]['fav'];
    if( ifFav == false){
        currentLetter = cards[drinkCard]['name'].charAt(0);
        console.log(currentLetter);
    }
    createUserCard(drinkEst, drinkName, drinkDesc, '../assets/pfp-placeholder.png', drinkId, ifFav);
  }
}

/* CREATE CARD FUNCTION FOR THE SPECIFIC USER
*  Function created to help with creating cards for other pages
*  Styling needed for each one, thus the class added to them so everyone might
*  need to add the stylesheet for cards if they plan to have cards
*/

function createUserCard(establishment, drink, description, image, drinkId,ifFav){
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
  let edit = document.createElement("img");
  edit.src = "../assets/edit.png";
  edit.classList.add("option-btn");
  edit.style.display = "none"
  edit.onclick = function(event){
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

      let drinkID = document.getElementById("drinkId"); //delete these two
      drinkID.value = drinkId;

      form.action = "/drinks/editDrinkCard/" + drinkId;
  }

  let options = document.createElement("img");
  options.src = "../assets/menu-button.png";
  options.classList.add("option-btn");
  options.onclick = function () {
    edit.style.display = 'block';
    addToGroupbtn.style.display = "block";
    deleteBtn.style.display = "block";
    options.style.display = "none";
    closeMenu.style.display = "block";
    favOption.style.display = "none";

  }

  /* Make the other buttons appear  */

  let closeMenu = document.createElement("img");
  closeMenu.src = "../assets/denyX.png";
  closeMenu.classList.add("option-btn");
  closeMenu.style.display = "none"
  closeMenu.style.left = "70%"
  closeMenu.style.width = "20px"
  closeMenu.style.height = "20px";
  closeMenu.onclick = function () {
    options.style.display = "block";
    edit.style.display = 'none';
    addToGroupbtn.style.display = "none";
    deleteBtn.style.display = "none";
    closeMenu.style.display = "none";
    favOption.style.display = "none";
  }
  /* Delete Card for User */
  let deleteBtn = document.createElement("img");
  deleteBtn.src="../assets/trash-icon.png";
  deleteBtn.classList.add("trash-card");
  deleteBtn.style.display = "none";
  deleteBtn.style.left = "78%";
  deleteBtn.style.marginTop = "10px";

  deleteBtn.onclick = function(){
      container.style.display = "none";
      /* Sending a delete request with this button */

      console.log(drinkId) //debug

      fetch( "/drinks/deleteDrink/"+ drinkId ,{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: drinkId}) //sending drinkID 
      }); 
  }

  /*Add to a group Button */
  let addToGroupbtn = document.createElement('p');
  addToGroupbtn.classList.add('add-gO-btn');
  addToGroupbtn.style.display = "none";
      /* Open Group Add Form  */
  addToGroupbtn.onclick = function ( drinkID, userID ){
      document.getElementById("groupOrder-add").style.display = 'block';
      document.getElementById("gO-drinkID").value = drinkId;
    }
  addToGroupbtn.innerHTML = "+";

  /* Favorite Option */
  let favOption = document.createElement("img");
  let fav = ifFav;
  if( fav ){
    favOption.src= "../assets/star.png";
  }else{
    favOption.src= "../assets/gray-star.png"
  }
  favOption.classList.add("option-btn");
  favOption.style.left = "90%";
  favOption.style.top = "65%";
  favOption.style.width = "30px";
  favOption.style.height = "30px";
  favOption.style.position = "absolute";


  favOption.onclick = function (){
    if( fav ){
      fav = false;
      favOption.src= "../assets/gray-star.png";
      fetch( "/drinks/unstarDrink/"+ drinkId ,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: drinkId}) //sending drinkID 
    }); 
    }else {
      fav = true;
      favOption.src="../assets/star.png";
      fetch( "/drinks/starDrink/"+ drinkId ,{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: drinkId}) //sending drinkID 
      }); 
    }
  }



  container.appendChild(estab);
  container.appendChild(edit);
  container.appendChild(d);
  container.appendChild(desc);
  container.appendChild(tagContainer);
  container.appendChild(addToGroupbtn);
  container.appendChild(closeMenu);
  container.appendChild(options);
  container.appendChild(deleteBtn);
  container.appendChild(favOption);
  document.getElementById('cardContainer').appendChild(container);
}
