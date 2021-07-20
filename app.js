document.getElementById("noAcc").addEventListener('click',signUp);

function signUp(){
    if(document.getElementById("confirmPass").style.display === "none"){
        document.getElementById("confirmPass").style.display ="block";
        document.getElementById('noAcc').innerHTML = "Already have an account? <strong> Log in. </strong>";
        document.getElementById('login-button').innerHTML = " Sign Up";
    } else {
        document.getElementById("confirmPass").style.display ="none";
        document.getElementById('noAcc').innerHTML = "Don't have an account? <strong> Sign Up.</strong>";
        document.getElementById('login-button').innerHTML = " Log in";
    }
}


// Fake login for now??

function validate(){
    console.log("Button was pressed!");
    if(document.getElementById('userEmail').value === "user1" && document.getElementById("userPassword").value === "password1"){
        console.log("User has logged in!")
    } else {
        console.log("Bred how did you mess that up");
    }

    console.log(location.href)
}