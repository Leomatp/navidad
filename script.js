const frases = [
  "Te quiero, te amo bebe preciosa 🐸💗",
  "Terrible",
  "Me encantas, me fascinas lo sabias?",
  "Cual es tu rutina? para ser tan linda"
];

function fraseRandom() {
  const random = Math.floor(Math.random() * frases.length);
  document.getElementById("frase").innerText = frases[random];
}

const bgBtn = document.getElementById("playMusic");
const bgMusic = document.getElementById("bgMusic");

let currentAudio = null; // mantiene el audio no-bg que está sonando

function updateBgButton() {
  if (!bgBtn) return;
  bgBtn.innerText = bgMusic && !bgMusic.paused ? "⏸️ Pausar nuestra canción" : "🎵 Reproducir nuestra canción";
}

if (bgBtn && bgMusic) {
  bgBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      bgMusic.play();
    } else {
      bgMusic.pause();
    }
    updateBgButton();
  });
  // inicializar texto del botón
  updateBgButton();
}

function playAudio(id) {
  const audio = document.getElementById(id);
  if (!audio) return;

  // Si hay otro audio (no bgMusic) reproduciendo, pausar y resetearlo
  if (currentAudio && currentAudio !== audio) {
    try { currentAudio.pause(); } catch (e) {}
    currentAudio.currentTime = 0;
  }

  // Toggle: si el audio clickeado está en pausa -> reproducir, si está sonando -> pausar
  if (audio.paused) {
    audio.play();
    // Solo guardamos audios de efectos como "currentAudio", no la bgMusic
    if (audio.id !== "bgMusic") currentAudio = audio;
  } else {
    audio.pause();
    if (currentAudio === audio) currentAudio = null;
  }

  // actualizar estado del botón bg si el usuario interactuó con audio
  updateBgButton();
}

// Limpiar currentAudio cuando un audio termine
document.querySelectorAll('audio').forEach(a => {
  a.addEventListener('ended', () => {
    if (currentAudio === a) currentAudio = null;
    if (a.id === 'bgMusic') updateBgButton();
  });
});

// Si estamos en una página de fecha, destacar enlace del dashboard (si existe)
try {
  const backLink = document.querySelector('.back');
  if (backLink) {
    // nothing for now; placeholder in case we add behaviors later
  }
} catch (e) {}
