const CreatureCheckBox = document.getElementById("creatureCheck");
const EquipmentCheckBox = document.getElementById("equipmentCheck");
const MaterialCheckBox = document.getElementById("materialCheck");
const MonsterCheckBox = document.getElementById("monsterCheck");
const searchBarInput = document.getElementById("searchBar");

function uncheckAllCheckboxes() {
    CreatureCheckBox.checked = false;
    EquipmentCheckBox.checked = false;
    MaterialCheckBox.checked = false;
    MonsterCheckBox.checked = false;
}

document.addEventListener("DOMContentLoaded", function() {
    if (!localStorage.getItem('savedCard')) {
        localStorage.setItem('savedCard', '[]');
    }
    searchBarInput.value = "";
    showSavedCards();
    document.getElementById("savedCards").classList.add("savedCards-pressed");
    // Check if localStorage is empty after a delay
    setTimeout(function() {
        if (localStorage.getItem('savedCard') === null || localStorage.getItem('savedCard') === '[]') {
            var toast = document.getElementById('toastMsg');
            toast.textContent = "No Items Saved! Click the drop down!";
            toast.style.display = 'block';
            setTimeout(function() {
                toast.style.display = 'none';
            }, 5000); // Adjust the timeout (milliseconds) as needed
        }
    }, 4000);
});

