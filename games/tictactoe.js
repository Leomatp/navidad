(() => {
  const WIN = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  let board = Array(9).fill('');
  let xTurn = true;

  function render(){
    const container = document.getElementById('board');
    container.innerHTML = '';
    board.forEach((v,i)=>{
      const c = document.createElement('div');
      c.className = 'cell'; c.textContent = v; c.dataset.index = i;
      c.addEventListener('click', ()=> onCell(i));
      container.appendChild(c);
    });
    document.getElementById('turn').textContent = board.some(Boolean) ? `Turno: ${xTurn ? 'X' : 'O'}` : `Turno: ${xTurn ? 'X' : 'O'}`;
  }

  function checkWin(player){
    return WIN.some(combo => combo.every(i => board[i] === player));
  }

  let moves = 0;
  function onCell(i){
    if(board[i]) return;
    board[i] = xTurn ? 'X' : 'O';
    moves++;
    if(checkWin(board[i])){
      render(); setTimeout(()=>{
        alert(`${board[i]} gana!`);
        if(typeof saveGameScore === 'function') saveGameScore('TicTacToe', moves, `winner:${board[i]}`);
      },100);
      disableBoard();
      return;
    }
    if(board.every(Boolean)) { render(); setTimeout(()=>alert('Empate!'),100); return; }
    xTurn = !xTurn; render();
  }

  function disableBoard(){
    // make cells non-clickable by replacing board with same values
    xTurn = true;
  }

  function reset(){ board = Array(9).fill(''); xTurn = true; moves = 0; render(); }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.getElementById('resetBtn').addEventListener('click', reset);
    render();
  });

})();
