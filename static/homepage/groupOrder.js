function createCard(establishment, drink, description, image, drinkID){
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
        fetch( 'https://localhost:3000/drinks/' + drinkID ,{
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

    let requestGroupContent = new XMLHttpRequest();
    requestGroupContent.open('GET', 'https://my-json-server.typicode.com/shadydrako/cardData/db', true);
    requestGroupContent.responseType = 'json';
    requestGroupContent.send();

    requestGroupContent.onload = function() {
        const cards = requestGroupContent.response.cards;
        for(let i = 0; i < cards.length; i++) {
            let x =  cards[i]["Name of Establishment"];
            let y = cards[i]["Name of Order"];
            let z =cards[i]["Description"];
            let drinkId = cards[i]["id"]
            /*
            console.log(drinkCard)
            const drinkEst = cards[drinkCard]['establishment']
            const drinkName = cards[drinkCard]['name']
            const drinkDesc = cards[drinkCard]['desc']
            const drinkId = cards[drinkCard]['id']
            createCard2(drinkEst, drinkName, drinkDesc, '../assets/pfp-placeholder.png', drinkId)
            */
        createCard(x,y,z,"../assets/pfp-placeholder.png",drinkId);
        console.log(i);
        }
    }

document.getElementById("closeGroupView").onclick = function (){
    document.getElementById("groupView").style.display="none";
}
