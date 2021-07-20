function person (displayName, username, img) {
    this.displayName = displayName;
    this.username = username;
    this.img = img;
}

const avery = new person("Avery", "sweet_tooth_49", "anime girl coffee.jpg");
const alex = new person("alex", "hungryMungry27", "coolWallpaper.png");
const alexander = new person("Alexander", "funnyMan79", "3e9.png");
const listOfPeople = [avery, alex, alexander];

function friendList(fList) {
    var temp, img, username, displayName, a, b, c;
    // a = the image
    //b = displayName
    //c = username
    temp = document.getElementById("friendsTemp");
    img = temp.querySelector("img");
    displayName = temp.querySelector("h2")
    username = temp.querySelector("h3");
    for (var i = 0; i < fList.length; i++) {
        a = document.importNode(img, true);
        a.src(fList[i].img)
        document.body.appendChild(a);
    }

}