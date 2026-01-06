let money=10000, time=15, bet=0, locked=false, force=null;
const moneyEl=moneySpan(), timeEl=timeSpan(), md5El=md5Span();
const bowl=document.getElementById('bowl');
const hist=document.getElementById('history');
const d=[d1(),d2(),d3()];
const betBtn=document.getElementById('betBtn');

function moneySpan(){return document.getElementById('money')}
function timeSpan(){return document.getElementById('time')}
function md5Span(){return document.getElementById('md5')}
function d1(){return document.getElementById('d1')}
function d2(){return document.getElementById('d2')}
function d3(){return document.getElementById('d3')}
function rnd(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function md5(){return Math.random().toString(36).slice(2,10)}

function reset(){
  time=15;locked=false;betBtn.disabled=false;
  bowl.classList.remove('open','shake');
  d.forEach(x=>x.textContent='?');
  md5El.textContent=md5();
}

setInterval(()=>{
  if(time>0){time--;timeEl.textContent=time}
  else if(!locked){startRoll()}
},1000);

document.querySelectorAll('.chips button').forEach(b=>{
  b.onclick=()=>{
    if(b.id==='allin') bet=money;
    else bet=parseInt(b.dataset.chip);
  }
});

betBtn.onclick=()=>{
  if(locked||bet<=0||bet>money) return;
  locked=true; betBtn.disabled=true;
  bowl.classList.add('shake');
};

function startRoll(){
  bowl.classList.add('shake');
  setTimeout(openBowl,1200);
}

function openBowl(){
  bowl.classList.remove('shake');
  bowl.classList.add('open');

  let a=rnd(1,6), b=rnd(1,6), c=rnd(1,6);
  let sum=a+b+c;
  if(force){
    let target=force==='tai'?rnd(11,17):rnd(4,10);
    while(sum!==target){
      a=rnd(1,6); b=rnd(1,6); c=rnd(1,6); sum=a+b+c;
    }
  }
  [a,b,c].forEach((v,i)=>d[i].textContent=v);

  const rs=sum>=11?'tai':'xiu';
  money += (bet>0 ? (rs==='tai'?bet:-bet) : 0);
  moneyEl.textContent=money;

  const dot=document.createElement('span');
  dot.className=rs; hist.prepend(dot);
  if(hist.children.length>20) hist.lastChild.remove();

  bet=0;
  setTimeout(reset,2500);
}

// ADMIN ẨN
let tap=0;
document.querySelector('.logo').onclick=()=>{
  if(++tap>=5){
    const p=prompt('PIN');
    if(p==='8888'){
      const r=prompt('Ép (tai/xiu)');
      if(r==='tai'||r==='xiu') force=r;
    }
    tap=0;
  }
};

reset();
