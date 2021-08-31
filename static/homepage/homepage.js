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
        document.getElementById(formID).style.display='none';
  
    },500);
    document.getElementById('add-card-btn').style.display='block';
  }
  
  
  function closeGroupAdd(){
    document.getElementById("groupOrder-add").style.display = 'none';
    document.getElementById('success-message').style.display = "none";
    document.getElementById('fail-message').style.display = "none";
    document.getElementById('fail-message-2').style.display = "none";
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
  
 async function sendInfoToAlex(){
  let groupInfo = document.getElementById("groupOrders").value; //group Order id
  if(groupInfo==""){
    document.getElementById('fail-message').style.display = "block";
  }else{
    document.getElementById("groupOrder-form").action = "/groups/addToGroup/"+groupInfo;
    let cardId = document.getElementById('gO-drinkID').value;



    //Check if card is already in group//

    let cardsInGroup = new XMLHttpRequest();
    cardsInGroup.open('GET', '/groups/getGroup/' + groupInfo, true); 
    cardsInGroup.responseType = 'json';
    cardsInGroup.send();
    let inGroup = true;

    function itsFalse(){
      inGroup = false;
    }

    cardsInGroup.onload =  function () {
      const content = cardsInGroup.response.groups;
      for (drinks in content) {
        let drinkCardID = content[drinks]["drink"];
        if (cardId == drinkCardID) {
          document.getElementById('fail-message-2').style.display = "block";
          return;
        }
      }
        //goes through with no fails
        document.getElementById('success-message').style.display = "block";
        document.getElementById('fail-message').style.display = "none";
        document.getElementById('fail-message-2').style.display = "none";
        setTimeout(function(){
          document.getElementById("groupOrder-form").submit();
        },1000);
    }

  }
}

