let money = 10000;
let time = 15;
let timer;
let lastBet = null;

const moneyEl = document.getElementById("money");
const timeEl = document.getElementById("time");
const md5El = document.getElementById("md5");
const diceEls = document.querySelectorAll(".dice");
const resultEl = document.getElementById("result");

function randomMD5() {
  return Math.random().toString(36).substring(2, 10);
}

function startRound() {
  time = 15;
  md5El.textContent = randomMD5();
  diceEls.forEach(d => d.textContent = "?");
  resultEl.textContent = "Đặt cược";

  clearInterval(timer);
  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;
    if (time <= 0) endRound();
  }, 1000);
}

function bet(type) {
  lastBet = type;
  resultEl.textContent = "Đã chọn: " + (type === "tai" ? "TÀI" : "XỈU");
}

function endRound() {
  clearInterval(timer);

  const dice = [
    Math.ceil(Math.random()*6),
    Math.ceil(Math.random()*6),
    Math.ceil(Math.random()*6)
  ];

  diceEls.forEach((d,i)=>d.textContent = dice[i]);

  const sum = dice.reduce((a,b)=>a+b,0);
  const result = sum >= 11 ? "tai" : "xiu";

  if (lastBet === result) {
    money += Number(bet.value);
    resultEl.textContent = "🎉 THẮNG ("+sum+")";
  } else {
    money -= Number(bet.value);
    resultEl.textContent = "❌ THUA ("+sum+")";
  }

  moneyEl.textContent = money;
  lastBet = null;

  setTimeout(startRound, 3000);
}

startRound();
