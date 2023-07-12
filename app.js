// generate gameboard first
const Gameboard = function(){
    const row = 3;
    const column = 3;
    let board = [];
    let currentPos;
    const divGameboard = document.querySelector(".game-board");

    for(let r=0; r< row; r++){
        for (let c=0; c<column; c++){
            const createButton = document.createElement("button");
            createButton.classList = "block";
            currentPos = r.toString() + "-" + c.toString();
            // createButton.textContent = currentPos;
            board.push();
            divGameboard.appendChild(createButton);
        }
    }
    const getBoard = () => board;
    const block = document.querySelectorAll(".block");
    return { getBoard, block}   
};
//get playerinputs
const PlayerInput = function(){
    const playerOne = document.querySelector(".name-input");
    const playerChoice = document.querySelectorAll('input[type="radio"]');

    const playerModal = document.querySelector(".player-modal");
    const submitButton = document.querySelector(".start-game");
    let playerOneName;
    let playerTwoName = "NPC";
    let playerOneChoice;
    let playerTwoChoice;

    function Players(name,token){
        name:name;
        token:token;
        return{
            name,token
        }
    }
    let players = [];

    let playerOneData = sessionStorage.getItem("playerOneData");

    if(playerOneData !== null){
        playerModal.classList.add("inactive")
        playerOneData = JSON.parse(playerOneData)
        players = playerOneData;
    } else if (playerOneData === null){   
        submitButton.addEventListener("click", (e)=>{
            e.preventDefault();
            if(playerOne.value !== ""){
                playerModal.classList.add("inactive");
            }
            playerOneName = playerOne.value;
            playerChoice[0].checked === true ? playerOneChoice = "X" : playerOneChoice = "O";
            playerOneChoice === "X" ? playerTwoChoice = "O" : playerTwoChoice = "X"; 
            let playerOneInput = Players(playerOneName, playerOneChoice)
            let playerTwoInput = Players(playerTwoName, playerTwoChoice)
            players.push(playerOneInput);
            players.push(playerTwoInput);
            sessionStorage.setItem("playerOneData",JSON.stringify(players));
        })   
    }

    return{
        players
    }

};
// run the game 
const GameController = function(){      
    let board = Gameboard();
    let block = board.block;
    let boardArray = [];

    const turnText = document.querySelector(".turn");
    const submitButton = document.querySelector(".start-game");
    const restartDiv = document.querySelector(".restart-div");

    
    let players = [];
    let playersInput = PlayerInput();

    let activePlayer;; 

    //start game from player-modal
    submitButton.addEventListener("click", (e)=>{
        e.preventDefault();
        const temp = Object.entries(playersInput);
        players.push(temp[0][1][0]);
        players.push(temp[0][1][1]);
        activePlayer = players[0];
        playRound();
    })
    //restart game from main page
    let restartBtn = document.querySelector(".restart");
    restartBtn.addEventListener("click", ()=>{       
        const temp = Object.entries(playersInput);
        players.push(temp[0][1][0]);
        players.push(temp[0][1][1]);
        activePlayer = players[0];
        restartDiv.classList.add("inactive");
        playRound();

    })
    
    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const printNewRound = () => {
        turnText.textContent = `${activePlayer.name}'s turn`;
    }; 
    //playing a round
    const playRound = () =>{    
//for every button,
        for (let i = 0; i <block.length; i++){
//Listen for clicks on the block           
            block[i].addEventListener("click", function(){ 
                
//This is to prevent someone to click same button twice
                if (block[i].textContent !== ""){
                    console.log("Error");
//!+ Here I might want to add a modal that pops out an error
                    return
                }
                block[i].textContent = activePlayer.token;
                board[i] = activePlayer.token;
                boardArray[i] = activePlayer.token;

                WinningConditions(activePlayer);
                switchPlayerTurn();
                printNewRound();

                const fightModal = document.querySelector(".fight-modal");
                if(fightModal.classList.contains("inactive")){
                    npcChoice(activePlayer, boardArray, block, board);
                    WinningConditions(activePlayer);
                    switchPlayerTurn();
                    printNewRound();
                }                
            })
        }
    }

}
// set the winning conditions
const WinningConditions = function(activePlayer){
    const block = document.querySelectorAll(".block");
    const fightModal = document.querySelector(".fight-modal");
    const result = document.querySelector(".result");

    const winningPositions = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,4,6],
    [2,5,8],
    [3,4,5],
    [6,7,8],
];

for (let i = 0; i < winningPositions.length; i ++){
    const wpOne = winningPositions[i][0];
    const wpTwo = winningPositions[i][1];
    const wpThree = winningPositions[i][2];
    if (block[wpOne].textContent === "X" &&
    block[wpTwo].textContent === "X" &&
    block[wpThree].textContent === "X"){
        fightModal.classList.remove("inactive");
        console.log("X WIN");
        console.log(activePlayer.name);
        activePlayer.name !== "NPC" ? result.textContent = `Congratulations! You Win!` : result.textContent = `Sorry You Lose!`
        console.log(activePlayer);
        GameEnd();
        return
    } else if (block[wpOne].textContent === "O" &&
    block[wpTwo].textContent === "O" &&
    block[wpThree].textContent === "O"){
        fightModal.classList.remove("inactive");
        console.log(activePlayer.name);
        activePlayer.name !== "NPC" ? result.textContent = `Congratulations! You Win!` : result.textContent = `Sorry You Lose!`
        console.log("O WIN");
        console.log(activePlayer.name);
        GameEnd();
        return
    } else if (block[0].textContent !== "" && 
    block[1].textContent !== "" && 
    block[2].textContent !== "" && 
    block[3].textContent !== "" && 
    block[4].textContent !== "" && 
    block[5].textContent !== "" && 
    block[6].textContent !== "" && 
    block[7].textContent !== "" && 
    block[8].textContent !== ""){
        console.log("DRAW");
        fightModal.classList.remove("inactive");
        result.textContent = `DRAW`
        console.log(activePlayer);
        GameEnd();
        return
    }
}



}
// Random computer move
const npcChoice = function(activePlayer, boardArray, block, board){
    if (activePlayer.name === "NPC") {
        let npcSelect = Math.floor(Math.random()*9);
        console.log(npcSelect);
        if (boardArray[npcSelect] === undefined){   
            block[npcSelect].textContent = activePlayer.token;
            board[npcSelect] = activePlayer.token;
            boardArray[npcSelect] = activePlayer.token;
        } else if (
                boardArray[0] !== undefined &&
                boardArray[1] !== undefined &&
                boardArray[2] !== undefined &&
                boardArray[3] !== undefined &&
                boardArray[4] !== undefined &&
                boardArray[5] !== undefined &&
                boardArray[6] !== undefined &&
                boardArray[7] !== undefined &&
                boardArray[8] !== undefined  
                ){
                return;
        } else {
            npcChoice(activePlayer, boardArray, block, board);
        }
    }
}
       
GameController();
// end the game by refreshing page
function GameEnd (){
    const playAgain = document.querySelector(".again");
    playAgain.addEventListener("click",()=>{
        window.location.reload();
    })
}




