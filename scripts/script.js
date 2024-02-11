const testRequest = async () => {
    const response = await fetch('https://botw-compendium.herokuapp.com/api/v3/compendium/entry/white-maned_lynel');
    const myJson = await response.json();
    const responseTest = await fetch('https://botw-compendium.herokuapp.com/api/v3/compendium/category/monsters');
    const myJsonTest = await responseTest.json();
    console.log(myJsonTest); 
    console.log(myJsonTest.data.length);
    console.log(myJson);
    displayCard(myJson);
    for(var i = 0; i < myJsonTest.data.length; i++){
        var obj = myJsonTest.data[i];
        displayTypeCard(obj);
    }
}

document.getElementById("savedCards").addEventListener("click", function(){
    fadeMain();
    const testRequest2 = async () => {
        const responseTest2 = await fetch('https://botw-compendium.herokuapp.com/api/v3/compendium/category/creatures');
        const myJsonTest2 = await responseTest2.json();
        showSavedCards(myJsonTest2);
        document.getElementById('main').scrollTop = 0;
    }
    testRequest2();
});

function fadeMain(){
    const mainElement = document.getElementById("main");
    mainElement.classList.add("fadeOutIn");
    console.log("fadeMain triggered, class added:", mainElement.classList.contains("fadeOutIn"));
}


const showSavedCards = (obj) => {
    removeCurrentCards();
    for(var i = 0; i < obj.data.length; i++){
        var object = obj.data[i];
        displayTypeCard(object);
    }
}

function removeCurrentCards(){
    const myNode = document.getElementById("main");
    while(myNode.firstChild){
        myNode.removeChild(myNode.lastChild);
    }
} 


window.addEventListener('scroll', this.handleScroll, true);

handleScroll = (e) => {
    if (e.target.classList.contains("on-scrollbar") === false) {
        e.target.classList.add("on-scrollbar");
    }
}

const cardMachine = (obj) => {
    let capitalizedCategory = obj.category.charAt(0).toUpperCase() + obj.category.substring(1);
    let capitalizedName = obj.name.charAt(0).toUpperCase() + obj.name.substring(1);
    const makeCard = 
    `<div class="card">
        <div class="card-image">
            <img src="${obj.image}" class="img-responsive">
        </div>
        <div class="card-header">
            <div class="card-title h5">${capitalizedName}</div>
            <div class="card-subtitle text-gray">${obj.id}</div>
        </div>
        <div class="card-body">
            <div class="card-subtitle">Category: ${capitalizedCategory}</div>
        </div>
        <div class="card-footer">
            <i class="icon icon-plus"></i>
            <i class="icon icon-bookmark"></i>
        </div>
    </div>`;
    return makeCard;
}

const cardFactory = (obj) => {
    let capitalizedCategory = obj.data.category.charAt(0).toUpperCase() + obj.data.category.substring(1);
    let capitalizedName = obj.data.name.charAt(0).toUpperCase() + obj.data.name.substring(1);
    const makeCard = 
    `<div class="card">
        <div class="card-image">
            <img src="${obj.data.image}" class="img-responsive">
        </div>
        <div class="card-header">
            <div class="card-title h5">${capitalizedName}</div>
            <div class="card-subtitle text-gray">${obj.data.id}</div>
        </div>
        <div class="card-body">
            <div class="card-subtitle">Category: ${capitalizedCategory}</div>
        </div>
        <div class="card-footer">
            <i class="icon icon-plus"></i>
            <i class="icon icon-bookmark"></i>
        </div>
    </div>`;
    return makeCard;
}


function displayCard(obj) {
    let parentNode = document.getElementById('main');
    console.log(parentNode);
    parentNode.insertAdjacentHTML('beforeend', cardFactory(obj));
}
function displayTypeCard(obj) {
    let parentNode = document.getElementById('main');
    console.log(parentNode);
    parentNode.insertAdjacentHTML('beforeend', cardMachine(obj));
}

testRequest();