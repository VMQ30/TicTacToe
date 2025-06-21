//setting up the board
const gameBoard = (function(){
    let board = ["", "", "", 
                   "", "", "", 
                   "", "", ""];

    let resetBoard = () => {board = ["", "", "", "", "", "", "", "", ""];}
    let getBoard = () => board;

    let placeMarker = (playerMarker, index) => {board[index] = playerMarker};

    return {getBoard, resetBoard, placeMarker};
})();

//player factory
function createPlayer(marker){
    let score = 0;
    let name;

    //default name
    if(marker == "X"){
      name = "Player One"
    }
    else{
      name = "Player Two"
    }

    let addScore = () => score++;
    let getScore = () => score;
    let restartScore = () => score = 0;
    let getName = () => name;
    let setName = (newName) => name = newName;
    let getMarker = () => marker;

    return {getName, setName, addScore, getScore, restartScore, getMarker};
}

//controls the entire game and its flow
function gameController(){
  let board = gameBoard.getBoard();
  const playerOne = createPlayer("X");
  const playerTwo = createPlayer("O");

  let winner;
  const getWinner = () => winner;

  //determines the current player
  let round = 0;
  let currentPlayer = () => round % 2 == 0 ? playerOne : playerTwo;
  const getCurrentPlayer = () => currentPlayer();

  let gameEnd = false;

  //allows current player to pick a square and place a marker
  const gameStart = (index) =>{
    
    if (gameEnd == true){
      return;
    }

    let player = getCurrentPlayer();

    gameBoard.placeMarker(index, player.getMarker())

    if(checkWinner() == true){
        winner = player.getName();
        gameEnd = true;
        player.addScore();
    }

    if(board.every(cell => cell != "")){
      gameEnd = true;
      winner = "tie";
    }
    round++;
  };

  //checks if a player has won
  const checkWinner = () => {
    let b = board;
    const winningPattern = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];

    return winningPattern.some(pattern =>{
      const [x,y,z] = pattern;
      return b[x] && b[x] == b[y] && b[x] == b[z];
    })
  };

  const restartGame = () => {
    gameBoard.resetBoard();
    round = 0;
    gameEnd = false;
    playerOne.restartScore();
    playerTwo.restartScore();
  }

  return{gameStart, restartGame, getCurrentPlayer, getWinner}
}

