// Utility for saving and exporting game scores (used by game pages)
function saveGameScore(game, score, meta){
  try {
    const store = JSON.parse(localStorage.getItem('game_scores') || '[]');
    store.push({game, score, meta: meta || '', date: new Date().toISOString()});
    localStorage.setItem('game_scores', JSON.stringify(store));
  } catch (e) { console.error('saveGameScore error', e); }
}

function exportGameScores(){
  const data = JSON.parse(localStorage.getItem('game_scores') || '[]');
  const lines = data.map(s => `${s.date} | ${s.game} | ${s.score} | ${s.meta || ''}`);
  const blob = new Blob([lines.join('\n')], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'scores.txt'; a.click(); URL.revokeObjectURL(url);
}
