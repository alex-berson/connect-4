let board = [];
const numberOfRows = 6;
const numberOfColumns = 7;


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
            peg.addEventListener("touchstart", dropPiece);
        } else {
            peg.addEventListener("mousedown", dropPiece);
        }
    }
}

const dropPiece = (e) => {

    let el = e.currentTarget;

    let column = Array.from(el.parentNode.children).indexOf(el) % 7;

    if (typeof dropPiece.player == 'undefined') {
        dropPiece.player = 1;
    }

    if (typeof dropPiece.gameOver == 'undefined') {
        dropPiece.gameOver = false;
    }

    if (validMove(column) && !dropPiece.gameOver) {
        
        placePiece(freeRaw(column), column, dropPiece.player);

        if (win(dropPiece.player)) dropPiece.gameOver = true;

        dropPiece.player = 3 - dropPiece.player;


    }

    printBoard();

    updateBoard();

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


const init = () => {

    disableTouchMove();
    resetBoard();
    setEvents();

}


window.onload = () => {
    document.fonts.ready.then(() => {
        init(); 
    });
}