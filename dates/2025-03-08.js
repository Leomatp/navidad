document.addEventListener("DOMContentLoaded", () => {

    /* PETALOS */

    const wrap = document.querySelector(".animation-wrap");

    if (wrap) {

        const count = 16;

        for (let i = 0; i < count; i++) {

            const p = document.createElement("span");

            p.className = "petal animate";

            p.style.left = Math.random() * 100 + "%";

            p.style.top = (Math.random() * 10 - 20) + "%";

            p.style.opacity = (0.6 + Math.random() * 0.4);

            p.style.animationDuration = (6 + Math.random() * 8) + "s";

            p.style.animationDelay = (-Math.random() * 8) + "s";

            p.style.transform = `rotate(${Math.random() * 360}deg)`;

            wrap.appendChild(p);

        }

    }

    /* BRILLOS */

    const sparkles = document.querySelector(".sparkles");

    if (sparkles) {

        for (let i = 0; i < 18; i++) {

            const s = document.createElement("span");

            s.style.left = Math.random() * 100 + "%";
            s.style.top = Math.random() * 100 + "%";
            s.style.animationDelay = Math.random() * 4 + "s";

            sparkles.appendChild(s);

        }

    }

});