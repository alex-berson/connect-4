let board;
let nRows = 6;
let nCols = 7;
let empty = 0
let human = 1;
let ai = 2;
let firstPlayer = human;
let player = firstPlayer;

const validMove = (board, col) => board[0][col] == 0; 

const togglePlayer = () => player = player == ai ? human : ai;

const gameOver = (board) => win(board, human) || win(board, ai) || boardFull(board);

const initBoard = () => board = Array.from({length: nRows}, () => Array(nCols).fill(0));

const updateBoard = (board, col, color) => board[freeRaw(board, col)][col] = color; 

const shuffle = (array) => {

    for (let i = array.length - 1; i > 0; i--) {

        let j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

const validMoves = (board) => { 

    let moves = [];

    for (let c = 0; c < nCols; c++) {
        if (validMove(board, c)) moves.push(c);
    }

    return shuffle(moves);
}

const nFreeCells = (board) => {

    let n = 0
    
    for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols; c++) {
            if (board[r][c] == empty) n++;
        }
    }

    return n;
}

const boardFull = (board) => {

    for (let c = 0; c < nCols; c++) {
        if (board[0][c] == 0) return false;
    }

    return true;
}

const freeRaw = (board, col) => { 

    for (let r = nRows - 1; r >= 0; r--) {
        if (board[r][col] == 0) return r;
    }
}

const newGame = () => {

    firstPlayer = firstPlayer == human ? ai : human;
    player = firstPlayer;

    clearBoard();
    initBoard();

    setTimeout(() => player == ai ? aiTurn() : enableTouch(), 1000);
}

const aiTurn = async () => {

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    let timeLimit = 600;
    let startTime = new Date();
    let initMove = nFreeCells(board) == nCols * nRows;
    let col = initMove ? 3 : minimax(board, startTime, timeLimit);
    let row = freeRaw(board, col);
    let delay = (timeLimit - (new Date() - startTime));

    await sleep(initMove ? 0 : delay);

    updateBoard(board, col, player);
    dropDisc(board, row, col, player);

    if (gameOver(board)) {
        endGame(row);
    } else {
        togglePlayer();
        setTimeout(enableTouch, 300);
    }
}

const humanTurn = (e) => {

    let el = e.currentTarget;
    let col = [...el.parentNode.children].indexOf(el) % 7;
    let row = freeRaw(board, col);

    if (!validMove(board, col)) return;

    disableTouch();
    updateBoard(board, col, player);
    dropDisc(board, row, col, player);

    if (gameOver(board)) {
        endGame(row);
    } else {
        togglePlayer();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiTurn();
            });
        });
    }
}

const registerServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
    };
}

const init = () => {
    registerServiceWorker();
    disableTapZoom();
    setBoardSize();
    initBoard();
    showBoard();
    enableTouch();
}

window.onload = document.fonts.ready.then(init);