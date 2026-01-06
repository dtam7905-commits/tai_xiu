let money = 10000;
let time = 20;
let timer = null;
let forceResult = null; // "TAI" | "XIU" | null
let clickCount = 0;

const ADMIN_PIN = "8888";

const lobby = document.getElementById("lobby");
const game = document.getElementById("game");
const admin = document.getElementById("admin");

/* ===== NAV ===== */
function enterGame() {
  lobby.classList.remove("active");
  game.classList.add("active");
  startRound();
}

function backLobby() {
  location.reload();
}

/* ===== GAME LOOP ===== */
function startRound() {
  clearInterval(timer);
  time = 20;
  updateUI();
  genMD5();

  timer = setInterval(() => {
    time--;
    updateUI();
    if (time <= 0) rollDice();
  }, 1000);
}

function genMD5() {
  const md5 = Math.random().toString(36).substring(2, 10);
  document.getElementById("md5").innerText = md5;
}

function rollDice() {
  clearInterval(timer);

  let dice = [rand(), rand(), rand()];
  let sum = dice[0] + dice[1] + dice[2];
  let result = sum >= 11 ? "TAI" : "XIU";

  if (forceResult) result = forceResult;

  showDice(dice);
  addHistory(result);

  setTimeout(startRound, 2000);
}

function rand() {
  return Math.floor(Math.random() * 6) + 1;
}

function showDice(d) {
  document.getElementById("d1").innerText = d[0];
  document.getElementById("d2").innerText = d[1];
  document.getElementById("d3").innerText = d[2];
}

/* ===== BET ===== */
function bet(type) {
  alert("Đặt " + type + " (demo)");
}

/* ===== UI ===== */
function updateUI() {
  document.getElementById("money").innerText = money;
  document.getElementById("time").innerText = time;
}

function addHistory(r) {
  const h = document.getElementById("history");
  const span = document.createElement("span");
  span.innerText = r + " ";
  span.style.color = r === "TAI" ? "#ffd700" : "#00c8ff";
  h.prepend(span);
}

/* ===== ADMIN ẨN (CHẠM 5 LẦN) ===== */
document.getElementById("title").addEventListener("click", () => {
  clickCount++;
  if (clickCount >= 5) {
    const pin = prompt("Nhập PIN Admin:");
    if (pin === ADMIN_PIN) {
      admin.classList.remove("hidden");
    } else {
      alert("Sai PIN");
    }
    clickCount = 0;
  }
});

function setForce(v) {
  forceResult = v;
  alert("Kết quả = " + (v ? v : "RANDOM"));
}

function applyMoney() {
  const v = parseInt(document.getElementById("setMoney").value);
  if (!isNaN(v)) {
    money = v;
    updateUI();
  }
}
