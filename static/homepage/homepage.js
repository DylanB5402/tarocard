/* Home Page Events */
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

function openCardCreate( formID ){
    document.getElementById('add-card-btn').style.display='none';
    if( document.getElementById(formID).classList.contains('dezoom')){
        document.getElementById(formID).classList.remove('dezoom');
    }
    closeModalSheet();
    document.getElementById(formID).classList.add('animate');
    document.getElementById(formID).style.display='block';
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
  
  
  function closeGroupAdd(){
    document.getElementById("groupOrder-add").style.display = 'none';
  }
  
  
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
  const cards = request.response.drinks
  console.log(cards)
  for (const drinkCard in cards) {
    console.log(drinkCard)
    const drinkEst = cards[drinkCard]['establishment']
    const drinkName = cards[drinkCard]['name']
    const drinkDesc = cards[drinkCard]['desc']
    const drinkId = cards[drinkCard]['id']
    createCard(drinkEst, drinkName, drinkDesc, '../assets/pfp-placeholder.png', drinkId)
  }
}

/* Function created to help with creating cards for other pages
*  Styling needed for each one, thus the class added to them so everyone might
*  need to add the stylesheet for cards if they plan to have cards
*/

function createCard(establishment, drink, description, image, drinkId){
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

      form.action = "/drinks/editDrinkCard"; //change this to "/drinks/editDrinkCard/" + drinkId;
  }

  let options = document.createElement("img");
  options.src = "../assets/menu-button.png";
  options.classList.add("option-btn");
  options.onclick = function () {
    edit.style.display = 'block';
    addToGroupbtn.style.display = "block";
    deleteBtn.style.display = "block";
    options.style.display = "none"
    closeMenu.style.display = "block"
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
    closeMenu.style.display = "none"
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
      fetch( "/drinks/ "+ drinkId ,{
          method: 'delete',
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
      //document.getElementById("gO-userID").value = userID; unsure how to get USERID
    }
  addToGroupbtn.innerHTML = "+";

  tagContainer.appendChild(pfp);

  container.appendChild(estab);
  container.appendChild(edit);
  container.appendChild(d);
  container.appendChild(desc);
  container.appendChild(tagContainer);
  container.appendChild(addToGroupbtn);
  container.appendChild(closeMenu);
  container.appendChild(options);
  container.appendChild(deleteBtn)
  document.getElementById('cardContainer').appendChild(container);
}

  /* Function to Create a Group Card Div */ 
  /* add parameters so that it goes to a different page depending on group order */
  function createGroupCard(){
    const container = document.createElement('div') // creates div element
  
    container.classList.add('group-card');
    container.style.alignItems = "center";
  
    let groupImage = document.createElement('img');
    groupImage.src ="../assets/group-order.png"; //this should be replaced with variable
    groupImage.style.width="50px"
  
    let groupName = document.createElement('h1');
    groupName.classList.add('fonts');
    groupName.style.color ='white';
    groupName.innerHTML = 'Hello World 2' //This should also be replaced with variable
    

    /* Group Order Edit does not exist
    let optionLink = document.createElement('a');
    optionLink.href = "./groupOrder-edit.html";
    let options = document.createElement("img");
    options.src = "../assets/menu-button.png";
    options.classList.add("option-btn");
    optionLink.appendChild(options)

    */
    container.appendChild(groupImage);
    container.appendChild(groupName);
    //container.appendChild(optionLink);
    document.getElementById('cardContainer').appendChild(container);
    container.onclick = function (){
      document.getElementById("groupView").style.display = "block";
    }
  }

  createGroupCard();
  createCard("My Card","My Drink","my description",4,5)