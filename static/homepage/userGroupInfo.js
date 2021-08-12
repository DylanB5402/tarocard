let groupRequest = new XMLHttpRequest();
groupRequest.open('GET', '/groups', true); 
groupRequest.responseType = 'json';
groupRequest.send();

groupRequest.onload = function () {
  const groups = groupRequest.response.groups;
  for(const group in groups){
      let gName = groups[group]['name'];
      let gID = groups[group]['id']
      let userGroup = document.createElement("option");
      userGroup.value = gID;
      userGroup.innerHTML = gName;

      /* End of Test */

      document.getElementById("groupOrders").appendChild(userGroup);
  }
}
