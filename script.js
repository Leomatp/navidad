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

try {
  const backLink = document.querySelector('.back');
  if (backLink) {
    // nothing for now; placeholder in case we add behaviors later
  }
} catch (e) {}

(function() {
  function showSection(name) {
    document.querySelectorAll('.section-content').forEach(s => s.classList.add('hidden'));
    const el = document.getElementById('section-' + name);
    if (el) el.classList.remove('hidden');
    document.querySelectorAll('.section-tab').forEach(t => t.classList.toggle('active', t.dataset.target === name));
    // aplicar tema por sección en el body
    document.body.classList.remove('theme-fechas','theme-juegos','theme-otros');
    document.body.classList.add('theme-' + name);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.section-tab').forEach(btn => {
      btn.addEventListener('click', () => showSection(btn.dataset.target));
    });
    // inicial
    showSection('fechas');

    const start = new Date('2025-03-22T00:00:00');
    function updateTogether(){
      const now = new Date();
      let diff = now - start;
      const d = Math.floor(diff / (1000*60*60*24));
      diff -= d * (1000*60*60*24);
      const h = Math.floor(diff / (1000*60*60));
      diff -= h * (1000*60*60);
      const m = Math.floor(diff / (1000*60));
      const elD = document.getElementById('together-days');
      const elH = document.getElementById('together-hours');
      const elM = document.getElementById('together-mins');
      if(elD) elD.textContent = d;
      if(elH) elH.textContent = h;
      if(elM) elM.textContent = m;
    }
    updateTogether(); setInterval(updateTogether, 60*1000);

    // exportar puntuaciones (.txt)
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Exportar puntuaciones';
    exportBtn.className = 'section-tab';
    exportBtn.style.marginLeft = '10px';
    exportBtn.addEventListener('click', () => {
      const data = JSON.parse(localStorage.getItem('game_scores') || '[]');
      if (!data.length) { alert('No hay puntuaciones guardadas'); return; }
      const lines = data.map(s => `${s.date} | ${s.game} | ${s.score} | ${s.meta || ''}`);
      const blob = new Blob([lines.join('\n')], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'scores.txt'; a.click(); URL.revokeObjectURL(url);
    });
    const nav = document.querySelector('.sections-nav'); if(nav) nav.appendChild(exportBtn);
  });
})();

// helper público para que los juegos guarden puntuaciones
function saveGameScore(game, score, meta){
  const store = JSON.parse(localStorage.getItem('game_scores') || '[]');
  store.push({game, score, meta: meta || '', date: new Date().toISOString()});
  localStorage.setItem('game_scores', JSON.stringify(store));
}
