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

      document.getElementById("groupOrders").appendChild(userGroup);
  }
}
