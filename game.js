// ====== CONFIG ======
const SYMBOLS = ["🍒","🍋","🔔","💎","⭐","7️⃣"];
const REEL_COUNT = 5;
const ROW_HEIGHT = 72;     // khớp .reel height
const SPIN_TIME = 1400;    // ms
const STAGGER = 180;       // dừng lệch từng cột

// ====== STATE ======
let money = Number(localStorage.getItem("money")) || 100000;
let bet = 1000;
let spinning = false;

// ====== DOM ======
const moneyEl = document.getElementById("money");
const betEl   = document.getElementById("bet");
const winEl   = document.getElementById("win");
const spinBtn = document.querySelector(".spin");
const minusBtn= document.querySelector(".bet-btn:nth-child(1)");
const plusBtn = document.querySelector(".bet-btn:nth-child(3)");
const allInBtn= document.querySelector(".allin");
const reels   = document.querySelectorAll(".reel");

// ====== INIT ======
updateUI();
buildReelsStatic();

// ====== FUNCTIONS ======
function updateUI(){
  moneyEl.textContent = money;
  betEl.textContent = bet;
  localStorage.setItem("money", money);
}

function rndSymbol(){
  return SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)];
}

// tạo “strip” ảo cho animation
function buildStrip(){
  const wrap = document.createElement("div");
  wrap.style.position = "absolute";
  wrap.style.left = "0";
  wrap.style.top = "0";
  wrap.style.width = "100%";
  wrap.style.transition = "transform 0s";
  for(let i=0;i<20;i++){
    const d = document.createElement("div");
    d.className = "symbol";
    d.style.height = ROW_HEIGHT+"px";
    d.style.display="flex";
    d.style.alignItems="center";
    d.style.justifyContent="center";
    d.style.fontSize="32px";
    d.textContent = rndSymbol();
    wrap.appendChild(d);
  }
  return wrap;
}

function buildReelsStatic(){
  reels.forEach(r=>{
    r.style.position="relative";
    r.style.overflow="hidden";
    r.textContent = rndSymbol();
  });
}

function spin(){
  if(spinning) return;
  if(money < bet){ flash("Không đủ tiền"); return; }

  spinning = true;
  winEl.textContent = "";
  money -= bet; updateUI();
  spinBtn.disabled = true;

  const results = [];

  reels.forEach((reel, i)=>{
    reel.innerHTML = "";
    const strip = buildStrip();
    reel.appendChild(strip);

    // random điểm dừng
    const stopIndex = Math.floor(Math.random()*10)+6;
    const stopY = -stopIndex * ROW_HEIGHT;

    // chuẩn bị kết quả (ô giữa)
    const mid = strip.children[stopIndex+1];
    results[i] = mid.textContent;

    // kick animation
    requestAnimationFrame(()=>{
      strip.style.transition = `transform ${SPIN_TIME}ms cubic-bezier(.15,.8,.2,1)`;
      strip.style.transform  = `translateY(${stopY}px)`;
    });

    // dừng lệch
    setTimeout(()=>{}, i*STAGGER);
  });

  setTimeout(()=>{
    settle(results);
    spinBtn.disabled = false;
    spinning = false;
  }, SPIN_TIME + (REEL_COUNT-1)*STAGGER + 50);
}

function settle(line){
  // luật đơn giản nhưng “ra tiền”
  let win = 0;
  let same = 1;
  for(let i=1;i<line.length;i++){
    if(line[i]===line[i-1]) same++;
    else same=1;
    if(same>=3) win = Math.max(win, bet * same);
  }

  if(win>0){
    money += win;
    winEl.textContent = `+${win}`;
    glow(true);
  }else{
    winEl.textContent = "0";
    glow(false);
  }
  updateUI();

  // render mặt tĩnh sau khi dừng
  reels.forEach((r,i)=> r.textContent = line[i]);
}

function flash(t){
  winEl.textContent = t;
  setTimeout(()=> winEl.textContent="", 900);
}

function glow(on){
  const frame = document.querySelector(".slot-frame");
  frame.style.boxShadow = on
    ? "0 0 30px rgba(0,255,160,.6)"
    : "inset 0 0 20px rgba(255,215,0,.2)";
}

// ====== EVENTS ======
spinBtn.addEventListener("click", spin);
minusBtn.addEventListener("click", ()=>{ bet = Math.max(1000, bet-1000); updateUI(); });
plusBtn .addEventListener("click", ()=>{ bet += 1000; updateUI(); });
allInBtn.addEventListener("click", ()=>{ bet = money; updateUI(); });
