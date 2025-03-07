let dateInput = document.getElementsByClassName('datepicker');
//it returns an array therefore a for loop is required to access every class element
const screenWidth = window.innerWidth || document.documentElement.clientWidth;

var formattedToday = new Date();
var day = String(formattedToday.getDate()).padStart(2, '0');
var month = String(formattedToday.getMonth() + 1).padStart(2, '0'); // January is 0!
var year = formattedToday.getFullYear();

var today = `${year}-${month}-${day}`;    //this is to get today's date as per Indian time zone and not UTC


for (let i = 0; i < 2; i++) {
  dateInput[i].min = today;
}

//this uses UTC and not local time that's why error occurred with 31 Oct, 2023 at 1:17am (1 Nov), utc time is 7:48pm (31 Oct)
//date object is created then converted into ISO 8601 date and time string then split by time part as it contains date, time and 
//coordinate zone and then [0] indicates 0th element, i.e, access of date setting value of min attribute to today


const searchInput = document.getElementById('searchInput');
const itemList = document.getElementById('itemList');
const items = document.getElementById('items');
const selectedItemInput = document.getElementById('selectedItem');

const trendingSearches = ["Lucknow", "Agra", "Varanasi" ];


  function displayTrendingSearches(){
    items.innerHTML = '';
    const optgroup = document.createElement('optgroup');
    optgroup.label = 'Trending Searches';
    items.appendChild(optgroup);
    trendingSearches.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      li.addEventListener('click', () => selectItem(item));
      items.appendChild(li);
    });
    itemList.style.display = 'block';
  }

  // Function to populate the select element with options
  function populateOptions(query) {
    if (query === '' || query.trim() === ""){
      displayTrendingSearches();
    }
    else{
      fetch(`/get_options?query=${query}`)
        .then(response => response.json())
        .then(data => {
          items.innerHTML = ''; // Clear existing options
          data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            items.style.padding = '10px 0 0 0';
            li.addEventListener('click', () => selectItem(item));
            items.appendChild(li);
          });
          if (items.innerHTML === ''){
            const p = document.createElement('p');
            p.textContent = 'No Results Found';
            items.style.padding = '0px';
            items.appendChild(p);
          }
          itemList.style.display = 'block';
        });
    }
  }

  function selectItem(item){
    
    selectedItemInput.value = item;
    searchInput.value = item;
    itemList.style.display = 'none';

    errorBox.innerHTML = ''; // Clear the error message
    if (screenWidth > 835){
      height.style.height = '75px';
    }

    if (dateInput[0].value === ''){
      dateInput[0].value = today;
      let checkInDate = new Date(today);
      let checkOutDate = new Date(today);
      
      checkOutDate.setDate(checkInDate.getDate() + 1);
      dateInput[1].value = checkOutDate.toISOString().split('T')[0];
    
      for (let i = 0; i < 2; i++) {
        changeColor(dateInput[i]);
      }
    }
  }

  dateInput[0].addEventListener('change', function () {
    dateInput[1].value = '';
    dateInput[1].style.color = "white"; 
    let checkInDate = new Date(dateInput[0].value);
    let minCheckOutDate = new Date(checkInDate);
    minCheckOutDate.setDate(checkInDate.getDate() + 1);
    let checkOutDate = minCheckOutDate.toISOString().split('T')[0];
  
    if (dateInput[1]){
      dateInput[1].min = checkOutDate;
    }
  });


   function calGuest(){
    let totalGuest = 0
    for (let i = 0; i < list.length; i++){
      totalGuest += list[i]['adult'];
      totalGuest += list[i]['child']['count'];
     }
     if (totalGuest.toString().length === 1)
     guestNum.textContent = `Guest 0${totalGuest}`;
     else
     guestNum.textContent = `Guest ${totalGuest}`;
   }

   function createClone(){
  
     const clonedBox = block.cloneNode(true);
     guestBox.insertBefore(clonedBox, done);
     
      let totGuest = clonedBox.querySelector('.tot-guest');
      totGuest.style.display = 'none';
      let finalList = clonedBox.querySelector('.final-list');
      finalList.style.display = 'block';
      let childAgeAgain  = clonedBox.querySelector('.child-age');
      if (childAgeAgain)
      childAgeAgain.style.display = 'none';
      let edit = clonedBox.querySelector('.edit');
      edit.style.display = 'block';
      let xMark = clonedBox.querySelector('.x-mark');
      xMark.style.display = 'block';
      
      let roomNo = clonedBox.querySelector('.room-no');
      roomNo.textContent = 'Room ' + counter;         // Set room number as 'Room 1', 'Room 2', and so on
     
      list[counter-1] = {'adult' : 2, 'child' : {'count' : 0}}
      counter++;
  
      let selector1 = clonedBox.querySelectorAll('.number.child li');
      selector1.forEach(element => {
        if (element.classList.contains('selected'))       //selected child
          element.classList.remove('selected');
        if (element.classList.contains('display'))        //x-mark
          element.style.display = 'none';
      })

      let selector2 = clonedBox.querySelectorAll('.number.adult li');
      if (selector2[0].classList.contains('selected')){
        selector2[0].classList.remove('selected');
        selector2[1].classList.add('selected');
      }

      finalList.textContent = '2 Adult, 0 Children';
      if (counter === 5)
      addRoom.style.visibility = 'hidden';
    }
  
    function removeCloneElement(){
      let blocks = document.querySelectorAll('.blocks');
      let deletedBlock = blocks[blocks.length - 1];
      deletedBlock.remove();
      list.pop();
      counter--;
      if (counter < 5)
      addRoom.style.visibility = 'visible';
     }

  searchInput.addEventListener('focus',  function() {
    if (searchInput.value === "") {
        displayTrendingSearches();
    }
});

