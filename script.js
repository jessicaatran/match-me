const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset");

const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");

const winScreen = document.getElementById("win-screen");
const winSub = document.getElementById("win-sub");


const floatLayer = document.getElementById("float-layer");

const CARD_BACK = "./card_back/back1.png";

// const CARD_BACKS = [
//   "./card_back/back1.png",
//   "./card_back/back2.png",
//   "./card_back/back3.png",
// ];

const ICON_IDS = ["1", "2", "3", "4", "5", "6"];

const WIN_MESSAGES = [
  "if we were socks, we’d be a matching pair",
  "you unlocked this screen and my heart",
  "if i were a cat, i'd spend all 9 lives with you",
  "your hand looks heavy, can i hold it for you",
  "i’d swipe right on you every time",
  "i’d choose you in every round",
  "if you were a card, you’d be my favorite one",
  "i can’t fall asleep so i just fall for you instead",
  "what did one volcano say to the other? i lava you",
  "roses are red, violets are blue, sugar is sweet and so are you",
  "roses are red, violets are blue, life’s better when im with you"
];



let deck = [];
let firstCard = null;
let secondCard = null;
let isLocked = false;
let moves = 0;
let matches = 0;

function showGame() {
  startScreen.classList.add("hidden");
  winScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  newGame();
}


function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck() {
  const pairs = ICON_IDS.flatMap((id) => [id, id]); // 12 cards
  return shuffle(pairs);
}


function setStats() {
  movesEl.textContent = String(moves);
  matchesEl.textContent = String(matches);
}

function createCardButton(value, index) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "card back";

  btn.dataset.value = value;
  btn.dataset.index = String(index);

  // hidden state
  btn.innerHTML = "";
  btn.style.backgroundImage = `url("${CARD_BACK}")`;

  btn.setAttribute("aria-label", "Hidden card");
  btn.addEventListener("click", onCardClick);
  return btn;
}


function renderBoard() {
  boardEl.innerHTML = "";
  deck.forEach((value, idx) => {
    boardEl.appendChild(createCardButton(value, idx));
  });
}

function reveal(btn) {
  btn.classList.remove("back");
  btn.classList.add("revealed");

  const id = btn.dataset.value;
  btn.innerHTML = `<img class="icon" src="./assets/icons/${id}.png" alt="icon ${id}" />`;
  btn.style.backgroundImage = "none";

  btn.setAttribute("aria-label", `Card: icon ${id}`);
}


function hide(btn) {
  btn.classList.remove("revealed");
  btn.classList.add("back");

  btn.innerHTML = "";
  btn.style.backgroundImage = `url("${CARD_BACK}")`;

  btn.setAttribute("aria-label", "Hidden card");
}


function markMatched(a, b) {
  [a, b].forEach((btn) => {
    btn.disabled = true;
  });
}

function resetPick() {
  firstCard = null;
  secondCard = null;
  isLocked = false;
}

function onCardClick(e) {
  if (isLocked) return;

  const btn = e.currentTarget;
  if (btn.disabled) return;
  if (btn === firstCard) return;

  reveal(btn);

  if (!firstCard) {
    firstCard = btn;
    return;
  }

  secondCard = btn;
  moves += 1;
  setStats();

  const isMatch = firstCard.dataset.value === secondCard.dataset.value;

  if (isMatch) {
    matches += 1;
    setStats();
    markMatched(firstCard, secondCard);
    resetPick();

    if (matches === 6) {
      setTimeout(showWin, 250);
    }

    return;
  }

  isLocked = true;
  setTimeout(() => {
    hide(firstCard);
    hide(secondCard);
    resetPick();
  }, 650);
}

function newGame() {
  moves = 0;
  matches = 0;
  setStats();
  resetPick();

  deck = buildDeck();
  renderBoard();
}

function showWin() {
  // pick a random message
  const i = Math.floor(Math.random() * WIN_MESSAGES.length);
  winSub.textContent = WIN_MESSAGES[i];

  gameScreen.classList.add("hidden");
  winScreen.classList.remove("hidden");
  startWinFloat();
}



function playAgain() {
  stopWinFloat();
  winScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  newGame();
}

function showStart() {
  stopWinFloat(); 
  gameScreen.classList.add("hidden");
  winScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

function startWinFloat() {
  // clear any old ones
  floatLayer.innerHTML = "";

  // Spawn a burst now + keep spawning for a bit
  const burstCount = 18;
  for (let i = 0; i < burstCount; i++) spawnPixel();

  // continue spawning for ~4 seconds
  let ticks = 0;
  const interval = setInterval(() => {
    spawnPixel();
    ticks += 1;
    if (ticks > 28) clearInterval(interval);
  }, 120);
}

function stopWinFloat() {
  floatLayer.innerHTML = "";
}

function spawnPixel() {
  const img = document.createElement("img");
  img.src = "./assets/pixel.png";
  img.alt = "";

  img.className = "pixel";

  // random horizontal position
  const left = Math.random() * 100; // vw
  img.style.left = `${left}vw`;

  // random drift left/right as it floats
  const drift = (Math.random() * 80 - 40).toFixed(1); // -40..40 px
  img.style.setProperty("--x", `${drift}px`);

  // random duration + size for variety
  const duration = (2.6 + Math.random() * 4).toFixed(2); // 2.6..4.8s
  img.style.animationDuration = `${duration}s`;

  const size = 14 + Math.random() * 16; // 14..30px
  img.style.width = `${size}px`;
  img.style.height = `${size}px`;

  // random opacity
  img.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);

  floatLayer.appendChild(img);

  // remove after animation ends (cleanup)
  img.addEventListener("animationend", () => img.remove());
}



startBtn.addEventListener("click", showGame);
resetBtn.addEventListener("click", playAgain);


