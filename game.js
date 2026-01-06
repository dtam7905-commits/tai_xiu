const symbols = ["🍒","🔔","🍋","⭐","7️⃣","💎"];
const reels = document.querySelectorAll(".reel-strip");

let balance = 100000;
let bet = 1000;
let spinning = false;

const balanceEl = document.getElementById("balance");
const winEl = document.getElementById("win");

balanceEl.textContent = balance;

function createReel(strip) {
  strip.innerHTML = "";
  for (let i = 0; i < 20; i++) {
    const s = document.createElement("div");
    s.className = "symbol";
    s.textContent = symbols[Math.floor(Math.random()*symbols.length)];
    strip.appendChild(s);
  }
}

reels.forEach(createReel);

function spin() {
  if (spinning || balance < bet) return;
  spinning = true;
  winEl.textContent = "";
  balance -= bet;
  balanceEl.textContent = balance;

  let results = [];

  reels.forEach((strip, i) => {
    createReel(strip);
    strip.style.transition = "none";
    strip.style.top = "0px";

    const stop = -(Math.floor(Math.random()*10)+5)*60;
    results.push(strip.children[Math.abs(stop/60)+1].textContent);

    setTimeout(() => {
      strip.style.transition = "top 1s cubic-bezier(.2,.8,.2,1)";
      strip.style.top = stop + "px";
    }, i*200);
  });

  setTimeout(() => {
    checkWin(results);
    spinning = false;
  }, 2000);
}

function checkWin(res) {
  let win = 0;
  if (res.every(v => v === res[0])) win = bet * 10;
  else if (new Set(res).size <= 2) win = bet * 3;

  if (win > 0) {
    balance += win;
    winEl.textContent = "WIN +" + win;
  }
  balanceEl.textContent = balance;
}

document.getElementById("spin").onclick = spin;
document.getElementById("allin").onclick = () => bet = balance;
document.getElementById("plus").onclick = () => bet += 500;
document.getElementById("minus").onclick = () => bet = Math.max(500, bet - 500);
