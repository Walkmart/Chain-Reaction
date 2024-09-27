// Array of word chains for each day of the month (30 word chains)
let wordChainsByDay = [
    ["Sun", "Screen", "Door", "Bell", "Hop"],            // Day 1
    ["Rain", "Drop", "Zone", "Defense", "Shield"],       // Day 2
    ["Air", "Port", "Hole", "Punch", "Line"],            // Day 3
    ["Snow", "Ball", "Park", "Bench", "Press"],          // Day 4
    ["Fire", "Fly", "Wheel", "Barrow", "Race"],          // Day 5
    ["Water", "Fall", "Out", "Line", "Up"],              // Day 6
    ["Wind", "Mill", "Stone", "Wall", "Paper"],          // Day 7
    ["Ice", "Cream", "Cone", "Head", "Start"],           // Day 8
    ["Butter", "Fly", "Wheel", "Chair", "Lift"],         // Day 9
    ["Sand", "Castle", "Rock", "Climb", "Wall"],         // Day 10
    ["Star", "Fish", "Bowl", "Cut", "Out"],              // Day 11
    ["Light", "House", "Boat", "Race", "Track"],         // Day 12
    ["Moon", "Light", "Switch", "Board", "Game"],        // Day 13
    ["House", "Plant", "Pot", "Hole", "Cover"],          // Day 14
    ["Book", "Shelf", "Life", "Guard", "Dog"],           // Day 15
    ["Tooth", "Brush", "Stroke", "Line", "Up"],          // Day 16
    ["Paper", "Cut", "Out", "Side", "Walk"],             // Day 17
    ["Cup", "Board", "Game", "Plan", "Ahead"],           // Day 18
    ["Head", "Light", "House", "Key", "Chain"],          // Day 19
    ["Hand", "Shake", "Down", "Load", "Out"],            // Day 20
    ["Dog", "House", "Plant", "Pot", "Luck"],            // Day 21
    ["Night", "Owl", "Hawk", "Eye", "Patch"],            // Day 22
    ["Gold", "Mine", "Field", "Goal", "Keeper"],         // Day 23
    ["Time", "Line", "Up", "Lift", "Off"],               // Day 24
    ["Board", "Game", "Plan", "Ahead", "Time"],          // Day 25
    ["Brain", "Storm", "Cloud", "Burst", "Pipe"],        // Day 26
    ["Lip", "Stick", "Figure", "Skate", "Park"],         // Day 27
    ["Sea", "Shell", "Shock", "Wave", "Pool"],           // Day 28
    ["Chain", "Link", "Fence", "Post", "Card"],          // Day 29
    ["Fish", "Tank", "Top", "Hat", "Trick"],             // Day 30
    ["Coffee", "Mug", "Shot", "Glass", "Case"],          // Day 31
    ["Street", "Light", "Bulb", "Socket", "Wrench"],     // Day 32
    ["Power", "House", "Plant", "Tree", "Leaf"],         // Day 33
    ["Milk", "Shake", "Weight", "Lift", "Off"],          // Day 34
    ["Photo", "Graph", "Paper", "Cut", "Out"],           // Day 35
    ["Glass", "Bottle", "Cap", "Stone", "Throw"],        // Day 36
    ["Grass", "Hopper", "Field", "Goal", "Kick"],        // Day 37
    ["Hair", "Cut", "Out", "Line", "Up"],                // Day 38
    ["Eye", "Brow", "Line", "Dance", "Step"],            // Day 39
    ["Earth", "Quake", "Shock", "Wave", "Form"],         // Day 40
    ["Sea", "Horse", "Shoe", "Shine", "Polish"],         // Day 41
    ["Pen", "Pal", "Mate", "Ship", "Sail"],              // Day 42
    ["Soap", "Box", "Cutter", "Edge", "Sharp"],          // Day 43
    ["Space", "Bar", "Code", "Breaker", "Tool"],         // Day 44
    ["Step", "Brother", "In", "Law", "Suit"],            // Day 45
    ["Key", "Board", "Game", "Night", "Owl"],            // Day 46
    ["Wind", "Chime", "Time", "Zone", "Line"],           // Day 47
    ["Button", "Up", "Grade", "Point", "System"],        // Day 48
    ["Mind", "Set", "Piece", "Of", "Cake"],              // Day 49
    ["Cup", "Cake", "Walk", "Through", "Gate"],          // Day 50
    ["Paper", "Boy", "Band", "Member", "Card"],          // Day 51
    ["Ring", "Tone", "Deaf", "Mute", "Button"],          // Day 52
    ["Card", "Board", "Box", "Office", "Space"],         // Day 53
    ["Window", "Pane", "Glass", "Jar", "Opener"],        // Day 54
    ["Bottle", "Neck", "Tie", "Knot", "Line"],           // Day 55
    ["Star", "Wars", "Battle", "Ship", "Yard"],          // Day 56
    ["Fire", "Truck", "Stop", "Watch", "Tower"],         // Day 57
    ["Moon", "Walk", "Man", "Power", "Play"],            // Day 58
    ["Sun", "Flower", "Petal", "Fall", "Line"],          // Day 59
    ["Water", "Proof", "Coat", "Hanger", "Rack"],        // Day 60
    ["Road", "Sign", "Language", "School", "Bag"],       // Day 61
    ["Foot", "Step", "Counter", "Clock", "Wise"],        // Day 62
    ["Heart", "Beat", "Drop", "Zone", "Defense"],        // Day 63
    ["Bridge", "Gap", "Filler", "Station", "Wagon"],     // Day 64
    ["Blood", "Pressure", "Point", "Guard", "Dog"],      // Day 65
    ["Honey", "Comb", "Over", "See", "Saw"],             // Day 66
    ["Palm", "Tree", "House", "Plant", "Pot"],           // Day 67
    ["Letter", "Box", "Office", "Chair", "Lift"],        // Day 68
    ["Board", "Walk", "Over", "Take", "Off"],            // Day 69
    ["Bridge", "Stone", "Wall", "Paper", "Cut"],         // Day 70
    ["Mouse", "Trap", "Door", "Mat", "Tack"],            // Day 71
    ["Sound", "Track", "Record", "Player", "Piano"],     // Day 72
    ["Sun", "Tan", "Line", "Dance", "Step"],             // Day 73
    ["Coat", "Tail", "Spin", "Wheel", "Chair"],          // Day 74
    ["Water", "Bed", "Room", "Key", "Board"],            // Day 75
    ["Light", "Bulb", "Plant", "Seed", "Grow"],          // Day 76
    ["Fence", "Post", "Office", "Chair", "Leg"],         // Day 77
    ["Time", "Zone", "Line", "Up", "Lift"],              // Day 78
    ["Wood", "Pecker", "Bird", "Cage", "Lock"],          // Day 79
    ["Fire", "Cracker", "Jack", "Pot", "Hole"],          // Day 80
    ["Mail", "Box", "Car", "Lot", "Space"],              // Day 81
    ["Money", "Tree", "House", "Key", "Chain"],          // Day 82
    ["Dog", "Tag", "Team", "Building", "Block"],         // Day 83
    ["Blanket", "Fort", "Night", "Stand", "Point"],      // Day 84
    ["Brain", "Storm", "Drain", "Pipe", "Wrench"],       // Day 85
    ["Rocket", "Launch", "Pad", "Lock", "Step"],         // Day 86
    ["Shirt", "Tail", "Coat", "Hanger", "Rack"],         // Day 87
  
  ];
  