//ok or kya kya kiye ho dikhao
// ky ky dekhoge ye jo rooms display kiye ho usko static hi info duye ho ya data,js se render kr k display 
  // Listen for input in the search bar and call populateOptions with the user's query
  searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    populateOptions(query);
  });

//click anywhere on the page, itemList is set hidden
  document.addEventListener('click', (event) => { 
    if (event.target !== searchInput) {
      itemList.style.display = 'none';
    }
  });

  function formfunction(){
    
    let menu_click = document.getElementById('search-bar');
    let click_content = document.getElementById('content');

    if (menu_click.className === "search_box") {
        menu_click.classList.add('active-bar');
        click_content.style.overflow = 'hidden';
        height.style.height = '100vh';
    } 
    else {
        menu_click.classList.remove('active-bar');
        click_content.style.overflow = 'visible';
        height.style.height = '75px';

    }
}

  let height = document.getElementById('search-bar');
  let errorBox = document.getElementById('error');
  
//   function checkFields(){
//     let click_content = document.getElementById('content');

//     if (!selectedItemInput.value || selectedItemInput.value !== searchInput.value){
//       if (searchInput.value.trim() === ''){
//         errorBox.innerHTML = 'Please select hotel';
//       }
//       else{
//         errorBox.innerHTML = 'Select among the hotels provided';
//       }
//       if (screenWidth > 835){
//         height.style.height = '83px';
//       }
//       return false;
//     }
//     else if(dateInput[0].value === ''){
//       errorBox.innerHTML = 'Kindly select your check-in date';
//       if (screenWidth > 835){
//         height.style.height = '83px';
//       }
//       return false;
//     }
//     else if(dateInput[1].value === ''){
//       errorBox.innerHTML = 'Please select check-out date';

//       if (screenWidth > 835){
//         height.style.height = '83px';
//       }
//       return false;
//     }
//     height.classList.remove('active-bar');
//     click_content.style.overflow = 'visible';
//     height.style.height = '75px';
//     console.log(roomValue)
//     return true;
// }


