/* Setting game options */
let guessChances = 6;
let lettersNumber = 5;
let currentGuess = 1;
let hintsNumber = 2;

/* Words Mechanism */
let words = [
  "Drive",
  "Diver",
  "Fight",
  "Light",
  "Snipe",
  "Super",
  "About",
  "Alert",
  "Argue",
  "Beach",
  "Above",
  "Alike",
  "Arise",
  "Abuse",
  "Alive",
  "Array",
  "Begin",
  "Actor",
  "Allow",
  "Aside",
  "Clean",
  "Crown",
  "Clown",
  "Crowd",
  "Proud",
  "Cloud",
  "Chase",
  "Place",
  "Mouse",
  "House",
  "Build",
  "Front",
  "Final",
  "First",
  "Early",
  "Earth",
  "Grass",
];
let randomWord = words[Math.floor(Math.random() * words.length)].toUpperCase();

/* check word and game ending */
const checkButton = document.querySelector(".check");
checkButton.addEventListener("click", checkWord);
let messageArea = document.querySelector(".msg");

/* Hints */
document.querySelector(".hint span").innerHTML = hintsNumber;
const hintButton = document.querySelector(".hint");
hintButton.addEventListener("click", giveHint);

function generateInputs() {
  const inputsContainer = document.querySelector(".inputs");
  for (let i = 1; i <= guessChances; i++) {
    const guessDiv = document.createElement("div");
    guessDiv.classList.add(`guess-${i}`);
    guessDiv.innerHTML = `<span>Guess ${i}</span>`;
    /* disable the rest of the inputs containers */
    if (i != 1) {
      guessDiv.classList.add("disabled-inputs");
    }
    /* create inputs to hold letters  for each guess */
    for (let j = 1; j <= lettersNumber; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.maxLength = 1;
      guessDiv.appendChild(input);
    }
    inputsContainer.appendChild(guessDiv);
  }
  /* focus on first element */
  inputsContainer.children[0].children[1].focus();

  /* Disable all inputs in disabled containers */
  const inputsDisabled = document.querySelectorAll(".disabled-inputs input");
  inputsDisabled.forEach((input) => (input.disabled = true));

  /*convert input to upper case and focus on next input */
  const inputs = document.querySelectorAll(".inputs input");
  inputs.forEach((input, index) => {
    /*  */
    input.addEventListener("input", () => {
      input.value = input.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput) nextInput.focus();
    });
  });
}

function checkWord() {
  let correctWord = true;
  for (let i = 1; i <= lettersNumber; i++) {
    const input = document.getElementById(`guess-${currentGuess}-letter-${i}`);
    const letter = input.value;
    const actualLetter = randomWord[i - 1];
    if (letter === actualLetter) {
      input.classList.add("in-place");
    } else if (randomWord.includes(letter) && letter != "") {
      input.classList.add("not-in-place");
      correctWord = false;
    } else {
      input.classList.add("wrong");
      correctWord = false;
    }
  }
  /* Check if user won the game */
  if (correctWord) {
    /* Disaplay Message */
    messageArea.innerHTML = `You won !!! The word is <span>${randomWord}</span>`;
    /* add disabled class to all guess divs */
    let allInputsDivs = document.querySelectorAll(".inputs > div");
    allInputsDivs.forEach((guessDiv) =>
      guessDiv.classList.add("disabled-inputs")
    );
    /* disable buttons*/
    checkButton.disabled = true;
    hintButton.disabled = true;
  } else {
    document
      .querySelector(`.guess-${currentGuess}`)
      .classList.add("disabled-inputs");
    const inputsToDisable = document.querySelectorAll(
      `.guess-${currentGuess} input`
    );
    inputsToDisable.forEach((input) => (input.disabled = true));
    if (currentGuess < guessChances) {
      currentGuess++;
      document
        .querySelector(`.guess-${currentGuess}`)
        .classList.remove("disabled-inputs");
      const nextInputs = document.querySelectorAll(
        `.guess-${currentGuess} input`
      );
      nextInputs.forEach((input) => (input.disabled = false));
    } else {
      /* Disaplay Message */
      messageArea.innerHTML = `You Lose :( :( The word is <span>${randomWord}</span>`;
      /* disable buttons*/
      checkButton.disabled = true;
      hintButton.disabled = true;
    }
  }
}

function giveHint() {
  if (hintsNumber > 0) {
    hintsNumber--;
    document.querySelector(".hint span").innerHTML = hintsNumber;
  }
  if (hintsNumber === 0) {
    hintButton.disabled = true;
  }
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );
  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const indexToFill = Array.from(enabledInputs).indexOf(
      emptyEnabledInputs[randomIndex]
    );
    enabledInputs[indexToFill].value = randomWord[indexToFill];
  }
}

document.addEventListener("keydown", handleKeys);
function handleKeys(event) {
  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const currentIndex = Array.from(enabledInputs).indexOf(
    document.activeElement
  );
  if (event.key === "ArrowRight") {
    const nextInput = currentIndex + 1;
    if (nextInput < lettersNumber) enabledInputs[nextInput].focus();
  } else if (event.key === "ArrowLeft") {
    const prevInput = currentIndex - 1;
    if (prevInput >= 0) enabledInputs[prevInput].focus();
  } else if (event.key === "Backspace") {
    if (currentIndex > 0) {
      const currentInput = enabledInputs[currentIndex];
      const prevInput = enabledInputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.focus();
      prevInput.value = "";
    }
  }
}

window.onload = () => {
  generateInputs();
};
