const SYMBOLS = ["🍒","🍋","🔔","💎","⭐","7️⃣"];
const reels = document.querySelectorAll(".reel");
const strips = document.querySelectorAll(".strip");

let money = 100000;
let bet = 1000;
let spinning = false;

const moneyEl = document.getElementById("money");
const betEl = document.getElementById("bet");
const winEl = document.getElementById("win");

function updateUI() {
  moneyEl.textContent = money;
  betEl.textContent = bet;
}

function randomSymbol() {
  return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
}

function buildStrip(strip) {
  strip.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const d = document.createElement("div");
    d.className = "symbol";
    d.textContent = randomSymbol();
    strip.appendChild(d);
  }
}

strips.forEach(buildStrip);
updateUI();

document.getElementById("spin").onclick = () => {
  if (spinning) return;
  if (money < bet) return;

  spinning = true;
  money -= bet;
  updateUI();
  winEl.textContent = "0";

  let result = [];

  strips.forEach((strip, i) => {
    buildStrip(strip);
    strip.style.transition = "none";
    strip.style.top = "0px";

    const stop = -(Math.floor(Math.random() * 10) + 5) * 56;
    result[i] = strip.children[Math.abs(stop / 56) + 1].textContent;

    setTimeout(() => {
      strip.style.transition = "top 1s ease-out";
      strip.style.top = stop + "px";
    }, i * 150);
  });

  setTimeout(() => {
    checkWin(result);
    spinning = false;
  }, 1500);
};

function checkWin(line) {
  let same = 1;
  let win = 0;

  for (let i = 1; i < line.length; i++) {
    if (line[i] === line[i - 1]) {
      same++;
      if (same >= 3) win = bet * same;
    } else {
      same = 1;
    }
  }

  if (win > 0) {
    money += win;
    winEl.textContent = win;
  }
  updateUI();
}

document.getElementById("plus").onclick = () => {
  bet += 1000;
  updateUI();
};

document.getElementById("minus").onclick = () => {
  bet = Math.max(1000, bet - 1000);
  updateUI();
};

document.getElementById("allin").onclick = () => {
  bet = money;
  updateUI();
};
