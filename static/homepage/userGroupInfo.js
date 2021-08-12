let groupRequest = new XMLHttpRequest();
groupRequest.open('GET', '/groups', true); 
groupRequest.responseType = 'json';
groupRequest.send();

groupRequest.onload = function () {
  const groups = groupRequest.response.groups;
  console.log(groups);
  for(const group in groups){
      let gName = groups[group]['name'];
      let gId = groups[group]['id']
      let userGroup = document.createElement("option");
      userGroup.value = gName;
      userGroup.innerHTML = gName;

      /* End of Test */

      document.getElementById("groupOrders").appendChild(userGroup);
  }
}
