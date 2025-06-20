const gameBoard = (function(){
    const board = ["", "", "", 
                   "", "", "", 
                   "", "", ""];

    let resetBoard = () => ["", "", "", "", "", "", "", "", ""];
    let getBoard = () => board;
    return {getBoard, resetBoard};
})

function createPlayer(marker){
    let score = 0;
    let name;

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
    let gerMarker = () => marker();

    return {getName, setName, addScore, getScore, restartScore, gerMarker};
}

function gameController(){
  let board = gameBoard.getBoard();
  const playerOne = createPlayer("X");
  const playerTwo = createPlayer("O");

  let round = 0;
  let turn = round % 2 == 0 ? playerOneTurn : playerTwoTurn;
}


// (function (age) {
//   console.log(`Your are cool and ${age}`);
//   return `Your are cool and ${age}`;
// })(10);
