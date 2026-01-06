let money=10000,time=15,locked=false,force=null;
const h=document.getElementById('history');

function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a}
function md5(){return Math.random().toString(36).slice(2,10)}

function reset(){
  time=15;locked=false;
  md5El.textContent=md5();
}

const moneyEl=document.getElementById('money');
const timeEl=document.getElementById('time');
const md5El=document.getElementById('md5');

setInterval(()=>{
  if(time>0){time--;timeEl.textContent=time}
  else if(!locked){locked=true;roll()}
},1000);

function roll(){
  let d=[rand(1,6),rand(1,6),rand(1,6)];
  let sum=d[0]+d[1]+d[2];
  if(force){
    let want=force==='tai'?rand(11,17):rand(4,10);
    while(sum!==want){
      d=[rand(1,6),rand(1,6),rand(1,6)];
      sum=d[0]+d[1]+d[2];
    }
  }
  ['d1','d2','d3'].forEach((id,i)=>{
    document.getElementById(id).src=`assets/dice${d[i]}.png`
  });

  let rs=sum>=11?'tai':'xiu';
  let dot=document.createElement('span');
  dot.className=rs;
  h.prepend(dot);
  if(h.children.length>20)h.lastChild.remove();

  setTimeout(reset,4000);
}

function bet(type){
  if(locked)return;
  let b=+betInput.value;
  if(b<=0||b>money)return;
  locked=true;
  let win=rand(0,1)?type:(type==='tai'?'xiu':'tai');
  money+=win===type?b:-b;
  moneyEl.textContent=money;
  document.getElementById(win===type?'win':'lose').play();
  roll();
}

let tap=0;
document.querySelector('.logo').onclick=()=>{
  if(++tap>=5){
    let p=prompt('PIN');
    if(p==='8888')force=prompt('tai/xiu');
    tap=0;
  }
};

const betInput=document.getElementById('bet');
reset();
