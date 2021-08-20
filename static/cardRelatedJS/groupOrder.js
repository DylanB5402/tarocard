let requestGroupOrders = new XMLHttpRequest();
requestGroupOrders.open('GET', '/groups', true); 
requestGroupOrders.responseType = 'json';
requestGroupOrders.send();

requestGroupOrders.onload = function () {
  const groups = requestGroupOrders.response.groups;
  // Receives name and id
  for (const group in groups) {
    let gName = groups[group]["name"];
    let gID = groups[group]['id'];
    createGroupCard( gName, gID);
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
        fetch( "/groups/removeFromGroup/" + groupID ,{ 
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({drinkId: drinkID}) //sending drinkID 
        }); 
    }
    tagContainer.appendChild(pfp);

    container.appendChild(estab);
    container.appendChild(d);
    container.appendChild(desc);
    container.appendChild(tagContainer);
    container.appendChild(deleteBtn);
    container.style.marginTop = "100px";
    document.getElementById('groupContainer').appendChild(container);
}
  /* Creates group Orders cards */
  function createGroupCard( gName, groupID ){
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
    deleteBtn.style.width = "60px";
    deleteBtn.style.height = "60px";
    deleteBtn.setAttribute('name','deleteBtn');
    deleteBtn.style.position = "absolute";
    deleteBtn.style.left = "80%"


    deleteBtn.onclick = function(){
        container.style.display = "none";
        document.getElementById
        /* Sending a delete requestGroupContent with this button 
        fetch( '/groups/removeFromGroup/' + groupID ,{ 
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: drinkID}) //sending drinkID 
        }); 
        */
    }

    /* Edit Button To Change the name */
    let options = document.createElement('img');
    options.src = '../assets/menu-white.png';
    options.style.position = "absolute";
    options.style.left = "90%";
    options.setAttribute('name','edit')
    
    
    container.appendChild(options);
    container.appendChild(deleteBtn);
    container.appendChild(groupImage);
    container.appendChild(groupName);
    //container.appendChild(optionLink);
    document.getElementById('groupCardContainer').appendChild(container);
    container.onclick = function (e ){
      if( e.target.name == "deleteBtn"){
        container.style.display = "none";
        fetch( '/groups/removeGroup/' + groupID ,{ 
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: groupID}) //sending groupID 
      }); 
      }else if( e.target.name != "edit"){
        document.getElementById("groupView").style.display = "block";
        getGroupDrinkCards(groupID); //added id, when given the id
      }else {
        document.getElementById('editGroup').style.display = "flex";
        document.getElementById('group-order-edit').setAttribute('value', gName);
        document.getElementById('editGroupForm').setAttribute('action', '/groups/editGroupName/' + groupID)
      }
    }
  }

// fill in the group view with all the cards in the group ID
function getGroupDrinkCards(groupID){
    let requestGroupContent = new XMLHttpRequest();
    requestGroupContent.open('GET', '/groups/getGroup/' + groupID, true); //endpoint should have id
    requestGroupContent.responseType = 'json';
    requestGroupContent.send();

    requestGroupContent.onload = function() {
        const cards = requestGroupContent.response;
        for (const drinkCard in cards) {
          //drinkCardID is the id of the cards
          /*
          const drinkEst = cards[drinkCard]['establishment'];
          const drinkName = cards[drinkCard]['name'];
          const drinkDesc = cards[drinkCard]['desc'];
          const drinkId = cards[drinkCard]['id'];
          const ifFav = cards[drinkCard]['fav'];
          */
         let drinkCardID = cards[drinkCard]["friends_drink_id"]
         let requestGroupOrdersCard = new XMLHttpRequest();
         requestGroupOrdersCard.open('GET', '/drinks/getDrink/'+ drinkCardID, true); 
         requestGroupOrdersCard.responseType = 'json';
         requestGroupOrdersCard.send();

         requestGroupOrdersCard.onload = function () {
           let content = requestGroupOrdersCard.response;
           let drinkEst = content["establishment_id"]; //will change to establishment id
           let drinkName = content["drink_name"];
           let drinkDesc = content["drink_desc"];
           let drinkId = content["drink_id"];
           createGoCards(drinkEst, drinkName, drinkDesc, '../assets/pfp-placeholder.png', drinkId, groupID);
        }


        }
    }
}

document.getElementById("closeGroupView").onclick = function (){
    document.getElementById("groupView").style.display="none";
    document.getElementById("groupContainer").innerHTML = ""; //this will delete all the cards in the group View
}
