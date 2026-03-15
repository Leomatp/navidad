document.addEventListener("DOMContentLoaded", () => {

const cont = document.getElementById("girasoles");

const total = 7;

for (let i = 0; i < total; i++) {

setTimeout(() => {

const planta = document.createElement("div");
planta.className = "girasol";

const tallo = document.createElement("div");
tallo.className = "tallo";

const flor = document.createElement("div");
flor.className = "flor";

const centro = document.createElement("div");
centro.className = "centro";

flor.appendChild(centro);

planta.appendChild(flor);
planta.appendChild(tallo);

cont.appendChild(planta);

}, i * 500);

}

});