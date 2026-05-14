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


const btn = document.getElementById("btnSorpresa");
const msg = document.getElementById("mensajeSorpresa");

btn.addEventListener("click", () => {

    msg.style.display = "block";

    msg.animate([
        {
            opacity: 0,
            transform: "translateY(15px)"
        },
        {
            opacity: 1,
            transform: "translateY(0)"
        }
    ], {
        duration: 700,
        fill: "forwards"
    });

    createPetals();

});


function createPetals() {

    for (let i = 0; i < 18; i++) {

        const petal = document.createElement("div");

        petal.classList.add("petal");

        petal.style.left = Math.random() * window.innerWidth + "px";

        petal.style.animationDuration =
            (5 + Math.random() * 5) + "s";

        petal.style.opacity =
            0.3 + Math.random();

        document.body.appendChild(petal);

        setTimeout(() => {
            petal.remove();
        }, 9000);

    }

}