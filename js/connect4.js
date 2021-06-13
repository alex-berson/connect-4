let board = [];
let moovingInterval;
let gameOver = false;
let depth = 1;

const numberOfRows = 6;
const numberOfColumns = 7;
const timeLimit = 600;
const empty = 0
const human = 1;
const ai = 2;
const durations = [0.15, 0.28, 0.38, 0.46, 0.54, 0.61];

let firstPlayer = player = human;

const timeOut = (startTime) => new Date() - startTime >= timeLimit;

const placeDisc = (board, column, color) => board[freeRaw(board, column)][column] = color; 

const validMove = (board, column) => board[numberOfRows - 1][column] == 0; 

const terminalNode = (board) => win(board, human) || win(board, ai) || boardFull(board);

const draw = (winner) => gameOver && winner == undefined;

const cellNumber = (r, c) => numberOfColumns * ((numberOfRows - 1) - r) + (c + 1);

const togglePlayer = () =>  player = player == ai ? human : ai;

const resetBoard = () => {
    board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));

    // board = [[2,1,2,1,1,2,2],
    //         [1,2,1,2,1,1,1],
    //         [1,2,1,1,2,2,2,],
    //         [2,1,2,2,2,1,1],
    //         [2,2,1,1,1,2,2],
    //         [1,1,1,2,2,1,0]];

    // board = [[1,2,2,2,1,2,1],
    //         [0,1,1,1,2,1,1],
    //         [0,0,2,1,2,2,2,],
    //         [0,0,2,2,1,1,1],
    //         [0,0,0,2,0,0,2],
    //         [0,0,0,0,0,0,1]];
}

const freeCells = (board) => {

    let numberOfFreeCells = 0
    
    for (let i = 0; i < numberOfRows; i++) {
        for (let j = 0; j < numberOfColumns; j++) {
            if (board[i][j] == empty) numberOfFreeCells++;
        }
    }

    return numberOfFreeCells;
}

const freeRaw = (board, column) => { 
    for (let r = 0; r < numberOfRows; r++)  {
        if (board[r][column] == 0) return r;
    }
}

const occurrences = (array, color) => {

    let occurrencesEmpty = 0;
    let occurrencesColor = 0;
    let occurrencesReversedColor = 0;
    let reversedColor = color == ai ? human : ai;

    for (let i = 0; i < array.length; i++) {
        if (array[i] == color) occurrencesColor++;
        if (array[i] == reversedColor) occurrencesReversedColor++;
        if (array[i] == empty) occurrencesEmpty++;
    }

    return [occurrencesColor, occurrencesReversedColor, occurrencesEmpty];
}

const checkEndGame = (board, color) =>  {

    if (win(board, color) || boardFull(board)) {
        gameOver = true;
        clearInterval(moovingInterval); //
    }
}

const boardFull = (board) => {
    for (let c = 0; c < numberOfColumns; c++) {
        if (board[numberOfRows - 1][c] == 0) return false;
    }

    return true;
}

const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]] 
    }
}

const getValidMoves = (board) => { 

    let validMoves = [];

    for (let c = 0; c < numberOfColumns; c++) {
        if (validMove(board, c)) validMoves.push(c);
    }

    shuffle(validMoves);

    return validMoves;
}

setServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js')
                .then(reg => {
                    console.log('Service worker registered!', reg);
                })
                .catch(err => {
                    console.log('Service worker registration failed: ', err);
                });
        });
    } 
}

const resetGame = () =>{

    const cleaningTime = 800;
    depth = 1;
    gameOver = false;
    firstPlayer = firstPlayer == human ? ai : human;
    player = firstPlayer;

    disableTouch();
    clearBoard(cleaningTime);
    resetBoard();

    if (player == ai) {
            setTimeout(() => {
                resetDiscs();
                aiMove();
            }, cleaningTime);
    } else {
        setTimeout(() => {
            resetDiscs();
            enableTouch();
        }, cleaningTime);
    }
}

const autoPlay = () => {

    player = (Math.random() < 0.5) ? human : ai;

    // player = human;

    moovingInterval = setInterval(aiMove, timeLimit + 100); 
}

const init = () => {

    setServiceWorker();
    setBoardSize();
    setFontSize();
    showBoard();
    disableTouchMove();
    resetBoard();
    enableTouch();

    // autoPlay();

    // takeScreenshot(); 
}

window.onload = () => {
    document.fonts.ready.then(() => {
        setTimeout(() => {
            init();     
        }, 50);
    });
}