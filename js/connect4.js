let board = [];

const numberOfRows = 6;
const numberOfColumns = 7;

const empty = 0
const human = 1;
const ai = 2;

let gameOver = false;

let player;

Object.defineProperties(Array.prototype, {
    count: {
        value: function(value) {
            return this.filter(x => x==value).length;
        }
    }
});


Object.defineProperties(Array.prototype, {
    copy: {
        value: function() {
            return this.map((arr) => arr.slice());
        }
    }
});


const disableTouchMove = () => {

    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchmove', preventDefault, { passive: false });

}

const touchScreen = () => {
    return matchMedia('(hover: none)').matches;
}

const setEvents = () => {
    for (peg of document.querySelectorAll('.cell')){
        if (touchScreen()){
            peg.addEventListener("touchstart", humanMove);
        } else {
            peg.addEventListener("mousedown", humanMove);
        }
    }
}

const boardFull = (board) => {
    for (let c = 0; c < numberOfColumns; c++) {
        if (board[numberOfRows - 1][c] == 0) return false;
    }

    return true;
}

const togglePlayer = () => player = (human + ai) - player;

const checkEndGame = (board, color) =>  {
    if (win(board, color) || boardFull(board)) gameOver = true;
}

const dropDisc = (board, column, color) => {

        board[freeRaw(board, column)][column] = color;
}

const aiMove = () => {

    let column;

    // do{

    //     column = Math.floor(Math.random() * Math.floor(numberOfColumns));

    // } while (!validMove(board, column));

    column = getBestMove(board, ai);


    dropDisc(board, column, ai);

    checkEndGame(board, ai);

    togglePlayer();

    printBoard(board);

    updateBoard(board);

}

const humanMove = (e) => {

    let el = e.currentTarget;

    let column = Array.from(el.parentNode.children).indexOf(el) % 7;

    if (gameOver || !validMove(board, column)) return;

    dropDisc(board, column, human);

    checkEndGame(board, human);

    togglePlayer();

    printBoard(board);

    updateBoard(board);

    if (!gameOver) {

        setTimeout(aiMove, 300);
        
    }
}

const updateBoard = (board) => {

    document.querySelectorAll(".cell").forEach((cell, index) => {

        let reversedBoard = [...board].reverse();

        if ((reversedBoard[Math.floor(index / 7)][index % 7]) == human) cell.classList.add("yellow");
        
        if ((reversedBoard[Math.floor(index / 7)][index % 7]) == ai) cell.classList.add("red");

    });

}

const resetBoard = () => {
    board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));

}


const validMove = (board, column) => {

	return board[numberOfRows - 1][column] == 0;
}

const freeRaw = (board, column) => {

    for (let r = 0; r < numberOfRows; r++)  {

        if (board[r][column] == 0) return r;
    }
}

const printBoard = (board) => {

    console.log([...board].reverse());

}

const horizontalWin = (board, color) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 0; r < numberOfRows; r++) {
            if (board[r][c] == color && board[r][c + 1] == color &&
                board[r][c + 2] == color && board[r][c + 3] == color) return true;
        }
    }
}

const verticalWin = (board, color) => {

    for (let c = 0; c < numberOfColumns; c++) {
        for (let r = 0; r < numberOfRows - 3; r++) {
            if (board[r][c] == color && board[r + 1][c] == color &&
                board[r + 2][c] == color && board[r + 3][c] == color) return true;
        }
    }
}

const diagonalPositiveWin = (board, color) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 0; r < numberOfRows - 3; r++) {
            if (board[r][c] == color && board[r + 1][c + 1] == color && 
                board[r + 2][c + 2] == color && board[r + 3][c + 3] == color) return true;
        }
    }
}

const diagonalNegativeWin = (board, color) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 3; r < numberOfRows; r++) {
            if (board[r][c] == color && board[r - 1][c + 1] == color &&
                board[r - 2][c + 2] == color && board[r - 3][c + 3] == color) return true;
        }
    }
}

const win = (board, color) => {

    return horizontalWin(board, color) || verticalWin(board, color) || 
    diagonalPositiveWin(board, color) || diagonalNegativeWin(board, color);
}

const horizontalEval = (board, color) => {

    let fullRow;
    let adjacent4;
    let scoreHorizontal = 0;

    let length4 = 4;

    for (let r = 0; r < numberOfRows; r++) {

        fullRow = board[r];

        for (let c = 0; c < numberOfColumns - 3; c++) {

            adjacent4 = fullRow.slice(c, c + length4);

            if (adjacent4.count(color) == 4) {

                scoreHorizontal += 100;

            } else if (adjacent4.count(color) == 3 && adjacent4.count(empty) == 1) {

                scoreHorizontal += 10;
            }
        }

    }

    console.log(scoreHorizontal);

    return scoreHorizontal;

} 

const evaluatePosition = (board, color) => {

    let score = 0;

    score += horizontalEval(board, color);

    return score;
}

const getValidMoves = (board) => {

    let validMoves = [];

    for (let c = 0; c < numberOfColumns; c++) {

        if (validMove(board, c)) validMoves.push(c);

    }

    return validMoves;
}

const getBestMove = (board, color) => {

    let tempBoard;
    let score;

    let validMoves = getValidMoves(board);

    let bestScore = 0;

    let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];

    for (column in validMoves) {

        tempBoard = board.copy();

        dropDisc(tempBoard, column, color);

        score = evaluatePosition(tempBoard, color);

        if (score > bestScore) {
            bestScore = score;
            bestColumn = column;
        }
    }

    return bestColumn;

}

const randomFirst = () => {

    player = (Math.random() < 0.5) ? human : ai;

    if (player == ai) aiMove();

}

const init = () => {

    disableTouchMove();
    resetBoard();
    setEvents();

    randomFirst();

}

window.onload = () => {
    document.fonts.ready.then(() => {
        init(); 
    });
}