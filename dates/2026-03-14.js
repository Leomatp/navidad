document.addEventListener("DOMContentLoaded",()=>{

/* corazones */

const wrap=document.querySelector(".animation-wrap");

for(let i=0;i<22;i++){

const h=document.createElement("div");

h.className="heart";

h.innerHTML="💗";

h.style.left=Math.random()*100+"%";
h.style.animationDuration=(6+Math.random()*6)+"s";
h.style.animationDelay=(-Math.random()*6)+"s";

wrap.appendChild(h);

}

/* contador */

// Usar el 22 de marzo más reciente (este año o el anterior)
const nowDate = new Date();
let startYear = nowDate.getFullYear();
let start = new Date(startYear + "-03-22T00:00:00");
if (start > nowDate) {
    start = new Date((startYear - 1) + "-03-22T00:00:00");
}

function update(){

const now=new Date();
const diff=now-start;

const d=Math.floor(diff/(1000*60*60*24));
const h=Math.floor(diff/(1000*60*60)%24);
const m=Math.floor(diff/(1000*60)%60);

document.getElementById("days").textContent=d;
document.getElementById("hours").textContent=h;
document.getElementById("mins").textContent=m;

}

setInterval(update,1000);
update();

/* sorpresa */

const btn=document.getElementById("btnSorpresa");
const msg=document.getElementById("mensajeSorpresa");

btn.onclick=()=>{

msg.style.display="block";

};

});
