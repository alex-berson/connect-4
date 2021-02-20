let board = [];

const numberOfRows = 6;
const numberOfColumns = 7;

const human = 1;
const ai = 2;

let gameOver = false;

let player;


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

const boardFull = () => {
    for (let c = 0; c < numberOfColumns; c++) {
        if (board[numberOfRows - 1][c] == 0) return false;
    }

    return true;
}

const togglePlayer = () => player = 3 - player;

const dropPiece = (column) => {

    if (validMove(column)) {
        
        placePiece(freeRaw(column), column, player);

        if (win(player) || boardFull()) gameOver = true;

        togglePlayer();

    }
}

const aiMove = () => {

    let column;

    do{

        column = Math.floor(Math.random() * Math.floor(numberOfColumns));

    } while (!validMove(column));

    dropPiece(column);

    printBoard();

    updateBoard();

}

const humanMove = (e) => {

    if (gameOver) return;

    let el = e.currentTarget;

    let column = Array.from(el.parentNode.children).indexOf(el) % 7;

    dropPiece(column);

    printBoard();

    updateBoard();

    if (!gameOver) {

        setTimeout(aiMove, 300);
        
    }
}

const updateBoard = () => {

    document.querySelectorAll(".cell").forEach((cell, index) => {

        let reversedBoard = [...board].reverse();

        if ((reversedBoard[Math.floor(index / 7)][index % 7]) == 1) cell.classList.add("yellow");
        
        if ((reversedBoard[Math.floor(index / 7)][index % 7]) == 2) cell.classList.add("red");

    });

}

const resetBoard = () => {
    board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));

}

const placePiece = (row, column, piece) => {

	board[row][column] = piece;
}

const validMove = (column) => {

	return board[numberOfRows - 1][column] == 0;
}

const freeRaw = (column) => {

    for (let r = 0; r < numberOfRows; r++)  {

        if (board[r][column] == 0) return r;
    }
}

const printBoard = () => {

    console.log([...board].reverse());

}

const horizontalWin = (piece) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 0; r < numberOfRows; r++) {
            if (board[r][c] == piece && board[r][c + 1] == piece && board[r][c + 2] == piece && board[r][c + 3] == piece) return true;
        }
    }
}

const verticalWin = (piece) => {

    for (let c = 0; c < numberOfColumns; c++) {
        for (let r = 0; r < numberOfRows - 3; r++) {
            if (board[r][c] == piece && board[r + 1][c] == piece && board[r + 2][c] == piece && board[r + 3][c] == piece) return true;
        }
    }
}

const diagonalPositiveWin = (piece) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 0; r < numberOfRows - 3; r++) {
            if (board[r][c] == piece && board[r + 1][c + 1] == piece && board[r + 2][c + 2] == piece && board[r + 3][c + 3] == piece) return true;
        }
    }
}

const diagonalNegativeWin = (piece) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 3; r < numberOfRows; r++) {
            if (board[r][c] == piece && board[r - 1][c + 1] == piece && board[r - 2][c + 2] == piece && board[r - 3][c + 3] == piece) return true;
        }
    }
}

const win = (piece) => {

    return horizontalWin(piece) || verticalWin(piece) || diagonalPositiveWin(piece) || diagonalNegativeWin(piece);
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