// Function to calculate the number of days since a given start date
function calculateDayIndex(startDate) {
    const today = new Date();
    const timeDiff = today.getTime() - startDate.getTime();  // Difference in milliseconds
    const daysPassed = Math.floor(timeDiff / (1000 * 60 * 60 * 24));  // Convert to days
    return daysPassed;
}

// Set the start date for your game (e.g., the day the game was first started)
const gameStartDate = new Date('2024-09-26'); // Replace this date with the actual game start date

// Calculate the current day index based on how many days have passed
let daysSinceStart = calculateDayIndex(gameStartDate);

// Get the word chain for today by using the modulo operator to wrap around after 30 days
let currentDayIndex = daysSinceStart % wordChainsByDay.length;

// Load the correct word chain for today based on currentDayIndex
let wordChain = wordChainsByDay[currentDayIndex]; 
let currentWordIndex = 1;  // Start from the second word (since the first word is pre-filled)
let targetWord = wordChain[currentWordIndex].toLowerCase();  // Set the current word to guess in lowercase
let attemptsLeft = 6;  // Number of attempts per word
let wordLength = targetWord.length;  // Length of the current word
let score = 100;  // Initial score
let hintsUsed = 0;  // Track how many hints have been used for the current word
let startTime;  // Track the start time for the timer
let timerInterval;  // To store the interval for the timer
let elapsedTime = 0;  // Time in seconds
let isTimerActive = false;  // Flag to ensure the timer only starts once

