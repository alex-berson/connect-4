// const horizontalWin = (board, color) => {

//     for (let c = 0; c < numberOfColumns - 3; c++) {
//         for (let r = 0; r < numberOfRows; r++) {
//             if (board[r][c] == color && board[r][c + 1] == color && board[r][c + 2] == color && board[r][c + 3] == color) return true;
//         }
//     }
// }

// const verticalWin = (board, color) => {

//     for (let c = 0; c < numberOfColumns; c++) {
//         for (let r = 0; r < numberOfRows - 3; r++) {
//             if (board[r][c] == color && board[r + 1][c] == color && board[r + 2][c] == color && board[r + 3][c] == color) return true;
//         }
//     }
// }

// const diagonalPositiveWin = (board, color) => {

//     for (let c = 0; c < numberOfColumns - 3; c++) {
//         for (let r = 0; r < numberOfRows - 3; r++) {
//             if (board[r][c] == color && board[r + 1][c + 1] == color && board[r + 2][c + 2] == color && board[r + 3][c + 3] == color) return true;
//         }
//     }
// }

// const diagonalNegativeWin = (board, color) => {

//     for (let c = 0; c < numberOfColumns - 3; c++) {
//         for (let r = 3; r < numberOfRows; r++) {
//             if (board[r][c] == color && board[r - 1][c + 1] == color && board[r - 2][c + 2] == color && board[r - 3][c + 3] == color) return true;
//         }
//     }
// }

// const win = (board, color) => {
//     return horizontalWin(board, color) || verticalWin(board, color) || diagonalPositiveWin(board, color) || diagonalNegativeWin(board, color);
// }


const horizontalWin = (board, color) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 0; r < numberOfRows; r++) {
            if (board[r][c] == color && board[r][c + 1] == color && board[r][c + 2] == color && board[r][c + 3] == color) {
                return [cell(r,c), cell(r,c + 1), cell(r,c + 2), cell(r,c + 3)];
            }
        }
    }
}

const verticalWin = (board, color) => {

    for (let c = 0; c < numberOfColumns; c++) {
        for (let r = 0; r < numberOfRows - 3; r++) {
            if (board[r][c] == color && board[r + 1][c] == color && board[r + 2][c] == color && board[r + 3][c] == color) {
                return [cell(r,c), cell(r + 1,c), cell(r + 2,c), cell(r + 3,c)];
            }
        }
    }
}

const diagonalPositiveWin = (board, color) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 0; r < numberOfRows - 3; r++) {
            if (board[r][c] == color && board[r + 1][c + 1] == color && board[r + 2][c + 2] == color && board[r + 3][c + 3] == color) {
                return [cell(r,c), cell(r + 1,c + 1), cell(r + 2,c + 2), cell(r + 3,c + 3)];
            }
        }
    }
}

const diagonalNegativeWin = (board, color) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 3; r < numberOfRows; r++) {
            if (board[r][c] == color && board[r - 1][c + 1] == color && board[r - 2][c + 2] == color && board[r - 3][c + 3] == color) {
                return [cell(r,c), cell(r - 1,c + 1), cell(r - 2,c + 2), cell(r - 3,c + 3)];
            }
        }
    }
}

const win = (board, color) => {
    return horizontalWin(board, color) || verticalWin(board, color) || diagonalPositiveWin(board, color) || diagonalNegativeWin(board, color);
}