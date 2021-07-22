function openCardCreate(){
    document.getElementById('id01').style.display='block';
    document.getElementById('add-card-btn').style.display='none';
    if( document.getElementById('id01').classList.contains('dezoom')){
        document.getElementById('id01').classList.remove('dezoom');
    }
    document.getElementById('id01').classList.add('animate');
}

function closeCardCreate(){
    document.getElementById('id01').classList.remove('animate');
    document.getElementById('id01').classList.add('dezoom');
    setTimeout(function(){
        console.log("We did it bitches");
        document.getElementById('id01').style.display='none';

    },500);
    document.getElementById('add-card-btn').style.display='block';
    
}