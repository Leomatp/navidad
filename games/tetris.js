(() => {
  const canvas = document.getElementById('tetris');
  const ctx = canvas.getContext('2d');
  const cols = 10, rows = 20;
  let scale = 24;

  function resizeCanvas(){
    const maxWidth = Math.min(window.innerWidth * 0.92, 420);
    const maxHeight = Math.min(window.innerHeight * 0.72, 800);
    const scaleByWidth = Math.floor(maxWidth / cols) || 24;
    const scaleByHeight = Math.floor(maxHeight / rows) || 24;
    scale = Math.max(12, Math.min(scaleByWidth, scaleByHeight));
    canvas.width = cols * scale;
    canvas.height = rows * scale;
    canvas.style.width = (cols * scale) + 'px';
    canvas.style.height = (rows * scale) + 'px';
    // Redraw after resize
    draw();
  }

  const colors = [null,'#FF0D72','#0DC2FF','#0DFF72','#F538FF','#FF8E0D','#FFE138','#3877FF'];

  let lines = 0;
  let level = 0;
  let paused = false;
  let nextCanvas = null;
  let nextCtx = null;

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
    // Use queued next piece if available; otherwise pick random
    if (!player.next) player.next = createPiece(pieces[(pieces.length*Math.random())|0]);
    player.matrix = player.next;
    player.next = createPiece(pieces[(pieces.length*Math.random())|0]);
    player.pos.y = 0;
    player.pos.x = ((cols/2)|0) - ((player.matrix[0].length/2)|0);
    if(collide(arena, player)){
      arena.forEach(row=>row.fill(0));
      score = 0; lines = 0; level = 0; updateScore();
    }
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
      arena.unshift(row);
      score += rowCount*10;
      rowCount *= 2;
      lines += 1;
      // update level and speed
      level = Math.floor(lines / 10);
      dropInterval = Math.max(100, 800 - level * 60);
      updateScore(); y++; }
  }

  function draw(){
    // Clear canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const w = cols * scale;
    const h = rows * scale;
    // Playfield background
    ctx.fillStyle = '#0a0b10';
    ctx.fillRect(0, 0, w, h);
    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 1; x < cols; x++){
      ctx.beginPath(); ctx.moveTo(x*scale + 0.5, 0); ctx.lineTo(x*scale + 0.5, h); ctx.stroke();
    }
    for (let y = 1; y < rows; y++){
      ctx.beginPath(); ctx.moveTo(0, y*scale + 0.5); ctx.lineTo(w, y*scale + 0.5); ctx.stroke();
    }
    // Draw blocks
    drawMatrix(arena,{x:0,y:0});
    if (player && player.matrix) drawMatrix(player.matrix, player.pos);
    // If next canvas is available, draw next piece
    if(nextCtx && player.next) drawNext();
    // Outer subtle border
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 2; ctx.strokeRect(0.5,0.5,w-1,h-1);
    // Pause overlay
    if(paused){
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#fff'; ctx.font = Math.max(20, scale) + 'px sans-serif'; ctx.textAlign='center';
      ctx.fillText('PAUSA', canvas.width/2, canvas.height/2);
    }
  }

  function drawMatrix(matrix, offset){
    matrix.forEach((row,y)=>{
      row.forEach((val,x)=>{
        if(!val) return;
        const px = (x+offset.x)*scale;
        const py = (y+offset.y)*scale;
        ctx.fillStyle = colors[val];
        ctx.fillRect(px + 1, py + 1, scale - 2, scale - 2);
        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 1, py + 1, scale - 2, scale - 2);
      });
    });
  }

  function playerDrop(){ player.pos.y++; if(collide(arena, player)){ player.pos.y--; merge(arena, player); playerReset(); sweep(); } dropCounter=0; }

  function playerMove(dir){ player.pos.x += dir; if(collide(arena, player)) player.pos.x -= dir; }

  function playerRotate(dir){ rotate(player.matrix, dir); let offset=1; while(collide(arena, player)){ player.pos.x += offset; offset = -(offset + (offset>0?1:-1)); if(offset>player.matrix[0].length) { rotate(player.matrix, -dir); return; } } }

  let dropCounter=0; let dropInterval=800; let lastTime=0; let score=0;
  const player = { pos:{x:0,y:0}, matrix:null };

  function update(time=0){ const delta = time - lastTime; lastTime = time; if(!paused){ dropCounter += delta; if(dropCounter > dropInterval){ playerDrop(); } } draw(); requestAnimationFrame(update); }

  function updateScore(){ const s = document.getElementById('score'); const l = document.getElementById('lines'); const lev = document.getElementById('level'); if(s) s.textContent = 'Score: ' + score; if(l) l.textContent = 'Líneas: ' + lines; if(lev) lev.textContent = 'Nivel: ' + level; }

  function drawNext(){
    if(!nextCtx || !player.next) return;
    const matrix = player.next;
    const w = nextCanvas.width; const h = nextCanvas.height;
    nextCtx.clearRect(0,0,w,h);
    const colsN = matrix[0].length; const rowsN = matrix.length;
    const scaleN = Math.floor(Math.min(w / Math.max(4, colsN), h / Math.max(4, rowsN)));
    const offsetX = Math.floor((w - colsN * scaleN) / 2);
    const offsetY = Math.floor((h - rowsN * scaleN) / 2);
    // background
    nextCtx.fillStyle = 'rgba(10,11,16,0.9)'; nextCtx.fillRect(0,0,w,h);
    for(let y=0;y<rowsN;y++){
      for(let x=0;x<colsN;x++){
        const val = matrix[y][x];
        if(!val) continue;
        const px = offsetX + x*scaleN;
        const py = offsetY + y*scaleN;
        nextCtx.fillStyle = colors[val];
        nextCtx.fillRect(px+1, py+1, scaleN-2, scaleN-2);
        nextCtx.strokeStyle = 'rgba(0,0,0,0.35)'; nextCtx.lineWidth=2; nextCtx.strokeRect(px+1, py+1, scaleN-2, scaleN-2);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    // Setup responsive canvas and handlers
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Setup next piece canvas context
    nextCanvas = document.getElementById('next'); if(nextCanvas) nextCtx = nextCanvas.getContext('2d');

    document.addEventListener('keydown', e=>{ if(e.keyCode===37) playerMove(-1); else if(e.keyCode===39) playerMove(1); else if(e.keyCode===40) playerDrop(); else if(e.keyCode===38) playerRotate(1); });
    document.getElementById('restart').addEventListener('click', ()=>{ 
      if (typeof saveGameScore === 'function') saveGameScore('Tetris', score);
      arena.forEach(r=>r.fill(0)); score=0; updateScore(); playerReset(); 
    });
    const saveBtn = document.getElementById('saveScoreBtn');
    if(saveBtn) saveBtn.addEventListener('click', ()=>{ if(typeof saveGameScore === 'function') { saveGameScore('Tetris', score); alert('Puntuación guardada'); } });

    // Pause button
    const pauseBtn = document.getElementById('pauseBtn');
    if(pauseBtn) pauseBtn.addEventListener('click', ()=>{ paused = !paused; pauseBtn.textContent = paused ? 'Reanudar' : 'Pausa'; });

    // Touch controls
    const btnLeft = document.getElementById('btnLeft');
    const btnRight = document.getElementById('btnRight');
    const btnRotate = document.getElementById('btnRotate');
    const btnDown = document.getElementById('btnDown');
    if(btnLeft) btnLeft.addEventListener('touchstart', e=>{ e.preventDefault(); playerMove(-1); });
    if(btnRight) btnRight.addEventListener('touchstart', e=>{ e.preventDefault(); playerMove(1); });
    if(btnRotate) btnRotate.addEventListener('touchstart', e=>{ e.preventDefault(); playerRotate(1); });
    if(btnDown) btnDown.addEventListener('touchstart', e=>{ e.preventDefault(); playerDrop(); });

    // Swipe/tap gestures on canvas
    let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
    canvas.addEventListener('touchstart', e=>{
      const t = e.touches[0]; touchStartX = t.clientX; touchStartY = t.clientY; touchStartTime = Date.now();
    });
    canvas.addEventListener('touchend', e=>{
      const t = e.changedTouches[0]; const dx = t.clientX - touchStartX; const dy = t.clientY - touchStartY; const dt = Date.now()-touchStartTime;
      const absX = Math.abs(dx), absY = Math.abs(dy);
      if(dt < 300 && absX < 12 && absY < 12){ playerRotate(1); return; }
      if(absX > absY && absX > 20){ if(dx>0) playerMove(1); else playerMove(-1); }
      else if(absY > absX && absY > 20){ if(dy>0) playerDrop(); }
    });

    // Initialize next piece then start
    if(!player.next){ const pieces = 'TJLOSZI'; player.next = createPiece(pieces[(pieces.length*Math.random())|0]); }
    playerReset(); updateScore(); update();
  });

})();