CreatureCheckBox.addEventListener('change', function(){
    if (this.checked) { // Check if the checkbox is checked
        searchBarInput.value = "";
        if(document.getElementById("savedCards").classList.contains("savedCards-pressed")){
            document.getElementById("savedCards").classList.remove("savedCards-pressed");
        }
        const creatureRequest = async () => {
            fadeMain();
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
        searchBarInput.value = "";
        if(document.getElementById("savedCards").classList.contains("savedCards-pressed")){
            document.getElementById("savedCards").classList.remove("savedCards-pressed");
        }
        const equipmentRequest = async () => {
            fadeMain();
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
    searchBarInput.value = "";
    if (this.checked) { // Check if the checkbox is checked
        if(document.getElementById("savedCards").classList.contains("savedCards-pressed")){
            document.getElementById("savedCards").classList.remove("savedCards-pressed");
        }
        const equipmentRequest = async () => {
            fadeMain();
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
    searchBarInput.value = "";
    if (this.checked) { // Check if the checkbox is checked
        if(document.getElementById("savedCards").classList.contains("savedCards-pressed")){
            document.getElementById("savedCards").classList.remove("savedCards-pressed");
        }
        const equipmentRequest = async () => {
            fadeMain();
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

let typingTimer;
const doneTypingInterval = 500; // 500ms delay

searchBarInput.addEventListener("input", function() {
    document.getElementById('main').scrollTop = 0;
    if(document.getElementById("savedCards").classList.contains("savedCards-pressed") && ((localStorage.getItem('savedCard') !== '[]'))){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            // Perform search after 500ms delay
            const searchText = searchBarInput.value.trim().toLowerCase();
            if (searchText !== '') {
                fadeMain();
                filterAndDisplaySavedCards(searchText);
            } else {
                // If search input is empty, show all cards
                fadeMain();
                showSavedCards();
            }
        }, doneTypingInterval);
    }else{
        document.getElementById('main').scrollTop = 0;
        if(document.getElementById("savedCards").classList.contains("savedCards-pressed")){
            document.getElementById("savedCards").classList.remove("savedCards-pressed");
        }
        const search = async () => {
            fadeMain();
            const data = await fetch('https://botw-compendium.herokuapp.com/api/v3/compendium/all');
            const myJsonData = await data.json();
            console.log(myJsonData);
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                // Perform search after 500ms delay
                const searchText = searchBarInput.value.trim().toLowerCase();
                uncheckAllCheckboxes();
                if (searchText !== '') {
                    filteredCards = myJsonData.data.filter(card => {
                        return card.name.toLowerCase().includes(searchText) || card.category.toLowerCase().includes(searchText) || card.id.toString().includes(searchText);
                    });
                    removeCurrentCards();
                    fadeMain();

                    // Display filtered cards
                    filteredCards.forEach(card => {
                        displayTypeCard(card);
                    });
                    document.getElementById('main').scrollTop = 0;
                } else {
                    for(var i = 0; i < myJsonData.data.length; i++){
                        var obj = myJsonData.data[i];
                        displayTypeCard(obj);
                    }
                    document.getElementById('main').scrollTop = 0;
                    fadeMain();
                }
            }, doneTypingInterval);
            
            fadeMain();
            document.getElementById('main').scrollTop = 0;
        };
        search();
        document.getElementById('main').scrollTop = 0;
    }
});

function filterAndDisplaySavedCards(searchText) {
    const savedCardData = getSavedCardData();
    console.log(savedCardData);
    const filteredCards = savedCardData.filter(card => {
        return card.name.toLowerCase().includes(searchText) || card.category.toLowerCase().includes(searchText) || card.id.includes(searchText);
    });

    // Remove existing cards before displaying filtered cards
    removeCurrentCards();
    fadeMain();

    // Display filtered cards
    filteredCards.forEach(card => {
        displayTypeCard(card);
    });
}


document.getElementById("savedCards").addEventListener("click", function(){
    searchBarInput.value = "";
    if(this.classList.contains("savedCards-pressed")){
        removeCurrentCards();
        this.classList.toggle("savedCards-pressed");
    }else{
        this.classList.toggle("savedCards-pressed");
    const savedCardsCall = async () => {
        showSavedCards();
        document.getElementById('main').scrollTop = 0;
    }
    savedCardsCall();
    }
});

function fadeMain(){
    const mainElement = document.getElementById("main");
    mainElement.classList.add("fadeOutIn");
    console.log("fadeMain triggered, class added:", mainElement.classList.contains("fadeOutIn"));
}


function showSavedCards(){
    uncheckAllCheckboxes();
    removeCurrentCards();
    const savedCardData = getSavedCardData();
    const cardDataRetreived = Object(savedCardData);
    console.log(cardDataRetreived);
    for(var i = 0; i < cardDataRetreived.length; i++){
        var obj = cardDataRetreived[i];
        displayTypeCard(obj);
    }
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
    const savedCardData = getSavedCardData();
    const cardDataRetreived = Object(savedCardData);
    const cardExists = cardDataRetreived.some(savedCard => savedCard.id === obj.id);
    

    let bookmarkClass;
    if (cardExists) {
        bookmarkClass = "icon icon-bookmark saveIcon savedCardsMain-pressed";
        console.log("Saved Card");
    } else {
        bookmarkClass = "icon icon-bookmark saveIcon";
    }

    
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
            <div id="cardCategory" class="card-subtitle">${capitalizedCategory}</div>
        </div>
        <div class="card-footer">
            <i class="${bookmarkClass}" onClick="this.parentElement.parentElement.remove(); showOverlayToast();"></i>
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
        let savedCardData = getSavedCardData();
        const cardDataRetreived = Object(savedCardData);
        const cardExists = cardDataRetreived.some(savedCard => savedCard.id === cardData.id);

        if(!cardExists){
            event.target.classList.toggle("savedCardsMain-pressed");
            console.log("Card doesnt exists adding now");
            // If the card data doesn't exist, add it to savedCardData
            cardDataRetreived.push(cardData);

            // Update localStorage with the new savedCardData
            localStorage.setItem('savedCard', JSON.stringify(cardDataRetreived));
            // Update the UI to display the saved card
        }else{
            savedCardData = cardDataRetreived.filter(savedCard => savedCard.id !== cardData.id);
            event.target.classList.toggle("savedCardsMain-pressed");
            localStorage.setItem('savedCard', JSON.stringify(savedCardData));
            console.log("Card already exists");
        }
    }
});

function getSavedCardData() {
    const savedCardData = localStorage.getItem('savedCard');
    return savedCardData ? JSON.parse(savedCardData) : [];
}

function displayTypeCard(obj) {
    let parentNode = document.getElementById('main');
    console.log(parentNode);
    parentNode.insertAdjacentHTML('afterbegin', cardMachine(obj));
}

function showOverlayToast() {
    var toast = document.getElementById('toastMsg');
    if(document.getElementById("savedCards").classList.contains("savedCards-pressed")){
        toast.textContent = "Unsaved! Back to their home they go!";
    }else{
        toast.textContent = "Saved! Check the icon at the top!";
    }
    toast.style.display = 'block';
    setTimeout(function() {
      toast.style.display = 'none';
    }, 5000); // Adjust the timeout (milliseconds) as needed
  }

  function checkAndCloseKeyboard() {
    // Check if any input element is focused
    const activeElement = document.activeElement;
    
    // Check if the active element is an input or textarea
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        // Blur the active input element to close the keyboard
        activeElement.blur();
    }
}

// Event listener for the touchstart event to detect screen touch
document.addEventListener('touchstart', checkAndCloseKeyboard);