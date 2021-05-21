const freeCells = (board) => board.flat().count(empty);

const boardFull = (board) => {
    for (let c = 0; c < numberOfColumns; c++) {
        if (board[numberOfRows - 1][c] == 0) return false;
    }

    return true;
}

const togglePlayer = () =>  player = player == ai ? human : ai;

const checkEndGame = (board, color) =>  {

    if (win(board, color) || boardFull(board)) {
        gameOver = true;
        clearInterval(moovingInterval); ///
    }
}

const draw = (winner) => gameOver && winner == undefined;

const timeOut = (startTime) => new Date() - startTime >= timeLimit;

const placeDisc = (board, column, color) => board[freeRaw(board, column)][column] = color;
    
const resetBoard = () => {
    board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));

    // board = [[2,1,2,1,1,2,2],
    //         [1,2,1,2,1,1,1],
    //         [1,2,1,1,2,2,2,],
    //         [2,1,2,2,2,1,1],
    //         [2,2,1,1,1,2,2],
    //         [1,1,1,2,2,1,0]];


    // printBoard(board);

}

const validMove = (board, column) => board[numberOfRows - 1][column] == 0;

const freeRaw = (board, column) => {
    for (let r = 0; r < numberOfRows; r++)  {
        if (board[r][column] == 0) return r;
    }
}

const getValidMoves = (board) => {

    let validMoves = [];

    for (let c = 0; c < numberOfColumns; c++) {
        if (validMove(board, c)) validMoves.push(c);
    }

    validMoves = validMoves.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);

    return validMoves;
}

const terminalNode = (board) => win(board, human) || win(board, ai) || boardFull(board);

const cell = (r, c) => 7 * ((numberOfRows - 1) - r) + (c + 1);