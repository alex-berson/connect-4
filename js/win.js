const horizontalWin = (board, color) => {

    for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols - 3; c++) {
            if (board[r][c] == color && 
                board[r][c + 1] == color &&
                board[r][c + 2] == color &&
                board[r][c + 3] == color) {
                    return [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]];
            }
        }
    }

    return null;
}

const verticalWin = (board, color) => {

    for (let c = 0; c < nCols; c++) {
        for (let r = 0; r < nRows - 3; r++) {
            if (board[r][c] == color &&
                board[r + 1][c] == color &&
                board[r + 2][c] == color &&
                board[r + 3][c] == color) {
                    return [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]];
            }
        }
    }

    return null;
}

const diagonalPosWin = (board, color) => {

    for (let r = 0; r < nRows - 3; r++) {
        for (let c = 0; c < nCols - 3; c++) {
            if (board[r][c] == color &&
                board[r + 1][c + 1] == color &&
                board[r + 2][c + 2] == color &&
                board[r + 3][c + 3] == color) {
                    return [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]];
            }
        }
    }

    return null;
} 

const diagonalNegWin = (board, color) => {

    for (let r = 0; r < nRows - 3; r++) {
        for (let c = 0; c < nCols - 3; c++) {
            if (board[r + 3][c] == color &&
                board[r + 2][c + 1] == color &&
                board[r + 1][c + 2] == color &&
                board[r][c + 3] == color) {
                    return [[r + 3, c], [r + 2, c + 1], [r + 1, c + 2], [r, c + 3]];
            }
        }
    }

    return null;
} 

const win = (board, color) => horizontalWin(board, color) ||
                              verticalWin(board, color) ||
                              diagonalPosWin(board, color) ||
                              diagonalNegWin(board, color);