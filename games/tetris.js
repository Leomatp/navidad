(() => {
  const canvas = document.getElementById('tetris');
  const ctx = canvas.getContext('2d');
  const cols = 10, rows = 20; const scale = 24;
  canvas.width = cols * scale; canvas.height = rows * scale;

  const colors = [null,'#FF0D72','#0DC2FF','#0DFF72','#F538FF','#FF8E0D','#FFE138','#3877FF'];

  function createMatrix(w,h){
    const m=[]; while(h--) m.push(new Array(w).fill(0)); return m;
  }

  const arena = createMatrix(cols, rows);

  function collide(arena, player){
    const m = player.matrix; const o = player.pos;
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (!m[y][x]) continue;
        const ax = x + o.x;
        const ay = y + o.y;
        if (ax < 0 || ax >= cols || ay >= rows) {
          return true;
        }
        if (ay >= 0 && arena[ay][ax]) {
          return true;
        }
      }
    }
    return false;
  }

  function merge(arena, player){
    player.matrix.forEach((row,y)=>{row.forEach((val,x)=>{ if(val) arena[y+player.pos.y][x+player.pos.x]=val })});
  }

  function rotate(matrix, dir){
    // Rotate matrix for rectangular and square shapes.
    const rowsM = matrix.length;
    const colsM = matrix[0].length;
    const res = [];
    if (dir > 0) {
      // clockwise
      for (let x = 0; x < colsM; x++) {
        res[x] = [];
        for (let y = 0; y < rowsM; y++) {
          res[x][y] = matrix[rowsM - 1 - y][x] || 0;
        }
      }
    } else {
      // counter-clockwise
      for (let x = 0; x < colsM; x++) {
        res[x] = [];
        for (let y = 0; y < rowsM; y++) {
          res[x][y] = matrix[y][colsM - 1 - x] || 0;
        }
      }
    }
    // Mutate original matrix to match rotated result
    matrix.length = 0;
    res.forEach(r => matrix.push(r));
  }

  function playerReset(){
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[(pieces.length*Math.random())|0]);
    player.pos.y = 0; player.pos.x = ((cols/2)|0) - ((player.matrix[0].length/2)|0);
    if(collide(arena, player)){ arena.forEach(row=>row.fill(0)); score=0; updateScore(); }
  }

  function createPiece(type){
    if(type==='T') return [[0,7,0],[7,7,7]];
    if(type==='O') return [[6,6],[6,6]];
    if(type==='L') return [[0,0,5],[5,5,5]];
    if(type==='J') return [[4,0,0],[4,4,4]];
    if(type==='I') return [[0,3,0,0],[0,3,0,0],[0,3,0,0],[0,3,0,0]];
    if(type==='S') return [[0,2,2],[2,2,0]];
    if(type==='Z') return [[8,8,0],[0,8,8]];
  }

  function sweep(){
    let rowCount=1; outer: for(let y=arena.length-1;y>=0;y--){
      for(let x=0;x<arena[y].length;x++) if(!arena[y][x]) continue outer;
      const row = arena.splice(y,1)[0].fill(0);
      arena.unshift(row); score += rowCount*10; rowCount*=2; updateScore(); y++; }
  }

  function draw(){
    ctx.fillStyle='#111'; ctx.fillRect(0,0,canvas.width,canvas.height);
    drawMatrix(arena,{x:0,y:0}); drawMatrix(player.matrix, player.pos);
  }

  function drawMatrix(matrix, offset){
    matrix.forEach((row,y)=>{row.forEach((val,x)=>{ if(val){ ctx.fillStyle = colors[val]; ctx.fillRect((x+offset.x)*scale, (y+offset.y)*scale, scale-1, scale-1); } }) });
  }

  function playerDrop(){ player.pos.y++; if(collide(arena, player)){ player.pos.y--; merge(arena, player); playerReset(); sweep(); } dropCounter=0; }

  function playerMove(dir){ player.pos.x += dir; if(collide(arena, player)) player.pos.x -= dir; }

  function playerRotate(dir){ rotate(player.matrix, dir); let offset=1; while(collide(arena, player)){ player.pos.x += offset; offset = -(offset + (offset>0?1:-1)); if(offset>player.matrix[0].length) { rotate(player.matrix, -dir); return; } } }

  let dropCounter=0; let dropInterval=800; let lastTime=0; let score=0;
  const player = { pos:{x:0,y:0}, matrix:null };

  function update(time=0){ const delta = time - lastTime; lastTime = time; dropCounter += delta; if(dropCounter > dropInterval){ playerDrop(); } draw(); requestAnimationFrame(update); }

  function updateScore(){ document.getElementById('score').textContent = 'Score: ' + score; }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.addEventListener('keydown', e=>{ if(e.keyCode===37) playerMove(-1); else if(e.keyCode===39) playerMove(1); else if(e.keyCode===40) playerDrop(); else if(e.keyCode===38) playerRotate(1); });
    document.getElementById('restart').addEventListener('click', ()=>{ 
      // guardar puntaje actual antes de reiniciar
      if (typeof saveGameScore === 'function') saveGameScore('Tetris', score);
      arena.forEach(r=>r.fill(0)); score=0; updateScore(); playerReset(); 
    });
    const saveBtn = document.getElementById('saveScoreBtn');
    if(saveBtn) saveBtn.addEventListener('click', ()=>{ if(typeof saveGameScore === 'function') { saveGameScore('Tetris', score); alert('Puntuación guardada'); } });
    playerReset(); updateScore(); update();
  });

})();
