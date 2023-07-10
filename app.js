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

const PlayerInput = function(){
    const playerOne = document.querySelector(".name-input");
    const playerChoice = document.querySelectorAll(".value");
    const playerModal = document.querySelector(".player-modal");

    let playerOneName;
    let playerTwoName = "NPC";
    let playerOneChoice;
    let playerTwoChoice;
    let twoChoose = function(p1){
        if (p1 === "X"){
            return "O"
        } else if (p1 === "O"){
            return "X"
        }
    }

    function Players(name,token){
        name:name;
        token:token;
        return{
            name,token
        }
    }
    let players = [];
    let playerOneInput;
    let playerTwoInput;

    for(let i = 0; i<playerChoice.length; i++){
        playerChoice[i].addEventListener("click", (e)=>{
            e.preventDefault();
            if(playerOne.value !== ""){
                playerModal.classList.add("inactive");
                playerOneName = playerOne.value;
                playerOneChoice = playerChoice[i].textContent;
                playerTwoChoice = twoChoose(playerOneChoice);            
            }
            playerOneInput = Players(playerOneName,playerOneChoice)
            playerTwoInput = Players( playerTwoName, playerTwoChoice );
            players.push(playerOneInput);
            players.push(playerTwoInput);
        })
    }
    
    return{
        players
    }  
};



const GameController = function(){

      
    let board = Gameboard();
    let block = board.block;
    let boardArray = [];

    const turnText = document.querySelector(".turn");


    let playersInput = PlayerInput();
    const players = playersInput.players;
        console.log(players);
        let activePlayer = players[0];
        const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        };
        const printNewRound = () => {
        turnText.textContent = `${activePlayer.name}'s turn`;
        }; 

        //!! TOKEN IS NOT READING BECAUSE THE INSTANTIATION OF PLAYERS INPUT IS LATE. WE PLAYROUND BEFORE WE START PLAYERSINPUT. MAYBE WE NEED TO INSTANTIATE PLAYERSINPUT IN PLAYROUND. IDK. THEY SUGGEST CREATE A START BUTTON TO FIX. RECONSIDER TMRO

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
                
                switchPlayerTurn();
                printNewRound();
                WinningConditions(boardArray)
            })
        }
    }
playRound();
}

const WinningConditions = function(arr){
    const block = document.querySelectorAll(".block");

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
    console.log(wpOne, wpTwo, wpThree);
    if (block[wpOne].textContent === "X" &&
    block[wpTwo].textContent === "X" &&
    block[wpThree].textContent === "X"){
        console.log("X WIN");
        //!+ modal pop winner
        //!+ gameend here
        return
    } else if (block[wpOne].textContent === "O" &&
    block[wpTwo].textContent === "O" &&
    block[wpThree].textContent === "O"){
        console.log("O WIN");
        //!+ modal pop winner
        //!+ gameend here
        return
    }
}
}


GameController();

//!+ not done yet
function GameEnd (){
    //need to end the game
}




