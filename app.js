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
    const playerChoice = document.querySelectorAll('input[type="radio"][name="xoro"]');

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
    let npcDifficulty = [];
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
        players,
        npcDifficulty
    }

};
// run the game 
const GameController = function(){      
    let board = Gameboard();
    let block = board.block;
    let boardArray = [0,1,2,3,4,5,6,7,8];
    


    const turnText = document.querySelector(".turn");
    const submitButton = document.querySelector(".start-game");
    const restartDiv = document.querySelector(".restart-div");
    const npcDiffPage = document.querySelectorAll('input[type="radio"][name="npcmode"]');
    const difficulty =  document.querySelector(".difficulty");
    const textArea = document.querySelector(".text-area");

    difficulty.classList.remove("inactive");
    textArea.classList.remove("inactive");  
    
    let players = [];
    let playersInput = PlayerInput();
    
    let activePlayer;; 
    let ai; 
    let human;
    
    let npcDifficulty = [];

    //start game from player-modal
    submitButton.addEventListener("click", (e)=>{
        e.preventDefault();
        const temp = Object.entries(playersInput);
        players.push(temp[0][1][0]);
        players.push(temp[0][1][1]);
        activePlayer = players[0];
        restartDiv.classList.add("inactive");
        ai = players[1].token;
        human = players[0].token;
        npcDifficulty = [];
        npcDiffPage[0].checked === true ? npcDifficulty.push("easy") : npcDifficulty.push("hard");
        console.log(npcDifficulty);
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
        ai = players[1].token;
        human = players[0].token;
        
        npcDifficulty = [];
        console.log(npcDiffPage);
        npcDiffPage[2].checked === true ? npcDifficulty.push("easy") : npcDifficulty.push("hard");
        console.log(npcDifficulty);
        difficulty.classList.add("inactive");
        textArea.classList.add("inactive");
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

                let winningConditions = WinningConditions(activePlayer,boardArray);
                let win = winningConditions.win;

                winningConditions;
                if (win !== null) {
                    GameEnd(win);
                }
                switchPlayerTurn();
                printNewRound();
            
                const fightModal = document.querySelector(".fight-modal");
                if(fightModal.classList.contains("inactive")){
                    if(npcDifficulty[0] === "hard"){
                        npcChoiceHARD(activePlayer, boardArray, block, board, ai, human);                        
                    } else if(npcDifficulty[0] = "easy"){
                        npcChoiceEZ(activePlayer, boardArray, block, board)
                    }
                    let winningConditions = WinningConditions(activePlayer,boardArray);
                        let win = winningConditions.win;  
                        winningConditions;
                        if (win !== null) {
                            GameEnd(win);
                        }
                        switchPlayerTurn();
                        printNewRound();
                }                
            })
        }
    }

}
// set the winning conditions
const WinningConditions = function(player, board){
    let win = null;

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
        if (board[wpOne] === "X" &&
            board[wpTwo] === "X" &&
            board[wpThree] === "X"){
            win = {index: [wpOne,wpTwo,wpThree], player: player}    
        } else if (board[wpOne] === "O" &&
            board[wpTwo] === "O" &&
            board[wpThree] === "O"){
            win = {index: [wpOne,wpTwo,wpThree], player: player};         
        } else if (EmptySpot(board).length === 0){
            win = "DRAW"
        }
}
return{
    win
}

}

GameController();

// Random computer move here we add the items to boardArray and also the board
const npcChoiceHARD = function(activePlayer, boardArray, block, board, ai, human){        

        let cbs = boardArray;

        let bestPlay = minimax(cbs, ai, 0, ai, human);
        console.log(bestPlay.index);
        
        block[bestPlay.index].textContent = activePlayer.token;
        board[bestPlay.index] = activePlayer.token;
        boardArray[bestPlay.index] = activePlayer.token;
        
}

