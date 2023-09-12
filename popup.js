const searchInput = document.getElementById('searchInput');
const searchInputBox = document.getElementById('searchInputBox');
const mappingInput = document.getElementById('mappingInput');
const emojiList = document.getElementById('emojiList');
const textList = document.getElementById('textList');
const addButton = document.getElementById('addButton');
const mappingList = document.getElementById('mappingList');
const goBackButton = document.getElementById('goBack');
const deleteButtons = document.querySelectorAll('.deleteMapping');
const viewMappingsButton = document.getElementById('viewMappings');
// Fetch the list of emojis
const emojis = require("emojilib");
// Display emojis on page load

displayEmojis(emojis);
displayElement(textList, false);
displayElement(mappingList, false);
searchInputBox.addEventListener('input', function() {
  const searchTerm = searchInputBox.value.toLowerCase().trim();
  if(searchTerm === ''){
    displayEmojis(emojis);
  }
  else{
    //console.log(searchTerm);
    const filteredEmojis = filterEmojis(searchTerm);;
    displayEmojis(filteredEmojis);
  }
  
});

// Display emojis on the page
function displayEmojis(emojis, display=true) {
    if(display){
        emojiList.innerHTML = '';
        for (const emojiKey in emojis) {
         if (emojis.hasOwnProperty(emojiKey)) {
        const emojiItem = document.createElement('div');
        emojiItem.className = 'emoji';
        emojiItem.textContent = emojiKey;
        emojiList.appendChild(emojiItem);
        }
    }
    }
  
}

// Filter emojis based on search term
function filterEmojis(searchTerm) {
  
  const matchingEmojis = {};

  for (const emojiKey in emojis) {
    if (emojis.hasOwnProperty(emojiKey)) {
      const keywords = emojis[emojiKey];
      if (keywords.includes(searchTerm)) {
        matchingEmojis[emojiKey] = keywords;
      }
    }
  }

  return matchingEmojis;
}
document.addEventListener('click', function(event){
    
    if(event.target.classList.contains('emoji')){
        const child = textList.querySelector('.text');
        if(child) child.remove();
        mappingInput.value = '';
        addButton.style.display = 'none';


        const text = event.target.textContent;
        const textItem = document.createElement('div');
        textItem.className = 'text';
        textItem.textContent = text;
        textList.insertBefore(textItem, textList.firstChild);
        var placeholder = mappingInput.placeholder;
        if(placeholder[placeholder.length - 1] !== ' '){
            placeholder = placeholder.slice(0, -2);
        }
        mappingInput.placeholder = placeholder + text;
        displayElement(emojiList, false);
        displayElement(searchInput, false);
        displayElement(textList, true);
    }
});
mappingInput.addEventListener('input', function() {
  const mappingTerm = mappingInput.value.toLowerCase().trim();
  if(mappingTerm.length === 0){
    //displayElement(addButton, false);
    addButton.style.display = 'none';
  }
  else{
    //displayElement(addButton, true); 
    addButton.style.display = 'block';
  }

});


//Add Mapping Button
addButton.addEventListener('click', function(){
    const key = mappingInput.value.toLowerCase().trim();
    const val = textList.firstChild.textContent;
    addButton.style.display = 'none';
    displayElement(textList, false);
    
    const keyValue = {};
    keyValue[key] = val;
    chrome.storage.local.set(keyValue, function(){
        //output.textContent = "Mapping Added";
    });
    displayMappingLists();

});


//Delete Mapping Button
document.addEventListener('click', function(event) {
    if(event.target.classList.contains('deleteMapping')){
        displayElement(mappingList, false);
        const deleteButton = event.target;
        const  key = deleteButton.previousElementSibling.textContent;// Retrieve the key from the parent element

        deleteButton.textContent += ' ' + key; // Update the button text

        chrome.storage.local.remove(key, function() {
            displayMappingLists();
        });        
    }
        
});

//View Mappings Button
viewMappingsButton.addEventListener('click', function(){
    displayElement(searchInput, false);
    displayElement(emojiList, false);
    displayElement(textList, false);
    displayElement(mappingList, false);
    //displayElement(mappingList, true);
    displayMappingLists();
});

function displayMappingLists(){
    displayElement(mappingList, true);
    const flushList = mappingList.querySelectorAll('.listItems');
    flushList.forEach(ele => ele.remove());
    const flushMsg = mappingList.querySelectorAll('.noMappingMessage');
    flushMsg.forEach(ele => ele.remove());
    chrome.storage.local.get(null, function(res){
        const keys = Object.keys(res);
        if(keys.length > 0){
            keys.forEach(key => {
                const parentDiv = document.createElement('div');
                parentDiv.className = "listItems";
                const div1 = document.createElement('div');
                const div2 = document.createElement('div');
                const div3 = document.createElement('button');
                div3.className = "deleteMapping";
                div2.className = "key";
                div1.className = "value";
                div1.textContent = res[key];
                div2.textContent = key;
                div3.textContent = "Delete";
                parentDiv.append(div1);
                parentDiv.append(div2);
                parentDiv.append(div3);
                mappingList.append(parentDiv);
            });
        }else{
            const ele = document.createElement('div');
            ele.className = "noMappingMessage";
            ele.textContent = "No Mappings Set";
            mappingList.append(ele);
        }
    });
}

//Add Another Mapping Button
goBackButton.addEventListener('click', function(){
    //displayElement(goBackButton, false);
    displayElement(textList, false);
    displayElement(mappingList, false);
    displayElement(searchInput, true);
    
    displayElement(emojiList, true);
    displayEmojis(emojis);
});


function displayElement(element, display){
    const parentElement = element;
    if(display && element.classList.contains('hide')){
        parentElement.classList.remove('hide');
        const children = parentElement.children;
        for (let child of children) {
            child.classList.remove('hide');
        }
        
    }else{
        const children = parentElement.children;
        for (let child of children) {
            child.classList.add('hide');
        }
        parentElement.classList.add('hide');
    }
}






