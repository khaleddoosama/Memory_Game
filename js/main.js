// Select The Start Game Button
var arr=new Array([1,2,3]);
console.log(arr);

let yourName;
document.querySelector(".control-buttons span").onclick = function () {

  document.querySelector(".control-buttons span").style.display = "none"; // hide the button
  document.querySelector("form").classList.remove("d-none"); // show the form

  // Auto Focus the input
  document.querySelector("#staticName").focus();
  
  // when the form is submitted
  document.querySelector("form").onsubmit = function () {
    yourName = document.querySelector("#staticName").value; // get the value of the input



    document.querySelector("form").classList.add("d-none"); // hide the form

    // If Name Is Empty
    if (yourName == null || yourName == "") {
      yourName = 'Unknown';
    }
    document.querySelector(".name span").innerHTML = yourName;

    // Remove Splash Screen
    document.querySelector(".control-buttons").remove();


    // Add  Names To The Local Storage Array (If It Exists) Or Create It If It Doesn't Exist
    if (window.localStorage.getItem('Names') != null) {

      // check if the name is already in the array if not add it
      if (window.localStorage.getItem('Names').indexOf(yourName) == -1) {

        // Add Name To Array
        window.localStorage.setItem('Names', window.localStorage.getItem('Names') + ',' + yourName);
      
        // Make Default Number Of Wins Is 0
        window.localStorage.setItem(yourName, 0);
      }
    } else {

      // Create An Array To Store The Names
      let names = [];

      // Add Your Name To The Array
      names.push(yourName);

      // Set The Names To Local Storage
      window.localStorage.setItem('Names', JSON.stringify(names));

      // Make Default Number Of Wins Is 0
      window.localStorage.setItem(yourName, 0);
    }


    // show all blocks after shuffle in duration seconds 
    flipAllBlocks();

    // display score
    displayScore();
  }
}

// Effect Duration
let duration = 1000;
// Select Blocks Container
let blocksContainer = document.querySelector(".memory-game-blocks");

// Select Blocks Container
let gameBlocks = document.querySelectorAll(".game-block");

// Create Array From Game Blocks
let blocks = Array.from(gameBlocks);

// Create Range Of Keys
// let orderRange = [...Array(blocks.length).keys()];

let orderRange = Array.from(Array(blocks.length).keys());

//console.log(orderRange);
shuffle(orderRange);
//console.log(orderRange);
let order0 = document.querySelector('.order-0');
let order1 = document.querySelector('.order-1');
let order2 = document.querySelector('.order-2');
let order3 = document.querySelector('.order-3');

// Add Order Css Property To Game Blocks
for (let i = 0; i < blocks.length; i++) {

  // Add CSS Order Property
  blocks[i].style.order = orderRange[i];

  if (orderRange[i] >= 0 && orderRange[i] <= 4) {
    order0.appendChild(blocks[i]);
  }
  if (orderRange[i] >= 5 && orderRange[i] <= 9) {
    order1.appendChild(blocks[i]);
  }
  if (orderRange[i] >= 10 && orderRange[i] <= 14) {
    order2.appendChild(blocks[i]);
  }
  if (orderRange[i] >= 15 && orderRange[i] <= 19) {
    order3.appendChild(blocks[i]);
  }
    
    
  // Add Click Event
  blocks[i].addEventListener('click', function () {
      
    // Trigger The Flip Block Function
    flipBlock(blocks[i]);
  });

}


// Flip Block Function
function flipBlock(selectedBlock) {

  // Add Class is-flipped
  selectedBlock.classList.add('is-flipped');

  // Collect All Flipped Cards
  let allFlippedBlocks = blocks.filter(flippedBlock => flippedBlock.classList.contains('is-flipped'));

  // If Theres Two Selected Blocks
  if (allFlippedBlocks.length === 2) {

    // console.log('Two Flipped Blocks Selected');

    // Stop Clicking Function
    stopClicking();

    // Check Matched Block Function
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);

    // Check Win Function
    checkWin();

    // Check Lose Function
    checkLose();

  }

}

// Stop Clicking Function
function stopClicking() {

  // Add Class No Clicking on Main Container
  blocksContainer.classList.add('no-clicking');

  // Wait Duration
  setTimeout(() => {

    // Remove Class No Clicking After The Duration
    blocksContainer.classList.remove('no-clicking');

  }, duration);

}

// Check Matched Block
function checkMatchedBlocks(firstBlock, secondBlock) {

  let triesElement = document.querySelector('.tries span');

  if (firstBlock.dataset.technology === secondBlock.dataset.technology) {

    firstBlock.classList.remove('is-flipped');
    secondBlock.classList.remove('is-flipped');

    firstBlock.classList.add('has-match');
    secondBlock.classList.add('has-match');

    document.getElementById('success').play();

  } else {

    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

    setTimeout(() => {

      firstBlock.classList.remove('is-flipped');
      secondBlock.classList.remove('is-flipped');

    }, duration);

    document.getElementById('fail').play();

  }

}