function minimax(cbs, currentMark, depth, ai, human){

    function checkWinner(cbs, currentMark){
        if((cbs[0] === currentMark &&
            cbs[1] === currentMark &&
            cbs[2] === currentMark) ||
            (cbs[0] === currentMark &&
            cbs[3] === currentMark &&
            cbs[6] === currentMark) ||
            (cbs[0] === currentMark &&
            cbs[4] === currentMark &&
            cbs[8] === currentMark) ||
            (cbs[1] === currentMark &&
            cbs[4] === currentMark &&
            cbs[7] === currentMark) ||
            (cbs[2] === currentMark &&
            cbs[4] === currentMark &&
            cbs[6] === currentMark) ||
            (cbs[2] === currentMark &&
            cbs[5] === currentMark &&
            cbs[8] === currentMark) ||
            (cbs[3] === currentMark &&
            cbs[4] === currentMark &&
            cbs[5] === currentMark) ||
            (cbs[6] === currentMark &&
            cbs[7] === currentMark &&
            cbs[8] === currentMark)){
                return true;
            } else {
                return false;
            }
    }

    function emptyCells(cbs){
        return cbs.filter(i => typeof i === "number")
    }

    const availCells = emptyCells(cbs);

    if (checkWinner(cbs, human)){
        return {score: -10}
    } else if (checkWinner(cbs, ai)){
        return {score: 10}
    }else if (availCells.length === 0){
        return {score: 0}
    }

    const allTestPlayInfo = [];

    for(let i=0; i < availCells.length; i++){
        const currentTestPlayInfo = {};
        currentTestPlayInfo.index = cbs[availCells[i]]
        cbs[availCells[i]] = currentMark;
        if(currentMark === ai){
            const result = minimax(cbs, human, depth+1, ai, human);
            currentTestPlayInfo.score = result.score;
        } else{
            const result = minimax(cbs, ai, depth+1, ai, human)
            currentTestPlayInfo.score = result.score;
        }
        cbs[availCells[i]] = currentTestPlayInfo.index;
        allTestPlayInfo.push(currentTestPlayInfo)
    }

    let bestTestPlay = null;
    if(currentMark === ai){
        let bestScore = -10000;
        for(let i = 0; i < allTestPlayInfo.length; i++){
            if (allTestPlayInfo[i].score > bestScore){
                bestScore = allTestPlayInfo[i].score;
                bestTestPlay = i
            }
        }
    } else {
        let bestScore = 10000;
        for(let i = 0; i < allTestPlayInfo.length; i++){
            if (allTestPlayInfo[i].score < bestScore){
                bestScore = allTestPlayInfo[i].score;
                bestTestPlay = i
            }
        }
    }
    return allTestPlayInfo[bestTestPlay]
}

const npcChoiceEZ = function(activePlayer, boardArray, block, board){
        let npcSelect = Math.floor(Math.random() * 9);
        function emptyCells(cbs){
            return cbs.filter(i => typeof i === "number")
        }

        if(typeof boardArray[npcSelect] === "number"){
            block[npcSelect].textContent = activePlayer.token;
            board[npcSelect] = activePlayer.token;
            boardArray[npcSelect] = activePlayer.token;
        } else if (emptyCells(boardArray).length === 0){
            console.log(emptyCells(boardArray).length);
            return
        } else {
            npcChoiceEZ(activePlayer,boardArray, block, board);
        }      
}

// end the game by refreshing page
function GameEnd (win){
    const fightModal = document.querySelector(".fight-modal");
    const result = document.querySelector(".result");
    fightModal.classList.remove("inactive");  
    
   
    if (win === "DRAW"){
        result.textContent = "DRAW!"
    } else {
        win.player.name !== "NPC" ? result.textContent = `Congratulations! You Win!` : result.textContent = `Sorry You Lose!`
    }
    
    const playAgain = document.querySelector(".again")
    playAgain.addEventListener("click",()=>{
        window.location.reload();

    })
}

function EmptySpot(boardArray){
    return boardArray.filter(i => typeof i == "number");
}
