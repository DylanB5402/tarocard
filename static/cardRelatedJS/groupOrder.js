let requestGroupOrders = new XMLHttpRequest();
requestGroupOrders.open('GET', '/groups', true); 
requestGroupOrders.responseType = 'json';
requestGroupOrders.send();

requestGroupOrders.onload = function () {
  const groups = requestGroupOrders.response.groups;
  console.log(groups);
  for (const group in groups) {
    let gName = groups[group]["name"];
    console.log(groups[group]["name"]);
    let gID = groups[group]['id'];
    console.log(gID);
    createGroupCard( gName);
  }
}
  /* Creates Drink Cards that are in the Group Order */
function createGoCards(establishment, drink, description, image, drinkID, groupID){
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

    /* Delete Button */
    let deleteBtn = document.createElement("img");
    deleteBtn.src="../assets/trash-icon.png";
    deleteBtn.classList.add("trash-card");

    deleteBtn.onclick = function(){
        container.style.display = "none";
        /* Sending a delete requestGroupContent with this button */
        fetch( '/groups/removeFromGroup/' + groupID ,{ 
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: drinkID}) //sending drinkID 
        }); 
    }
    tagContainer.appendChild(pfp);

    container.appendChild(estab);
    container.appendChild(d);
    container.appendChild(desc);
    container.appendChild(tagContainer);
    container.appendChild(deleteBtn);
    document.getElementById('groupContainer').appendChild(container);
}
  /* Creates group Orders cards */
  function createGroupCard( gName ){
    const container = document.createElement('div') // creates div element
  
    container.classList.add('group-card');
    container.style.alignItems = "center";
  
    let groupImage = document.createElement('img');
    groupImage.src ="../assets/group-order.png"; //this should be replaced with variable
    groupImage.style.width="50px"
  
    let groupName = document.createElement('h1');
    groupName.classList.add('fonts');
    groupName.style.color ='white';
    groupName.innerHTML = gName //This should also be replaced with variable


    /* Deleting a Group  */
    let deleteBtn = document.createElement("img");
    deleteBtn.src="../assets/trash-icon.png";
    deleteBtn.classList.add("trash-card");
    deleteBtn.style.width = "60px";
    deleteBtn.style.height = "60px";
    deleteBtn.setAttribute('name','deleteBtn');

    deleteBtn.onclick = function(){
        container.style.display = "none";
        document.getElementById
        console.log("Hello There");
        /* Sending a delete requestGroupContent with this button 
        fetch( '/groups/removeFromGroup/' + groupID ,{ 
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: drinkID}) //sending drinkID 
        }); 
        */
    }
    
    container.appendChild(deleteBtn);
    container.appendChild(groupImage);
    container.appendChild(groupName);
    //container.appendChild(optionLink);
    document.getElementById('groupCardContainer').appendChild(container);
    container.onclick = function (e ){
      if( e.target.name == "deleteBtn"){
        console.log("Hello There");
        container.style.display = "none";
        fetch( '/groups/removeGroup/' + groupID ,{ 
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: groupID}) //sending groupID 
      }); 
      }else{
        document.getElementById("groupView").style.display = "block";
        getGroupDrinkCards(id); //added id, when given the id
      }
    }
  }


function getGroupDrinkCards(groupID){
    let requestGroupContent = new XMLHttpRequest();
    requestGroupContent.open('GET', '/groups' + groupID, true); //endpoint should have id
    requestGroupContent.responseType = 'json';
    requestGroupContent.send();

    requestGroupContent.onload = function() {
        const cards = requestGroupContent.response.cards;
        for (const drinkCard in cards) {
          const drinkEst = cards[drinkCard]['establishment'];
          const drinkName = cards[drinkCard]['name'];
          const drinkDesc = cards[drinkCard]['desc'];
          const drinkId = cards[drinkCard]['id'];
          const ifFav = cards[drinkCard]['fav'];
          createGoCards(drinkEst, drinkName, drinkDesc, '../assets/pfp-placeholder.png', drinkId, ifFav, groupID);
        }
    }
}

document.getElementById("closeGroupView").onclick = function (){
    document.getElementById("groupView").style.display="none";
    document.getElementById("groupContainer").innerHTML = ""; //this will delete all the cards in the group View
}
