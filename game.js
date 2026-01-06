const symbols = ["🍒","🍋","🔔","💎","7️⃣"];
let money = Number(localStorage.getItem("money")) || 100000;
let bet = 1000;
let spinning = false;

const moneyEl = document.getElementById("money");
const betEl = document.getElementById("bet");
const resultEl = document.getElementById("result");

function updateUI() {
  moneyEl.textContent = money;
  betEl.textContent = bet;
  localStorage.setItem("money", money);
}

function randomSymbol() {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return symbols[array[0] % symbols.length];
}

function spin() {
  if (spinning) return;
  if (money < bet) {
    resultEl.textContent = "❌ Không đủ tiền";
    return;
  }

  spinning = true;
  resultEl.textContent = "";
  money -= bet;
  updateUI();

  let result = [];

  for (let i = 0; i < 5; i++) {
    const reel = document.getElementById("r"+i);
    reel.innerHTML = "";
    for (let j = 0; j < 3; j++) {
      const s = randomSymbol();
      reel.innerHTML += `<div>${s}</div>`;
      if (j === 1) result.push(s);
    }
  }

  setTimeout(() => {
    checkWin(result);
    spinning = false;
  }, 500);
}

function checkWin(line) {
  let win = 0;
  let count = 1;

  for (let i = 1; i < line.length; i++) {
    if (line[i] === line[i-1]) {
      count++;
      if (count >= 3) win = bet * count;
    } else {
      count = 1;
    }
  }

  if (win > 0) {
    money += win;
    resultEl.textContent = "🎉 Thắng " + win;
  } else {
    resultEl.textContent = "😢 Thua";
  }

  updateUI();
}

function changeBet(v) {
  bet = Math.max(1000, bet + v);
  updateUI();
}

function allIn() {
  bet = money;
  updateUI();
}

updateUI();
