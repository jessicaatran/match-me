const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");

const startBtn = document.getElementById("start-btn");
const backBtn = document.getElementById("back-btn");
const resetBtn = document.getElementById("reset");

const boardEl = document.getElementById("board");
const movesEl = document.getElementById("moves");
const matchesEl = document.getElementById("matches");

const winScreen = document.getElementById("win-screen");

const floatLayer = document.getElementById("float-layer");

const CARD_BACKS = [
  "./card_back/back1.png"
  // "./card_back/back2.png",
  // "./card_back/back3.png",
];

const EMOJIS = ["🍮", "🍪", "🍨", "🤍", "🐈", "🍞"];

let deck = [];
let firstCard = null;
let secondCard = null;
let isLocked = false;
let moves = 0;
let matches = 0;

function showGame() {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  newGame();
}

function showStart() {
  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildDeck() {
  const pairs = EMOJIS.flatMap((e) => [e, e]); // 12 cards
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

  // pick a random back image for THIS card
  const randomBack =
    CARD_BACKS[Math.floor(Math.random() * CARD_BACKS.length)];
  btn.dataset.back = randomBack;

  // start hidden
  btn.textContent = "";
  btn.style.backgroundImage = `url("${randomBack}")`;

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

  btn.textContent = btn.dataset.value;
  btn.style.backgroundImage = "none";

  btn.setAttribute("aria-label", `Card: ${btn.dataset.value}`);
}



function hide(btn) {
  btn.classList.remove("revealed");
  btn.classList.add("back");

  btn.textContent = "";
  btn.style.backgroundImage = `url("${btn.dataset.back}")`;

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
  stopWinFloat(); // safe even if nothing is floating
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
backBtn.addEventListener("click", showStart);
resetBtn.addEventListener("click", newGame);