function checkFields(){
  let click_content = document.getElementById('content');

  // Check if the selected hotel (hidden input) matches the search input value.
  if (!selectedItemInput.value || selectedItemInput.value !== searchInput.value){
    if (searchInput.value.trim() === ''){
      errorBox.innerHTML = 'Please select hotel';
    } else {
      errorBox.innerHTML = 'Select among the hotels provided';
    }
    if (screenWidth > 835){
      height.style.height = '83px';
    }
    return false;
  }
  // Check if check-in date is provided.
  else if(dateInput[0].value === ''){
    errorBox.innerHTML = 'Kindly select your check-in date';
    if (screenWidth > 835){
      height.style.height = '83px';
    }
    return false;
  }
  // Check if check-out date is provided.
  else if(dateInput[1].value === ''){
    errorBox.innerHTML = 'Please select check-out date';
    if (screenWidth > 835){
      height.style.height = '83px';
    }
    return false;
  }

  // Remove the active bar and reset the height/overflow styling.
  height.classList.remove('active-bar');
  click_content.style.overflow = 'visible';
  height.style.height = '75px';
  console.log(roomValue);

  // Retrieve the city name from the search input and update the form action.
  let city = searchInput.value.trim();
  console.log("City:", city);
  let form = document.getElementById('form');
  form.action = "/rooms/city=" + encodeURIComponent(city);
  console.log("Updated form action:", form.action);

  return true;
}



//Any changes in input box either a text added or removed will also trigger errorBox to hide



searchInput.addEventListener('change', function(){
  errorBox.innerHTML = '';
  if (screenWidth > 835){
    height.style.height = '75px';
  }
})
dateInput[1].addEventListener('change', function(){
  errorBox.innerHTML = '';
  if (screenWidth > 835){
    height.style.height = '75px';
  }
})
dateInput[0].addEventListener('change', function(){
  errorBox.innerHTML = '';
  if (screenWidth > 835){
    height.style.height = '75px';
  }
})
  

let roomNum = document.querySelector('.room-num');
let roomBox = document.querySelector('.room-box');
roomNum.addEventListener('click', (e) =>{
  e.stopPropagation();
  roomNum.classList.toggle('angle-up');
  roomBox.classList.toggle('display');
});

let room = document.querySelectorAll('.roomss li');
let selectedItem = room[0];
let roomValue = 1;


let guestNum = document.querySelector('.guest-num');
let guestBox = document.querySelector('.guest-box');
let block = document.querySelector('.blocks');
let list = [];
let done = document.querySelector('.done');
let addRoom = document.querySelector('.add-room');

    guestNum.addEventListener('click', (event) =>{
      event.stopPropagation();
      guestNum.classList.toggle('angle-up');
      guestBox.classList.toggle('display');
});
    document.addEventListener('click', (event) => { 
        guestNum.classList.remove('angle-up');
        guestBox.classList.add('display');
        roomNum.classList.remove('angle-up');
        roomBox.classList.add('display');
    });

let counter = 2;
let  lastClickedBlock = block;     // when add room, update its value
list[0] = {'adult' : 2, 'child' : {'count' : 0}}

