
    //setting up the board
  const gameBoard = (function(){
      let board = ["", "", "", 
                    "", "", "", 
                    "", "", ""];

      let resetBoard = () => {board = ["", "", "", "", "", "", "", "", ""];}
      let getBoard = () => board;

      let placeMarker = (index, playerMarker) => {
        board[index] = playerMarker;
        return true;
      };

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
    
    let ties = 0;
    const playerOne = createPlayer("X");
    const playerTwo = createPlayer("O");
    const getPlayerOne = () => playerOne;
    const getPlayerTwo = () => playerTwo;
    const getTies = () => ties;

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

      gameBoard.placeMarker(index, player.getMarker());
      round++;

      if(checkWinner() == true){
          winner = player.getName();
          gameEnd = true;
          player.addScore();
      }

      else if(gameBoard.getBoard().every(cell => cell != "")){
        gameEnd = true;
        winner = "tie";
        ties++;
      }
      
    };

    //checks if a player has won
    const checkWinner = () => {
      let b = gameBoard.getBoard(); 
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

    const nextGame = ()=>{
      gameBoard.resetBoard();
      round = 0;
      gameEnd = false;
      winner = undefined;
    }

    const restartGame = () => {
      gameBoard.resetBoard();
      round = 0;
      ties = 0;
      gameEnd = false;
      playerOne.restartScore();
      playerTwo.restartScore();
      winner = undefined;
    }

    return{gameStart, nextGame, restartGame, getCurrentPlayer, getWinner, getPlayerOne, getPlayerTwo, getTies}
  }

  const displayController = (function(){
      const game = gameController();

      const buttons = document.querySelector(".grid");

      const quit = document.getElementById('quit');
      const next = document.getElementById("next");
      let scores = document.querySelector(".stat-box");

      const cells = document.querySelectorAll(".cell");
      const restart = document.getElementById("restart");
      const change = document.getElementById("change");

      let playerOneScore = document.getElementById("player-one-score-text");
      let playerTwoScore = document.getElementById("player-two-score-text");
      let playerTieScore = document.getElementById("player-tie-score-text");

      let announcement = document.querySelector(".announcement-screen");
      let congratulatoryMessage = document.querySelector(".first-header");
      let winnerAnnouncement = document.querySelector(".second-header");

      let changeNameBox = document.querySelector(".change-name");
      const exit = document.querySelector(".exit");
      const confirmChangeButton = document.querySelector(".change-button");

      const hoverEffects = () =>{
        if (game.getCurrentPlayer().getMarker() == "X"){
          buttons.classList.add("player-one");
          buttons.classList.remove("player-two");
        }

        if (game.getCurrentPlayer().getMarker() == "O"){
          buttons.classList.add("player-two");
          buttons.classList.remove("player-one");
        }
      }
      const displayBoard = () => {
        const board =gameBoard.getBoard();
        cells.forEach((cell, i) => {
          cell.textContent = board[i];
        });
      };

      const updateScores = () =>{
        playerOneScore.innerText = game.getPlayerOne().getScore();
        playerTwoScore.innerText = game.getPlayerTwo().getScore();
        playerTieScore.innerHTML = game.getTies();
      };

      const clickCells = () =>{
        cells.forEach(cell =>{
          cell.addEventListener("click", () =>{
            const button = +cell.id;
            const board = gameBoard.getBoard();

            

            if (board[button] !== "") return;
            game.gameStart(button);
            displayBoard();
            hoverEffects();

            let winner = game.getWinner();

            if (winner == "tie"){
              congratulatoryMessage.innerText = "It's a Tie!";
              winnerAnnouncement.innerText = `No One Won!`;
              announcement.classList.add("display");
              scores.classList.add("remove");
            }
            if (winner == game.getPlayerOne().getName() || winner == game.getPlayerTwo().getName()){
              congratulatoryMessage.innerText = "Congratulations!";
              winnerAnnouncement.innerText = `${winner} Have Won the Round!`;
              scores.classList.add("remove");
              announcement.classList.add("display");
            }
            
            updateScores();
          });
        });
        
      };

      const changeName = () =>{
        let firstPlayerName = document.getElementById("first-player-name").value;
        let secondPlayerName = document.getElementById("second-player-name").value;

        game.getPlayerOne().setName(firstPlayerName);
        game.getPlayerTwo().setName(secondPlayerName);
      }

      quit.addEventListener("click", () =>{
        let message = "Are You Sure You Want to Quit the Game?"
        let quitGame = confirm(message);
        if(quitGame){
          game.restartGame();
          displayBoard();
          updateScores();
          announcement.classList.remove("display");
          scores.classList.remove("remove");
        }
        else{
          return;
        }
      })

      next.addEventListener("click", () =>{
        announcement.classList.remove("display");
        game.nextGame();
        displayBoard();
        updateScores();
        hoverEffects();
        scores.classList.remove("remove");
      })

      restart.addEventListener("click", ()=>{
        let message = "Are You Sure You Want to Restart the Game?"
        let restartGame = confirm(message);
        if(restartGame){
          game.restartGame();
          displayBoard();
          updateScores();
          hoverEffects();
        }
        else{
          return;
        }
      });

      confirmChangeButton.addEventListener("click", () =>{
        changeName();
      });
      change.addEventListener("click", () =>{
        changeNameBox.classList.add("display");
        scores.classList.add("remove");
      });

      exit.addEventListener("click", () =>{
        changeNameBox.classList.remove("display");
        scores.classList.remove("remove");
      });

      changeNameBox.addEventListener("click", () =>{
        changeNameBox.classList.remove("display");
        scores.classList.remove("remove");
      });

      const nameBox = document.querySelector(".change-name-box");
      nameBox.addEventListener("click", (event) =>{
        event.stopPropagation();
      })
      
      const callGame = () =>{
        displayBoard();
        updateScores();
        clickCells();
        hoverEffects();
      };

      callGame();
  })();
