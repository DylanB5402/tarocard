let groupRequest = new XMLHttpRequest();
groupRequest.open('GET', 'https://my-json-server.typicode.com/shadydrako/cardData/cards', true); 
groupRequest.responseType = 'json';
groupRequest.send();

groupRequest.onload = function () {
  const groups = groupRequest.response;
  console.log(groups);
  for(let i = 0; i < groups.length; i++){
      let gName = groups[i]["Name of Establishment"];
      let userGroup = document.createElement("option");
      userGroup.value = gName;
      userGroup.innerHTML = gName;

      /*Testing Datalist */
      let eName = groups[i]["Name of Establishment"];
      let userGroup2 = document.createElement("option");
      userGroup2.innerHTML = eName;


      document.getElementById("estabList").appendChild(userGroup2);
      /* End of Test */

      document.getElementById("groupOrders").appendChild(userGroup);
  }
}
