let request = new XMLHttpRequest();
request.open('GET', '/drinks', true);
request.responseType = 'json';
request.send();

request.onload = function() {
    const cards = request.response.cards;
    for(let i = 0; i < cards.length; i++) {
        let x =  cards[i]["Name of Establishment"];
        let y = cards[i]["Name of Order"];
       let z =cards[i]["Description"];
       createCard(x,y,z,"../assets/pfp-placeholder.png");
       console.log(i);
    }
}

/* Function created to help with creating cards for other pages
*  Styling needed for each one, thus the class added to them so everyone might
*  need to add the stylesheet for cards if they plan to have cards
*/
/* add the card id */
 function createCard(establishment, drink, description, image){
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


    /* Trash Icon Button */
    let deleteBtn  = document.createElement('img');
    deleteBtn.src="../assets/trash-icon.png";
    deleteBtn.setAttribute('width','30px')
    deleteBtn.style.display = "inline-block";
    deleteBtn.style.position = "absolute";
    deleteBtn.style.right = "0px";
    deleteBtn.style.margin = "10px";

    deleteBtn.onclick = function(){
        console.log("whats good bro");
        container.style.display = "none";
        /*Delete based on the cardID */

        const url = "https://my-json-server.typicode.com/shadydrako/cardData/cards" /* +"/" + userID */

        const deleteData = async () => {
            const response = await fetch('url',{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: null
            });
        }
    }

    
    tagContainer.appendChild(pfp);
    container.appendChild(deleteBtn);

    container.appendChild(estab);
    container.appendChild(d);
    container.appendChild(desc);
    container.appendChild(tagContainer);
    document.getElementById('cardContainer').appendChild(container);
}