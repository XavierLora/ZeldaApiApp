const CreatureCheckBox = document.getElementById("creatureCheck");
const EquipmentCheckBox = document.getElementById("equipmentCheck");
const MaterialCheckBox = document.getElementById("materialCheck");
const MonsterCheckBox = document.getElementById("monsterCheck");

function uncheckAllCheckboxes() {
    CreatureCheckBox.checked = false;
    EquipmentCheckBox.checked = false;
    MaterialCheckBox.checked = false;
    MonsterCheckBox.checked = false;
}

document.addEventListener("DOMContentLoaded", function() {
    uncheckAllCheckboxes();
});

CreatureCheckBox.addEventListener('change', function(){
    if (this.checked) { // Check if the checkbox is checked
        fadeMain();
        const creatureRequest = async () => {
            const data = await fetch('https://botw-compendium.herokuapp.com/api/v3/compendium/category/creatures');
            const myJsonData = await data.json();
            console.log(myJsonData);
            for(var i = 0; i < myJsonData.data.length; i++){
                var obj = myJsonData.data[i];
                displayTypeCard(obj);
            }
            document.getElementById('main').scrollTop = 0;
        };
        creatureRequest();
    }else{
        fadeMain();
        removeCardsByCategory("creatures");
        console.log("removeCards called");
    }
});

EquipmentCheckBox.addEventListener('change', function(){
    if (this.checked) { // Check if the checkbox is checked
        fadeMain();
        const equipmentRequest = async () => {
            const data = await fetch('https://botw-compendium.herokuapp.com/api/v3/compendium/category/equipment');
            const myJsonData = await data.json();
            for(var i = 0; i < myJsonData.data.length; i++){
                var obj = myJsonData.data[i];
                displayTypeCard(obj);
            }
            document.getElementById('main').scrollTop = 0;
        };
        equipmentRequest();
    }else{
        fadeMain();
        removeCardsByCategory("equipment");
        console.log("removeCards called");
    }
});

MaterialCheckBox.addEventListener('change', function(){
    if (this.checked) { // Check if the checkbox is checked
        fadeMain();
        const equipmentRequest = async () => {
            const data = await fetch('https://botw-compendium.herokuapp.com/api/v3/compendium/category/materials');
            const myJsonData = await data.json();
            for(var i = 0; i < myJsonData.data.length; i++){
                var obj = myJsonData.data[i];
                displayTypeCard(obj);
            }
            document.getElementById('main').scrollTop = 0;
        };
        equipmentRequest();
    }else{
        fadeMain();
        removeCardsByCategory("materials");
    }
});

MonsterCheckBox.addEventListener('change', function(){
    if (this.checked) { // Check if the checkbox is checked
        fadeMain();
        const equipmentRequest = async () => {
            const data = await fetch('https://botw-compendium.herokuapp.com/api/v3/compendium/category/monsters');
            const myJsonData = await data.json();
            for(var i = 0; i < myJsonData.data.length; i++){
                var obj = myJsonData.data[i];
                displayTypeCard(obj);
            }
            document.getElementById('main').scrollTop = 0;
        };
        equipmentRequest();
    }else{
        fadeMain();
        removeCardsByCategory("monsters");
    }
});



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
    uncheckAllCheckboxes();
    removeCurrentCards();
    const savedCardData = getSavedCardData();
    console.log(savedCardData);
    displayTypeCard(savedCardData);
}

function removeCurrentCards(){
    const myNode = document.getElementById("main");
    while(myNode.firstChild){
        myNode.removeChild(myNode.lastChild);
    }
} 

function removeCardsByCategory(category) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const cardCategory = card.querySelector('#cardCategory').innerText.toLowerCase();
        console.log(cardCategory);
        if (cardCategory.includes(category.toLowerCase())) {
            card.remove();
        }
    });
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
            <i class="icon icon-cross" id="removeCross" onClick="this.parentElement.parentElement.remove();"></i>
        </div>
        <div class="card-header">
            <div class="card-title h5">${capitalizedName}</div>
            <div class="card-subtitle text-gray">${obj.id}</div>
        </div>
        <div class="card-body">
            <div id="cardCategory" class="card-subtitle">Category: ${capitalizedCategory}</div>
        </div>
        <div class="card-footer">
            <i class="icon icon-bookmark saveIcon"></i>
        </div>
    </div>`;


    return makeCard;

    
}

const cardFactory = (obj) => {
    let capitalizedCategory = obj.category.charAt(0).toUpperCase() + obj.category.substring(1);
    let capitalizedName = obj.name.charAt(0).toUpperCase() + obj.name.substring(1);
    const makeCard = 
    `<div class="card">
        <div class="card-image">
            <img src="${obj.image}" class="img-responsive">
            <i class="icon icon-cross" id="removeCross" onClick="this.parentElement.parentElement.remove();"></i>
        </div>
        <div class="card-header">
            <div class="card-title h5">${capitalizedName}</div>
            <div class="card-subtitle text-gray">${obj.id}</div>
        </div>
        <div class="card-body">
            <div class="card-subtitle">Category: ${capitalizedCategory}</div>
        </div>
        <div class="card-footer">
            <i class="icon icon-bookmark"></i>
        </div>
    </div>`;
    return makeCard;
}

document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('saveIcon')) {
        // Get JSON data of the card
        let cardData = {
            category: event.target.parentElement.parentElement.querySelector('#cardCategory').innerText,
            name: event.target.parentElement.parentElement.querySelector('.card-title').innerText,
            id: event.target.parentElement.parentElement.querySelector('.card-subtitle').innerText,
            image: event.target.parentElement.parentElement.querySelector('.card-image img').src
        };
        console.log(cardData);
        // Save cardData to local storage
        let savedCardData = getSavedCardData() || [];

        let exists = savedCardData.findIndex(item => item.id === cardData.id) !== -1;

        if (!exists) {
            // If the card data doesn't exist, add it to savedCardData
            savedCardData.push(cardData);

            // Update localStorage with the new savedCardData
            localStorage.setItem('savedCard', JSON.stringify(savedCardData));

            // Update the UI to display the saved card
        }
    }
});

function getSavedCardData() {
    const savedCardData = localStorage.getItem('savedCard');
    return savedCardData ? JSON.parse(savedCardData) : [];
}


function displayCard(obj) {
    let parentNode = document.getElementById('main');
    console.log(parentNode);
    parentNode.insertAdjacentHTML('afterbegin', cardFactory(obj));
}
function displayTypeCard(obj) {
    let parentNode = document.getElementById('main');
    console.log(parentNode);
    parentNode.insertAdjacentHTML('afterbegin', cardMachine(obj));
}