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
    
    score = centralColumnEval(board, color) + horizontalEval(board, color) + verticalEval(board, color) + diagonalPositiveEval(board, color) + diagonalNegativeEval(board, color);

    return score;
}