// Using an event-delegation technique to tackle with event-listeners of cloned items
guestBox.addEventListener('click', (event) => {
  event.stopPropagation();
  const target = event.target;
  
    let totGuest2 = lastClickedBlock.querySelector('.tot-guest');
    let finalList2 = lastClickedBlock.querySelector('.final-list');
    let childAgeAgain2  = lastClickedBlock.querySelector('.child-age');
    let edit2 = lastClickedBlock.querySelector('.edit');
    let xMark2 = lastClickedBlock.querySelector('.x-mark');
    let numChild = lastClickedBlock.querySelector('.number.child');
    let roomContent = lastClickedBlock.querySelector('.room-no').textContent;
    let roomCount = parseInt(roomContent[roomContent.length - 1]);
    const liElements = numChild.querySelectorAll('li');
    let licon = liElements[2];
    let firstBlock = lastClickedBlock.previousElementSibling;
    let lastBar = edit2.previousElementSibling;
    let adultList = list[roomCount-1]['adult'];
    let childList = list[roomCount-1]['child']['count'];

  if (target.classList.contains('edit')) {
      
      totGuest2.style.display = 'none';
      finalList2.style.display = 'block';
      finalList2.textContent = `${adultList} Adult, ${childList} Children`;
      if (childAgeAgain2)
      childAgeAgain2.style.display = 'none';
      edit2.style.display = 'block';
      
      lastBar.classList.add('bar');

      let nextSibling = target.nextElementSibling;                 //finalList
      let nextToNextSibling = nextSibling.nextElementSibling;      //totGuest
      let prevSibling = target.previousElementSibling;
      prevSibling.classList.remove('bar');
      let closestB = target.closest('.blocks');

      nextToNextSibling.style.display = 'flex';
      nextSibling.style.display = 'none';
      target.style.display = 'none';
    
      let selector = closestB.querySelectorAll('.number.child li')
  
      let val = false;
       selector.forEach(element => {
        if (element.classList.contains('selected')){       //selected child
          closestB.querySelector('.child-age').style.display = 'block';
          val = true;
        }
      
        if (val && element.classList.contains('display'))        //x-mark
          element.style.display = 'block';
    })
      
      lastClickedBlock = closestB;
      
      if (firstBlock){                               //error here somewhat check this
      xMark2.style.display = 'block';
    }
    }

  else if (target.closest('.number.adult li')){
    newValue = target.getAttribute('data-value');
    let selectedListItem = target.closest('.number.adult').querySelector('li.selected');
    selectedListItem.classList.remove('selected');
    target.classList.add('selected');
    
    selectedListItem = target;
    list[roomCount-1]['adult'] = parseInt(newValue); 
  }


  else if (target.closest('.number.child li')){
    let selectedListItemC = target.closest('.number.child').querySelector('li.selected');;
  
    let parentTree = target.closest('.tot-guest');
    let childAge = parentTree.nextElementSibling;
    childAge.style.display = 'block'; 
    licon.style.display = 'block';
    
    let newValue = target.getAttribute('data-value');
    if (newValue){
      if (selectedListItemC) {
        selectedListItemC.classList.remove('selected');
      }
      target.classList.add('selected');
      selectedListItemC = target;
      list[roomCount-1]['child']['count'] = parseInt(newValue);
      let age = [];
      childAge.innerHTML = '';

      for (let i = 1; i <= newValue; i++) {
        
        const p = document.createElement('p');
        p.textContent = `Age of child ${i}`;
        
        const ul = document.createElement('ul');
        ul.classList.add('number');
        let selectedAge = null;

        for (let j = 1; j <= 12; j++) {
          const li = document.createElement('li');
          li.textContent = `${j}`;
          ul.appendChild(li);
          li.addEventListener('click', () => {
            if (selectedAge) {
              selectedAge.classList.remove('selected');
            }
            li.classList.add('selected');
            selectedAge = li;
            age.push(j);
          });
        }
        list[roomCount-1]['child']['age'] = age;
        childAge.appendChild(p);
        childAge.appendChild(ul);
      }
    }
    else{
      selectedListItemC.classList.remove('selected');
      list[roomCount-1]['child'] = {'count': 0};
      childAge.style.display = 'none';       // childAge.style.display = 'none';           // x-mark.style.display = 'none';
  
      licon.style.display = 'none';
    }
  }

  else if (target.classList.contains('finish')) {
       guestBox.classList.toggle('display');
       guestNum.classList.toggle('angle-up');
      
       calGuest()
      totGuest2.style.display = 'none';
      finalList2.style.display = 'block';
      finalList2.textContent = `${adultList} Adult, ${childList} Children`;
      if (childAgeAgain2)
      childAgeAgain2.style.display = 'none';
      edit2.style.display = 'block';
     
      lastBar.classList.add('bar');

      if (firstBlock){ 
      xMark2.style.display = 'block';
    }
  }

  else if (target.classList.contains('add-room')) {
    const clonedBox = block.cloneNode(true);
    guestBox.insertBefore(clonedBox, done);
  
    let totGuest = clonedBox.querySelector('.tot-guest');
    totGuest.style.display = 'flex';
    let finalList = clonedBox.querySelector('.final-list');
    finalList.style.display = 'none';
    let childAgeAgain  = clonedBox.querySelector('.child-age');
    if (childAgeAgain)
    childAgeAgain.style.display = 'none';
    let edit = clonedBox.querySelector('.edit');
    edit.style.display = 'none';
    let xMark = clonedBox.querySelector('.x-mark');
    xMark.style.display = 'none';
  
    let roomNo = clonedBox.querySelector('.room-no');
    roomNo.textContent = 'Room ' + counter;         // Set room number as 'Room 1', 'Room 2', and so on
    if (firstBlock){
      xMark2.style.display = 'block';
      lastBar.classList.add('bar');
    }
    list[counter-1] = {'adult' : 2, 'child' : {'count' : 0}}
    counter++;
    
    let selector1 = clonedBox.querySelectorAll('.number.child li');
    selector1.forEach(element => {
      if (element.classList.contains('selected'))       //selected child
        element.classList.remove('selected');
      if (element.classList.contains('display'))        //x-mark
        element.style.display = 'none';
    })

    let selector2 = clonedBox.querySelectorAll('.number.adult li');
    if (selector2[0].classList.contains('selected')){
      selector2[0].classList.remove('selected');
      selector2[1].classList.add('selected');
    }
  
    totGuest2.style.display = 'none';
    finalList2.style.display = 'block';
    if (childAgeAgain2)
    childAgeAgain2.style.display = 'none';
    edit2.style.display = 'block';
    licon.style.display = 'none';

    selectedItem.classList.remove('list-select');
    roomValue = list.length;
    room.forEach(element => {
      if (parseInt(element.getAttribute('data-value')) === roomValue){
        selectedItem = element;
      }
    });
    selectedItem.classList.add('list-select');
    roomNum.textContent = `Room 0${roomValue}`;
    calGuest();

    finalList2.textContent = `${adultList} Adult, ${childList} Children`;

    let blocks = document.querySelectorAll('.blocks');
    lastClickedBlock = blocks[blocks.length - 1];

    if (counter === 5)
    target.style.visibility = 'hidden';
    
  }

  else if (target.classList.contains('i-mark')){
    
    let removeClone = target.closest('.blocks');
    let roomContent = removeClone.querySelector('.room-no').textContent;
    let roomNumber = parseInt(roomContent[roomContent.length - 1]);
    
    removeClone.remove();
    list.splice(roomNumber - 1, 1);
    let blocks = document.querySelectorAll('.blocks');
    if(roomNumber === roomCount)
    lastClickedBlock = blocks[blocks.length - 1];

    selectedItem.classList.remove('list-select');
    roomValue = list.length;
    room.forEach(element => {
      if (parseInt(element.getAttribute('data-value')) === roomValue){
        selectedItem = element;
      }
    });
    selectedItem.classList.add('list-select');
    roomNum.textContent = `Room 0${roomValue}`;

    counter--;
    calGuest();

    addRoom.style.visibility = 'visible';

    let number = 1;
    let roomAll = document.querySelectorAll('.room-no');
    roomAll.forEach(item => {
      item.textContent = 'Room ' + number;
      number++;
    }); 
  }
 
});

room.forEach(element => {
  element.addEventListener('click', (e) =>{
    e.stopPropagation();

    roomValue = element.getAttribute('data-value');
    selectedItem.classList.remove('list-select');
    element.classList.add('list-select');
    roomNum.textContent = `Room 0${roomValue}`;
    selectedItem = element;
    if (counter <= roomValue)
      for(let i = counter; i <= roomValue; i++){
        createClone();
        calGuest();
      }
    else{
      let deletec = counter - roomValue;
      for(let i = 1; i < deletec; i++){
        removeCloneElement();
        calGuest();
      }
      let blocks = document.querySelectorAll('.blocks');
      lastClickedBlock = blocks[blocks.length - 1];
    }
    roomBox.classList.toggle('display');
    roomNum.classList.toggle('angle-up');
  });
});