// Define the bonus points for completing the entire chain
const bonusPoints = 50;

// DOM Elements
const wordGrid = document.getElementById("word-grid");
const gameContainer = document.querySelector('.game-container');  // Game container
const guessInput = document.getElementById("guess-input");
const submitButton = document.getElementById("submit-guess");
const hintButton = document.getElementById("hint-btn");  // Hint button element
const feedback = document.getElementById("feedback");
const attemptCountDisplay = document.getElementById("attempt-count");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");  // For showing the timer
const resultsScreen = document.getElementById("results-screen");  // Results screen
const finalScoreDisplay = document.getElementById("final-score");  // Final score display in results
const finalTimeDisplay = document.getElementById("final-time");  // Final time display in results
const shareButton = document.getElementById("share-results");  // Share button

// Modal Elements
const modal = document.getElementById("info-modal");
const infoBtn = document.getElementById("info-btn");
const closeBtn = document.getElementsByClassName("close")[0];

// Modal functionality: Open and close the info modal
infoBtn.onclick = function() {
  modal.style.display = "block";
}
closeBtn.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Create grids for all words in the chain and pre-fill the first word
function createAllGrids() {
  wordGrid.innerHTML = '';  // Clear any previous grid

  // Loop through each word in the word chain and create a grid for it
  wordChain.forEach((word, index) => {
    const wordRow = document.createElement('div');
    wordRow.classList.add('word-row');
    wordRow.id = `word-row-${index}`;  // Unique ID for each word row
    wordRow.style.gridTemplateColumns = `repeat(${word.length}, 50px)`;  // Set grid columns based on word length

    // Create boxes (tiles) for each letter in the word
    for (let i = 0; i < word.length; i++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      tile.setAttribute('data-word-index', index);  // Identify the word by index
      
      // Pre-fill the first word (e.g., "Sun")
      if (index === 0) {
        tile.innerText = word[i].toUpperCase();  // Pre-fill the first word automatically
        tile.classList.add("correct");  // Mark the first word as correct
        tile.classList.add("locked");  // Lock the first word so it won't be editable
      }

      wordRow.appendChild(tile);
    }

    wordGrid.appendChild(wordRow);  // Add the row to the word grid
  });
}

// Timer function
function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);  // Update every second
}

// Update the timer display
function updateTimer() {
    elapsedTime = Math.floor((Date.now() - startTime) / 1000);  // Time in seconds
  
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
  
    // Display in "MM:SS" format
    timerDisplay.innerText = `Time: ${minutes}m ${seconds}s`;
  }
  
  

// Stop the timer when the game is finished
function stopTimer() {
  clearInterval(timerInterval);  // Stop the timer
}

// Show results screen for both completion and failure cases
function showResultsScreen(failed = false) {
    stopTimer();  // Stop the timer
    gameContainer.style.display = 'none';  // Hide the game screen
    resultsScreen.style.display = 'block';  // Show the results screen
  
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
  
    if (failed) {
      finalScoreDisplay.innerText = `You reached word ${currentWordIndex + 1} out of ${wordChain.length} with a score of ${score}.`;
    } else {
      finalScoreDisplay.innerText = `Congratulations! You completed the game with a score of ${score}.`;
    }
  
    // Display final time in "MM:SS" format
    finalTimeDisplay.innerText = `Time: ${minutes}m ${seconds}s`;
  
    // Show the "Share Results" button after exiting the results screen
    document.getElementById('main-share-button').style.display = 'block';
  }
  
  

