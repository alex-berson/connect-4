const nDiscs = (cells, color) => {

    let nEmpty = 0;
    let nColor = 0;
    let nOpponent = 0;
    let opponent = color == ai ? human : ai;

    for (let i = 0; i < cells.length; i++) {

        switch (cells[i]) {
            case color:
                nColor++;
                break;
            case opponent:
                nOpponent++;
                break;
            case empty:
                nEmpty++;
                break;
        }
    }

    return [nColor, nOpponent, nEmpty];
}

const adjacent4Eval = (board, adjacent4, color) => {

    let score = 0;
    let [nColor, nOpponent, nEmpty] = nDiscs(adjacent4, color);

    if (nColor == 4) {
        score += 100 * (nFreeCells(board) + 1);
    } else if (nColor == 3 && nEmpty == 1) {
        score += 5;
    } else if (nColor == 2 && nEmpty == 2) {
        score += 2;
    }

    if (nOpponent == 4) {
        score -= 100 * (nFreeCells(board) + 1);
    } else if (nOpponent == 3 && nEmpty == 1) {
        score -= 4;
    } 

    return score;
}

const centralColumnEval = (board, color) => {

    let score = 0;
    let centralColumn = board.map(row => row[3]);

    score = nDiscs(centralColumn, color)[0] * 3;

    return score;
}

const horizontalEval = (board, color) => {

    let score = 0;

    for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols - 3; c++) {

            let adjacent4 = [];

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

    for (let c = 0; c < nCols; c++) {
        for (let r = 0; r < nRows - 3; r++) {

            let adjacent4 = [];

            for (let i = 0; i < 4; i++) {
                adjacent4.push(board[r + i][c]);
            }

            score += adjacent4Eval(board, adjacent4, color);
        }
    }  

    return score;
}

const diagonalPosEval = (board, color) => {

    let score = 0;

    for (let r = 0; r < nRows - 3; r++) {
        for (let c = 0; c < nCols - 3; c++) {

            let adjacent4 = [];

            for (let i = 0; i < 4; i++) {
                adjacent4.push(board[r + i][c + i]);
            }

            score += adjacent4Eval(board, adjacent4, color);
        }
    }

    return score;
}

const diagonalNegEval = (board, color) => {

    let score = 0;

    for (let r = 0; r < nRows - 3; r++) {
        for (let c = 0; c < nCols - 3; c++) {

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
    
    let score = centralColumnEval(board, color) +
                horizontalEval(board, color) +
                verticalEval(board, color) + 
                diagonalPosEval(board, color) +
                diagonalNegEval(board, color);

    return score;
}