// Shuffle Function
function shuffle(array) {

  // Settings Vars
  let current = array.length,
      temp,
      random;

  while (current > 0) {

    // Get Random Number
    random = Math.floor(Math.random() * current);

    // Decrease Length By One
    current--;

    // [1] Save Current Element in Stash
    temp = array[current];

    // [2] Current Element = Random Element
    array[current] = array[random];

    // [3] Random Element = Get Element From Stash
    array[random] = temp;

  }
  return array;
}

function checkWin() {

  let allMatchedBlocks = blocks.filter(matchedBlock => matchedBlock.classList.contains('has-match'));

  if (allMatchedBlocks.length === blocks.length) {

      // Increment the number of wins by 1 for the current player in local storage
    if (window.localStorage.getItem(yourName) != null) {
      window.localStorage.setItem(yourName, parseInt(window.localStorage.getItem(yourName)) + 1);
    } 
    showModal();

  // Update Score
  removeScore();
  displayScore();
  }


  // Update the number of wins for the current  player in the UI
}
function checkLose() {

  let triesElement = document.querySelector('.tries span');

  if (triesElement.innerHTML === '10') {

    setTimeout(() => {
        
      document.getElementById('exampleModalCenterTitle').innerHTML = 'You Lose!';
      
      document.getElementsByClassName('modal-body')[0].innerHTML = '<p>You Have Tried To Match The Blocks 10 Times. Try Again!</p>';

      blocksContainer.classList.add('no-clicking');

      showModal();      
    }, duration);
    
  }
}

// Close Modal Function (Click On btn-secondary)
document.querySelector(".btn-secondary").onclick = removeModal;

// Close Modal Function (Click On btn-close)
document.querySelector(".btn-close").onclick = removeModal;

// Reset The Game (Click On btn-primary)
document.querySelector(".btn-primary").onclick = function () {
  removeModal();

  // Reset The Game
  resetGame();
    

}

 // Reset The Game
function resetGame() {
 // Remove Class is-flipped
  blocks.forEach(block => {
    block.classList.remove('is-flipped');
    block.classList.remove('has-match');
  }
  );
  
  // Reset Tries
  let triesElement = document.querySelector('.tries span');
  triesElement.innerHTML = parseInt(0);
  
  // Reset Order
  orderRange = Array.from(Array(blocks.length).keys());
  shuffle(orderRange);

  // Add Order Css Property To Game Blocks
  for (let i = 0; i < blocks.length; i++) {
      
      // Add CSS Order Property
      blocks[i].style.order = orderRange[i];
  
      if (orderRange[i] >= 0 && orderRange[i] <= 4) {
        order0.appendChild(blocks[i]);
      }
      if (orderRange[i] >= 5 && orderRange[i] <= 9) {
        order1.appendChild(blocks[i]);
      }
      if (orderRange[i] >= 10 && orderRange[i] <= 14) {
        order2.appendChild(blocks[i]);
      }
      if (orderRange[i] >= 15 && orderRange[i] <= 19) {
        order3.appendChild(blocks[i]);
      }   
  }
  // Remove Class No Clicking After The Duration
  blocksContainer.classList.remove('no-clicking');


}

// all blocks are flipped in duration time (duration)
function flipAllBlocks() {
  blocks.forEach(block => {
    block.classList.add('is-flipped');
  }
  );
  setTimeout(() => {
    blocks.forEach(block => {
      block.classList.remove('is-flipped');
    }
    );
  },2000)
}

// show modal and overlay
function showModal() {
  // the modal will appear
  let modal = document.querySelector(".modal");
  modal.style.top = "0";
  modal.style.opacity = "1";
  modal.style.zIndex = "1";

  //the overlay will appear
  document.body.children[0].classList.add("overlay");

  // if the user click in the overlay, she will be able to close the modal
      document.body.children[0].addEventListener('click', function () {
            removeModal();
      });
}

// Remove the modal and the overlay
function removeModal() {
  // the modal will appear
  let modal = document.querySelector(".modal");
  modal.style.top = "-100%";
  modal.style.opacity = "0";
  modal.style.zIndex = "-1";

  //the overlay will appear
  document.body.children[0].classList.remove("overlay");
}

function displayScore() {

    // Display The Leaderboard
  let tbody = document.querySelector('.leader .container tbody');
  
  // Get The Local Storage
  let localStorage = window.localStorage;

  // Get The Local Storage Length
  let localStorageLength = localStorage.length;

  

  // Create The Table Data
  for (let i = 0; i < localStorageLength; i++) {
    if (localStorage.key(i) == "Names")
    {
      continue;
    }
    // Create The Table Row
    let tableRow = document.createElement('tr');

    // Create The Table Data
    let tableData1 = document.createElement('th');
    let tableData2 = document.createElement('td');
    let tableData3 = document.createElement('td');
    tableData1.innerHTML = i;
    tableData2.innerHTML = localStorage.key(i);
    tableData3.innerHTML = localStorage.getItem(localStorage.key(i));



    // Append The Table Data To The Table Row
    tableRow.appendChild(tableData1);
    tableRow.appendChild(tableData2);
    tableRow.appendChild(tableData3);

    // Append The Table Row To The Table Body
    tbody.appendChild(tableRow);
  }
}

// Remove The Leaderboard Score
function removeScore() {
  let tbody = document.querySelector('.leader .container tbody');
  tbody.innerHTML = '';
}