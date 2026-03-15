(() => {
  const icons = ['🍓','🍋','🍉','🍇','🍒','🍑','🍍','🥝','🍊','🍌','🍐','🥭'];
  let deck = [];
  let first = null, second = null;
  let lock = false;
  let matches = 0;
  let moves = 0;

  function shuffle(a){
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;
  }

  function buildBoard(){
    const board = document.getElementById('board');
    board.innerHTML = '';
    // seleccionar pares únicos y luego duplicar para formar el mazo
    const pairCount = 6; // 6 parejas => 12 cartas
    const pairIcons = shuffle(icons).slice(0, pairCount);
    deck = shuffle(pairIcons.concat(pairIcons));
    matches = 0; moves = 0; updateStats();
    deck.forEach((icon, idx) => {
      const c = document.createElement('div');
      c.className = 'card';
      c.dataset.icon = icon;
      c.dataset.index = idx;
      c.textContent = '';
      c.addEventListener('click', () => flipCard(c));
      board.appendChild(c);
    });
  }

  function updateStats(){
    document.getElementById('stats').textContent = `Movimientos: ${moves} • Parejas: ${matches}`;
  }

  function flipCard(card){
    if(lock) return;
    if(card === first || card.classList.contains('matched')) return;
    card.classList.add('flipped');
    card.textContent = card.dataset.icon;
    if(!first){ first = card; return }
    second = card; moves++; lock = true;
    if(first.dataset.icon === second.dataset.icon){
      first.classList.add('matched'); second.classList.add('matched');
      matches++; resetTurn();
      if(matches === deck.length / 2){
        setTimeout(()=>{
          alert(`¡Ganaste! Movimientos: ${moves}`);
          // guardar puntuación automáticamente
          if (typeof saveGameScore === 'function') saveGameScore('Memory', moves, `pairs:${deck.length/2}`);
        },300);
      }
    } else {
      setTimeout(()=>{
        first.classList.remove('flipped'); first.textContent='';
        second.classList.remove('flipped'); second.textContent='';
        resetTurn();
      }, 700);
    }
    updateStats();
  }

  function resetTurn(){ first = null; second = null; lock = false; }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('newBtn').addEventListener('click', buildBoard);
    buildBoard();
  });

})();
