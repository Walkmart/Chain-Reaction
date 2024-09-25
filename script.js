// Array of word chains (just an example, you can add more)
const wordChain = ["Sand", "Beach", "Ocean", "Wave", "Surf"];
let currentWordIndex = 0;
let attemptsLeft = 5;
let hintsLeft = 3;  // Total number of hints
let hintLetterCount = 0;  // Number of letters revealed so far for the current word
let score = 0;  // Player's score

// Get DOM elements
const currentWordDisplay = document.getElementById("current-word");
const guessInput = document.getElementById("guess-input");
const submitButton = document.getElementById("submit-guess");
const hintButton = document.getElementById("hint-button");
const feedback = document.getElementById("feedback");
const attemptCountDisplay = document.getElementById("attempt-count");
const hintCountDisplay = document.getElementById("hint-count");
const scoreDisplay = document.getElementById("score-display");

// Initialize the game with the first word
currentWordDisplay.innerText = wordChain[currentWordIndex];
attemptCountDisplay.innerText = attemptsLeft;
hintCountDisplay.innerText = hintsLeft;
scoreDisplay.innerText = score;

// Function to check the user's guess
function checkGuess() {
    const userGuess = guessInput.value.trim();

    // Check if the guess matches the next word in the chain
    if (userGuess.toLowerCase() === wordChain[currentWordIndex + 1].toLowerCase()) {
        feedback.innerText = "Correct!";
        currentWordIndex++;  // Move to the next word
        currentWordDisplay.innerText = wordChain[currentWordIndex];
        guessInput.value = "";  // Clear the input box
        hintLetterCount = 0;  // Reset hint letter count for the new word

        // Award points for the correct guess
        score += 10;
        scoreDisplay.innerText = score;

        // Check if the game is completed
        if (currentWordIndex === wordChain.length - 1) {
            feedback.innerText = "You completed the chain! 🎉";
            submitButton.disabled = true;
            hintButton.disabled = true;

            // Calculate bonus points for remaining attempts and unused hints
            let bonusPoints = attemptsLeft * 5 + hintsLeft * 5;
            score += bonusPoints;
            feedback.innerText += ` You earned ${bonusPoints} bonus points!`;

            // Update final score
            scoreDisplay.innerText = score;
        }
    } else {
        // Penalize for a wrong guess
        feedback.innerText = "Wrong guess! -5 points.";
        score -= 5;  // Deduct points for wrong guess
        scoreDisplay.innerText = score;

        attemptsLeft--;  // Decrease remaining attempts
        attemptCountDisplay.innerText = attemptsLeft;

        if (attemptsLeft === 0) {
            feedback.innerText = "Game Over! You ran out of attempts.";
            submitButton.disabled = true;
            hintButton.disabled = true;
        }
    }
}

// Function to provide multiple hints (incrementally reveal letters)
function giveHint() {
    if (hintsLeft > 0 && currentWordIndex < wordChain.length - 1) {
        const nextWord = wordChain[currentWordIndex + 1];
        
        // Reveal one more letter if there are any left to reveal
        if (hintLetterCount < nextWord.length) {
            feedback.innerText = `Hint: The next word starts with "${nextWord.substring(0, hintLetterCount + 1)}"`;
            hintLetterCount++;  // Increase revealed letter count
            hintsLeft--;  // Decrease hint count
            hintCountDisplay.innerText = hintsLeft;
            
            // Disable hint button if no more hints are left
            if (hintsLeft === 0) {
                hintButton.disabled = true;
            }
        } else {
            feedback.innerText = "All letters for this word have been revealed!";
        }
    }
}

// Add event listener to the submit button
submitButton.addEventListener("click", checkGuess);

// Add event listener to allow pressing 'Enter' to submit the guess
guessInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        checkGuess();
    }
});

// Add event listener to the hint button
hintButton.addEventListener("click", giveHint);
