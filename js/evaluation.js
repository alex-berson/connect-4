const adjacent4Eval = (board, adjacent4, color) => {

    let score = 0;
    let [occurrencesColor, occurrencesReversedColor, occurrencesEmpty] = occurrences(adjacent4, color);

    if (occurrencesColor == 4) {
        score += 100 * (freeCells(board) + 1);
    } else if (occurrencesColor == 3 && occurrencesEmpty == 1) {
        score += 5;
    } else if (occurrencesColor == 2 && occurrencesEmpty == 2) {
        score += 2;
    }

    if (occurrencesReversedColor == 4) {
        score -= 100 * (freeCells(board) + 1);
    } else if (occurrencesReversedColor == 3 && occurrencesEmpty == 1) {
        score -= 4;
    } 

    return score;
}

const centralColumnEval = (board, color) => {

    let score = 0;
    let centralColumn = board.map(row => row[3]);

    score = occurrences(centralColumn, color)[0] * 3;

    return score;
}

const horizontalEval = (board, color) => {

    let score = 0;
    let adjacent4 = [];

    for (let r = 0; r < numberOfRows; r++) {
        for (let c = 0; c < numberOfColumns - 3; c++) {

            adjacent4 = [];

            for (let i = 0; i < 4; i++) {
                adjacent4.push(board[r][c + i]);
            }

            score += adjacent4Eval(board, adjacent4, color);
        }
    }

    return score;
} 

const verticalEval = (board, color) => {

    let score = 0;
    let adjacent4 = [];

    for (let c = 0; c < numberOfColumns; c++) {
        for (let r = 0; r < numberOfRows - 3; r++) {

            adjacent4 = [];

            for (let i = 0; i < 4; i++) {
                adjacent4.push(board[r + i][c]);
            }

            score += adjacent4Eval(board, adjacent4, color);
        }
    }  

    return score;
}

// const diagonalEval = (board, color) => {

//     let score = 0;

//     for (let r = 0; r < numberOfRows - 3; r++) {
//         for (let c = 0; c < numberOfColumns - 3; c++) {

//             let adjacentPlus = [];
//             let adjacentMinus = [];

//             for (let i = 0; i < 4; i++) {
//                 adjacentPlus.push(board[r + i][c + i]);
//                 adjacentMinus.push(board[r + 3 - i][c + i]);
//             }

//             score += adjacent4Eval(board, adjacentPlus, color);
//             score += adjacent4Eval(board, adjacentMinus, color);
//         }
//     }

//     return score;
// } 

const diagonalPositiveEval = (board, color) => {

    let score = 0;

    for (let r = 0; r < numberOfRows - 3; r++) {
        for (let c = 0; c < numberOfColumns - 3; c++) {

            let adjacent4 = [];

            for (let i = 0; i < 4; i++) {
                adjacent4.push(board[r + i][c + i]);
            }

            score += adjacent4Eval(board, adjacent4, color);
        }
    }

    return score;
}

const diagonalNegativeEval = (board, color) => {

    let score = 0;

    for (let r = 0; r < numberOfRows - 3; r++) {
        for (let c = 0; c < numberOfColumns - 3; c++) {

            let adjacent4 = [];

            for (let i = 0; i < 4; i++) {
                adjacent4.push(board[r + 3 - i][c + i]);
            }

            score += adjacent4Eval(board, adjacent4, color);
        }
    }

    return score;
}

const evaluation = (board, color) => {

    let score = 0;
    // score = centralColumnEval(board, color) + horizontalEval(board, color) + verticalEval(board, color) + diagonalEval(board, color);

    score = centralColumnEval(board, color) + horizontalEval(board, color) + verticalEval(board, color) + diagonalPositiveEval(board, color) + diagonalNegativeEval(board, color);

    return score;
}

const matrixEval = (board, color) => {

    let score = 138;
    let reversedColor = color == ai ? human : ai;

    const matrix = [[3, 4, 5, 7, 5, 4, 3], 
                    [4, 6, 8, 10, 8, 6, 4],
                    [5, 8, 11, 13, 11, 8, 5], 
                    [5, 8, 11, 13, 11, 8, 5],
                    [4, 6, 8, 10, 8, 6, 4],
                    [3, 4, 5, 7, 5, 4, 3]]

    for (let r = 0; r < numberOfRows; r++) {
        for (let c = 0; c < numberOfColumns; c++) {
            if (board[r][c] == color) score += matrix[r][c];
            if (board[r][c] == reversedColor) score -= matrix[r][c];
        }
    }

    return score;
}