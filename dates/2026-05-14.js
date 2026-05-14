const startDate = new Date("2025-03-22T00:00:00");

function updateCounter() {

    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = hours;
    document.getElementById("mins").textContent = mins;

}

setInterval(updateCounter, 1000);
updateCounter();


createGlow();


function createGlow() {

    setInterval(() => {

        const glow = document.createElement("div");

        glow.classList.add("glow-particle");

        glow.style.left =
            Math.random() * window.innerWidth + "px";

        glow.style.top =
            Math.random() * window.innerHeight + "px";

        glow.style.width =
            20 + Math.random() * 60 + "px";

        glow.style.height =
            glow.style.width;

        document.body.appendChild(glow);

        setTimeout(() => {
            glow.remove();
        }, 5000);

    }, 250);

}


const btn = document.getElementById("btnSorpresa");
const msg = document.getElementById("mensajeSorpresa");

btn.addEventListener("click", () => {

    msg.style.display = "block";

    msg.animate([
        {
            opacity: 0,
            transform: "scale(.8)"
        },
        {
            opacity: 1,
            transform: "scale(1)"
        }
    ], {
        duration: 600,
        fill: "forwards"
    });

});