// ====== CONSTANTS ======
const WORD = "GIRLFRIEND";
const MAX_ATTEMPTS = 10;
const WORD_LENGTH = WORD.length;

// ====== STATE ======
let currentAttempt = 0;
let currentGuess = "";

// ====== DOM ELEMENTS ======
const board = document.getElementById("game-board");
const keyboard = document.getElementById("keyboard");
const message = document.getElementById("message");

// ====== FUNCTION DECLARATIONS FIRST ======

// Show messages below the game
const showMessage = (text) => {
  message.textContent = text;
};

// Disable the keyboard (end of game)
const disableKeyboard = () => {
  const keys = document.querySelectorAll(".key");
  keys.forEach(key => key.disabled = true);
};

// Update the visible tiles
const updateBoard = () => {
  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = document.getElementById(`tile-${currentAttempt}-${i}`);
    tile.textContent = currentGuess[i] || "";
  }
};

// Handle a key press
const handleLetter = (letter) => {
  if (currentGuess.length < WORD_LENGTH) {
    currentGuess += letter.toUpperCase();
    updateBoard();
  }
};

// Process and validate a guess
const submitGuess = () => {
  if (currentGuess.length !== WORD_LENGTH) {
    showMessage("Not enough letters.");
    return;
  }

  const guess = currentGuess.toUpperCase();
  const correct = WORD.toUpperCase();
  const tileStates = Array(WORD_LENGTH).fill("gray");
  const letterCount = {};

  for (const char of correct) {
    letterCount[char] = (letterCount[char] || 0) + 1;
  }

  // First pass - green
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === correct[i]) {
      tileStates[i] = "green";
      letterCount[guess[i]]--;
    }
  }

  // Second pass - yellow
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (tileStates[i] === "green") continue;
    if (correct.includes(guess[i]) && letterCount[guess[i]] > 0) {
      tileStates[i] = "yellow";
      letterCount[guess[i]]--;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    const tile = document.getElementById(`tile-${currentAttempt}-${i}`);
    tile.classList.add(tileStates[i]);
  }

  if (guess === correct) {
    showMessage("🎉 You got it! Check the console 😉");
    console.log("💌 Will you be my girlfriend?");
    disableKeyboard();
    return;
  }

  currentAttempt++;
  currentGuess = "";

  if (currentAttempt === MAX_ATTEMPTS) {
    showMessage(`Game Over! The word was "${WORD}".`);
    disableKeyboard();
  }
};

// ====== NOW SAFE TO RENDER UI ======

// Create board tiles
for (let i = 0; i < MAX_ATTEMPTS; i++) {
  const row = document.createElement("div");
  row.className = "row";
  row.setAttribute("id", `row-${i}`);

  for (let j = 0; j < WORD_LENGTH; j++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.setAttribute("id", `tile-${i}-${j}`);
    row.appendChild(tile);
  }

  board.appendChild(row);
}

// Render on-screen keyboard
const renderKeyboard = () => {
  const rows = [
    "qwertyuiop",
    "asdfghjkl",
    "zxcvbnm",
  ];

  rows.forEach(row => {
    const rowDiv = document.createElement("div");

    row.split("").forEach(letter => {
      const button = document.createElement("button");
      button.className = "key";
      button.textContent = letter;
      button.addEventListener("click", () => handleLetter(letter));
      rowDiv.appendChild(button);
    });

    keyboard.appendChild(rowDiv);
  });

  const enter = document.createElement("button");
  enter.textContent = "Enter";
  enter.className = "key large";
  enter.addEventListener("click", submitGuess);
  keyboard.appendChild(enter);

  const back = document.createElement("button");
  back.textContent = "Del";
  back.className = "key large";
  back.addEventListener("click", () => {
    currentGuess = currentGuess.slice(0, -1);
    updateBoard();
  });
  keyboard.appendChild(back);
};

renderKeyboard();

// Handle physical keyboard input
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (key === "Enter") {
    submitGuess();
  } else if (key === "Backspace") {
    currentGuess = currentGuess.slice(0, -1);
    updateBoard();
  } else if (/^[a-zA-Z]$/.test(key)) {
    handleLetter(key.toLowerCase());
  }
});
