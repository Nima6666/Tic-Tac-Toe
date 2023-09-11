const gameBoard = document.querySelector('.gameboard');
const startBtn = document.querySelector('#start-button');
const restartBtn = document.querySelector('#restart-button');
const controls = document.querySelector('.controls');

const Gameboard = (() => {
    let gameBoards = ['', '', '', '', '', '', '', '', ''];
    

    const render = () => {
        let boardHTML = '';
        gameBoards.forEach((square, index) => {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`;
        })

        gameBoard.innerHTML = boardHTML;

        const squares = document.querySelectorAll('.square');
        
        squares.forEach((box) => {
            box.addEventListener('click', Game.clickHandler);
        })
    }

    const getGameboard = () => gameBoards;

    const update = (index, sign) => {
        Gameboard.getGameboard()[index] = sign;
    }

    return {
        render,
        getGameboard,
        update
    }
})()

const createPlayer = ((name, sign) => {
    return {
        name,
        sign
    }
})


const Game = (() => {
    let stateRun;
    let players = [];
    let currentPlayerID = 0;

    const start = () => {
        stateRun = true;
        startBtn.disabled = true;
        document.querySelector('#player1').disabled = true;
        document.querySelector('#player2').disabled = true;
        //document.querySelector('.controls').setAttribute('style', 'display: none;');
        players = [
            createPlayer(document.querySelector('#player1').value ? document.querySelector('#player1').value : 'player1', 'X'),
            createPlayer(document.querySelector('#player2').value ? document.querySelector('#player1').value : 'player2', 'O')
        ]

        Gameboard.render();
    }

    const restart = () => {
        for (let i = 0;  i<9; i++) {
            Gameboard.update(i, "");
        }
        stateRun = true;
        DisplayController.clear();
        Gameboard.render();
    }

    const clickHandler = (event) => {

        if (!stateRun) {return;}

        DisplayController.turnDisplay(players[currentPlayerID].name);

        let index = parseInt(event.target.id.split('-')[1]);
        if (Gameboard.getGameboard()[index] !== "") { return; };
        Gameboard.update(index, players[currentPlayerID].sign);
        Gameboard.render();
        
        
        if (checkWin(Gameboard.getGameboard(), players[currentPlayerID].sign)) {
            stateRun = false;
            DisplayController.winDisplay(players[currentPlayerID].name);
        } else if (checkTie(Gameboard.getGameboard())) {
            stateRun = false;
            DisplayController.tieDisplay();
        }
        currentPlayerID = currentPlayerID === 0 ? 1 : 0;
        
    }




    return {
        start,
        clickHandler,
        restart
    }

})()

const DisplayController = (() => {

    const inDisplay = document.querySelector('.display');

    const turnDisplay = (name) => {
        inDisplay.textContent = `${name}'s turn!!`
    }

    const winDisplay = (player) => {
        inDisplay.textContent = `${player} won!!`
    }

    const tieDisplay = () => {
        inDisplay.textContent = `tie`;
    }

    const winningLine = (arr, sign) => {
        arr.forEach((index) => {
            Gameboard.getGameboard()[index] = `<u> ${sign} </u>`;
        })
        Gameboard.render();
    }

    const clear = () => {
        inDisplay.textContent = "";
    }

    return {
        turnDisplay,
        winDisplay,
        tieDisplay,
        clear,
        winningLine
    }


})()

function checkWin (board, id) {
    const winningConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ]
    
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b , c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c] ) {
            DisplayController.winningLine([a,b,c], id);
            return true;
        }
    }
    
    
    
}

function checkTie(board) {
    return board.every(cell => cell !== "")
}
startBtn.addEventListener('click', () => {
    Game.start();
})
restartBtn.addEventListener('click', () => {
    Game.restart();
})