// Copy results to clipboard for sharing with either success or failure message
function shareResults(failed = false) {
  const websiteLink = "https://walkmart.github.io/Chain-Reaction/";  // Replace with your actual website URL
  let resultsText;

  if (failed) {
    resultsText = `I reached word ${currentWordIndex + 1} out of ${wordChain.length} on Word Trail with a score of ${score}. Can you beat my progress?\nCheck out the game here: ${websiteLink}`;
  } else {
    resultsText = `I completed the Word Trail in ${elapsedTime} seconds with a score of ${score}! Can you beat my time?\nCheck out the game here: ${websiteLink}`;
  }

  // Copy the results text to the clipboard
  navigator.clipboard.writeText(resultsText).then(() => {
    alert('Results copied to clipboard! Share it with your friends.');
  }).catch(err => {
    // If clipboard copy fails, show a message for manual copy
    alert(`Failed to copy automatically. Please select and copy the following:\n\n${resultsText}`);
  });
}

// Function to update the tiles dynamically as the user types
function updateTiles() {
  const userGuess = guessInput.value.trim().toLowerCase();
  const wordRow = document.getElementById(`word-row-${currentWordIndex}`);  // Always target the correct row
  const tiles = wordRow.querySelectorAll('.tile');  // Select tiles in the correct row

  // Clear the current tiles for the current word row only
  tiles.forEach((tile, index) => {
    if (!tile.classList.contains('locked')) {  // Only update if it's not locked
      tile.innerText = '';  // Clear the tile text
      if (userGuess[index]) {
        tile.innerText = userGuess[index].toUpperCase();  // Fill with user input
      }
    }
  });
}

// Function to give feedback on the user's guess when they submit
function checkGuess() {
  const userGuess = guessInput.value.trim().toLowerCase();  // Trim and convert input to lowercase

  // Start the timer on the first guess (only once)
  if (!isTimerActive) {
    startTimer();
    isTimerActive = true;  // Mark the timer as active
  }

  // Validate that the guess is the correct length
  if (userGuess.length !== wordLength) {
    feedback.innerText = `Please enter a ${wordLength}-letter word.`;
    return;
  }

  feedback.innerText = "";  // Clear feedback if the guess is valid

  // Find the correct word row and update it with the user's guess
  const wordRow = document.getElementById(`word-row-${currentWordIndex}`);
  const tiles = wordRow.querySelectorAll('.tile');

  let correctGuess = true;  // Track if the guess is correct or not

  // Reset the classes for all tiles in the row
  tiles.forEach(tile => {
    tile.classList.remove("correct", "wrong", "shake");
  });

  // Update the tiles for the current word
  for (let i = 0; i < wordLength; i++) {
    const tile = tiles[i];
    tile.innerText = userGuess[i].toUpperCase();  // Show the guessed letter

    // Provide feedback (green if correct, gray if incorrect)
    if (userGuess[i] === targetWord[i]) {
      tile.classList.add("correct");
    } else {
      tile.classList.add("wrong");
      correctGuess = false;  // Mark the guess as incorrect
    }
  }

  if (!correctGuess) {
    score -= 10;  // Deduct points for wrong guess

    // Add shake effect to the tiles
    tiles.forEach(tile => {
      tile.classList.add("shake");  // Apply the shake animation
    });

    // Remove the shake class after the animation completes
    setTimeout(() => {
      tiles.forEach(tile => {
        tile.classList.remove("shake");
      });
    }, 500);  // Time matches the shake animation duration
  }

  // Decrement attempts
  attemptsLeft--;
  attemptCountDisplay.innerText = attemptsLeft;
  scoreDisplay.innerText = score;

  // Check if the user guessed the word correctly
  if (correctGuess) {
    // Immediately lock the tiles in the current row to prevent further changes
    tiles.forEach(tile => {
      tile.classList.add("locked");  // Lock the tiles instantly
    });

    feedback.innerText = "Correct! Moving to the next word...";
    moveToNextWord();
  } else if (attemptsLeft === 0) {
    feedback.innerText = `Game Over! The word was: ${targetWord}.`;
    revealRemainingWords();  // Reveal all the correct answers
    submitButton.disabled = true;
    guessInput.disabled = true;
    stopTimer();  // Stop the timer
    showResultsScreen(true);  // Pass 'true' to indicate the game was failed
  }

  // Clear input for the next guess
  guessInput.value = "";
}

// Function to reveal all remaining correct words when the game is lost
function revealRemainingWords() {
  // Loop through all words in the chain and fill in the correct letters for unguessed words
  wordChain.forEach((word, index) => {
    if (index >= currentWordIndex) {  // Only reveal for unguessed words
      const wordRow = document.getElementById(`word-row-${index}`);
      const tiles = wordRow.querySelectorAll('.tile');
      
      // Fill in the correct letters for the current word
      tiles.forEach((tile, i) => {
        if (!tile.classList.contains('correct')) {
          tile.innerText = word[i].toUpperCase();
        }
      });
    }
  });
}

