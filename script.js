// Word chain for the game
let wordChain = ["Rain", "Drop", "Down", "Town", "Hall"];
let currentWordIndex = 1;  // Start from the second word (since the first word is pre-filled)
let targetWord = wordChain[currentWordIndex].toLowerCase();  // Set the current word to guess in lowercase
let attemptsLeft = 6;  // Number of attempts per word
let wordLength = targetWord.length;  // Length of the current word
let score = 100;  // Initial score
let hintsUsed = 0;  // Track how many hints have been used for the current word

// Define the bonus points for completing the entire chain
const bonusPoints = 50;

// DOM Elements
const wordGrid = document.getElementById("word-grid");
const guessInput = document.getElementById("guess-input");
const submitButton = document.getElementById("submit-guess");
const hintButton = document.getElementById("hint-btn");  // Hint button element
const feedback = document.getElementById("feedback");
const attemptCountDisplay = document.getElementById("attempt-count");
const scoreDisplay = document.getElementById("score");

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

createAllGrids();  // Call this to create the grids for all words at the start

// Update attempts display
attemptCountDisplay.innerText = attemptsLeft;
scoreDisplay.innerText = score;

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

    // Move to the next word immediately
    moveToNextWord();
  } else if (attemptsLeft === 0) {
    feedback.innerText = `Game Over! The word was: ${targetWord}.`;
    submitButton.disabled = true;
    guessInput.disabled = true;
  }

  // Clear input for the next guess
  guessInput.value = "";
}

// Function to give hints (reveal one or two letters)
function giveHint() {
  const wordRow = document.getElementById(`word-row-${currentWordIndex}`);
  const tiles = wordRow.querySelectorAll('.tile');
  
  // Reveal one letter at a time based on the number of hints used
  for (let i = 0; i < wordLength; i++) {
    if (tiles[i].innerText === "") {
      tiles[i].innerText = targetWord[i].toUpperCase();
      tiles[i].classList.add("correct");
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
  
  scoreDisplay.innerText = score;
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

// Event listener for "Enter" key to submit the guess
guessInput.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    checkGuess();
  }
});
