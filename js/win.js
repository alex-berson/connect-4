const horizontalWin = (board, color) => {

    for (let r = 0; r < numberOfRows; r++) {
        for (let c = 0; c < numberOfColumns - 3; c++) {
            if (board[r][c] == color && board[r][c + 1] == color && board[r][c + 2] == color && board[r][c + 3] == color) {
                return [cellNumber(r,c), cellNumber(r,c + 1), cellNumber(r,c + 2), cellNumber(r,c + 3)];
            }
        }
    }
}

const verticalWin = (board, color) => {

    for (let c = 0; c < numberOfColumns; c++) {
        for (let r = 0; r < numberOfRows - 3; r++) {
            if (board[r][c] == color && board[r + 1][c] == color && board[r + 2][c] == color && board[r + 3][c] == color) {
                return [cellNumber(r,c), cellNumber(r + 1,c), cellNumber(r + 2,c), cellNumber(r + 3,c)];
            }
        }
    }
}

// const diagonalWin = (board, color) => {

//     for (let r = 0; r < numberOfRows - 3; r++) {
//         for (let c = 0; c < numberOfColumns - 3; c++) {
//             if (board[r][c] == color && board[r + 1][c + 1] == color && board[r + 2][c + 2] == color && board[r + 3][c + 3] == color) {
//                 return [cellNumber(r,c), cellNumber(r + 1,c + 1), cellNumber(r + 2,c + 2), cellNumber(r + 3,c + 3)];
//             }
//             if (board[r + 3][c] == color && board[r + 2][c + 1] == color && board[r + 1][c + 2] == color && board[r][c + 3] == color) {
//                 return [cellNumber(r + 3,c), cellNumber(r + 2,c + 1), cellNumber(r + 1,c + 2), cellNumber(r,c + 3)];
//             }
//         }
//     }
// } 

const diagonalPositiveWin = (board, color) => {

    for (let r = 0; r < numberOfRows - 3; r++) {
        for (let c = 0; c < numberOfColumns - 3; c++) {
            if (board[r][c] == color && board[r + 1][c + 1] == color && board[r + 2][c + 2] == color && board[r + 3][c + 3] == color) {
                return [cellNumber(r,c), cellNumber(r + 1,c + 1), cellNumber(r + 2,c + 2), cellNumber(r + 3,c + 3)];
            }
        }
    }
} 

const diagonalNegativeWin = (board, color) => {

    for (let r = 0; r < numberOfRows - 3; r++) {
        for (let c = 0; c < numberOfColumns - 3; c++) {
            if (board[r + 3][c] == color && board[r + 2][c + 1] == color && board[r + 1][c + 2] == color && board[r][c + 3] == color) {
                return [cellNumber(r + 3,c), cellNumber(r + 2,c + 1), cellNumber(r + 1,c + 2), cellNumber(r,c + 3)];
            }
        }
    }
} 

const win = (board, color) => {
    // return horizontalWin(board, color) || verticalWin(board, color) || diagonalWin(board, color);

    return horizontalWin(board, color) || verticalWin(board, color) || diagonalPositiveWin(board, color) || diagonalNegativeWin(board, color);

}