// Function to give hints (reveal one or two letters and clear incorrect guesses)
function giveHint() {
  const wordRow = document.getElementById(`word-row-${currentWordIndex}`);
  const tiles = wordRow.querySelectorAll('.tile');
  
  // Clear the row of all previous guesses (whether correct or incorrect)
  tiles.forEach((tile) => {
    if (!tile.classList.contains('locked')) {  // Do not clear locked or correct tiles
      tile.innerText = '';  // Clear the text
      tile.classList.remove('wrong', 'shake');  // Remove any wrong or shake effects
    }
  });

  // Clear the input field as well
  guessInput.value = '';

  // Reveal one letter at a time based on the number of hints used
  for (let i = 0; i < wordLength; i++) {
    if (tiles[i].innerText === "") {
      tiles[i].innerText = targetWord[i].toUpperCase();  // Reveal the correct letter
      tiles[i].classList.add("correct");  // Mark the revealed letter as correct
      hintsUsed++;
      break;
    }
  }

  // Deduct points based on how many hints are used
  if (hintsUsed <= 1) {
    score -= 5;  // Deduct 5 points for the first hint
  } else if (hintsUsed === 2) {
    score -= 10;  // Deduct 10 points for the second hint
    hintButton.disabled = true;  // Disable hint button after 2 hints
  }
  
  scoreDisplay.innerText = score;  // Update score display
}

// Function to move to the next word (with bonus for completing the entire chain)
function moveToNextWord() {
  currentWordIndex++;  // Move to the next word in the chain

  // Check if the entire chain is complete
  if (currentWordIndex >= wordChain.length) {
    feedback.innerText = "Congratulations! You've completed the word chain!";

    // Apply bonus points for completing the entire chain
    score += bonusPoints;
    scoreDisplay.innerText = score;  // Update the score display

    // Display bonus points message
    feedback.innerText += ` Bonus: +${bonusPoints} points!`;

    // Trigger confetti when the game is completed
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Show the results screen with the final time and score
    showResultsScreen();
    
    submitButton.disabled = true;
    hintButton.disabled = true;
    guessInput.disabled = true;
    return;
  }

  // Set up the next word
  targetWord = wordChain[currentWordIndex].toLowerCase();  // Make the next word lowercase for comparison
  wordLength = targetWord.length;  // Make sure wordLength is updated
  attemptsLeft = 6;  // Reset attempts
  hintsUsed = 0;  // Reset hints for the next word
  attemptCountDisplay.innerText = attemptsLeft;
  scoreDisplay.innerText = score;

  guessInput.value = "";  // Clear the input for the next word
  hintButton.disabled = false;  // Enable the hint button for the new word
}

// Event listener to update the tiles as the user types
guessInput.addEventListener("input", updateTiles);

// Event listener for the submit button
submitButton.addEventListener("click", checkGuess);

// Event listener for the hint button
hintButton.addEventListener("click", giveHint);

// Event listener for the "Enter" key to submit the guess
guessInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    checkGuess();
  }
});

// Share button functionality (same as share button on results screen)
const mainShareButton = document.getElementById('main-share-button');

mainShareButton.addEventListener('click', () => {
  // Trigger the same share functionality as the results screen
  shareResults(attemptsLeft === 0);
});

// Event listener for the share button on the results screen
shareButton.addEventListener("click", () => shareResults(attemptsLeft === 0));  // Pass 'failed' argument

// DOM Elements for the results close button
const closeResultsButton = document.getElementById("close-results");

// Close the results screen and show the share button
function closeResultsScreen() {
    resultsScreen.style.display = 'none';  // Hide the results screen
    gameContainer.style.display = 'block';  // Show the game container again
  
    // Show the share button on the main screen
    document.getElementById('main-share-button').style.display = 'block';
  }
  

// Event listener for the close button on the results screen
closeResultsButton.addEventListener("click", closeResultsScreen);

// Call necessary functions to start the game
createAllGrids();  // Set up the word grids
attemptCountDisplay.innerText = attemptsLeft;
scoreDisplay.innerText = score;