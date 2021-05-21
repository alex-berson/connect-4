const adjacent4Eval = (board, adjacent4, color) => {

    let score = 0;
    let reversedColor = color == ai ? human : ai;

    if (adjacent4.count(color) == 4) {
        score += 100 * (freeCells(board) + 1);
    } else if (adjacent4.count(color) == 3 && adjacent4.count(empty) == 1) {

        // score += 10;

        score += 5;
    } else if (adjacent4.count(color) == 2 && adjacent4.count(empty) == 2) {

        // score += 5;
        score += 2;
    }

    if (adjacent4.count(reversedColor) == 4) {

        // score -= 80;
        score -= 100 * (freeCells(board) + 1);
    } 

    if (adjacent4.count(reversedColor) == 3 && adjacent4.count(empty) == 1) {

        // score -= 80;
        score -= 4;
    } 

    return score;
}

const centralColumnEval = (board, color) => {

    let score = 0;
    let centralColumn = board.column(3);

    // score = centralColumn.count(color) * 6;

    score = centralColumn.count(color) * 3;

    return score;
}

const horizontalEval = (board, color) => {

    let score = 0;
    let fullRow = [];
    let adjacent4 = [];

    for (let r = 0; r < numberOfRows; r++) {

        fullRow = board.row(r);

        for (let c = 0; c < numberOfColumns - 3; c++) {

            adjacent4 = fullRow.slice(c, c + 4);
            score += adjacent4Eval(board, adjacent4, color);
        }
    }

    return score;
} 

const verticalEval = (board, color) => {

    let score = 0;
    let fullColumn = [];
    let adjacent4 = [];

    for (let c = 0; c < numberOfColumns; c++) {

        fullColumn = board.column(c);

        for (let r = 0; r < numberOfRows - 3; r++) {

            adjacent4 = fullColumn.slice(r, r + 4);
            score += adjacent4Eval(board, adjacent4, color);
        }
    }  
    return score;
}

const diagonalPositiveEval = (board, color) => {

    let score = 0;
    let adjacent4 = [];

    for (let r = 0; r < numberOfRows - 3; r++) {
        for (let c = 0; c < numberOfColumns - 3; c++) {

            adjacent4 = [];

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
    let adjacent4 = [];

    for (let r = 0; r < numberOfRows - 3; r++) {
        for (let c = 0; c < numberOfColumns - 3; c++) {

            adjacent4 = [];

            for (let i = 0; i < 4; i++) {

                adjacent4.push(board[r + 3 - i][c + i]);
            }
            score += adjacent4Eval(board, adjacent4, color);
        }
    }
    return score;
} 

const bottomFork = (board, color) =>{

    let score = 0;
    let adjacent5 = [];
    let fullRow = board.row(0);
    color = color == ai ? human : ai;

    for (let c = 0; c < 3; c++){

        adjacent5 = fullRow.slice(c, c + 5);

        if ((adjacent5[1] == color && adjacent5[3] == color || adjacent5[1] == color && adjacent5[2] || adjacent5[2] == color && adjacent5[3]) && adjacent5.count(empty) == 3) {

            score -= 50;
            break;
        }
    }
    return 0;
}

const evaluation = (board, color) => {

    let score = 0;
    score = centralColumnEval(board, color) + horizontalEval(board, color) + verticalEval(board, color) + diagonalPositiveEval(board, color) + diagonalNegativeEval(board, color) + bottomFork(board, color);

    return score;
}

const evalMatrix = (board, color) => {

    let score = 138;
    let reversedColor = color == ai ? human : ai;

    const matrix = [
        [3, 4, 5, 7, 5, 4, 3], 
        [4, 6, 8, 10, 8, 6, 4],
        [5, 8, 11, 13, 11, 8, 5], 
        [5, 8, 11, 13, 11, 8, 5],
        [4, 6, 8, 10, 8, 6, 4],
        [3, 4, 5, 7, 5, 4, 3]
    ]

    for (let r = 0; r < numberOfRows; r++) {
        for (let c = 0; c < numberOfColumns; c++) {
            if (board[r][c] == color) score += matrix[r][c];
            if (board[r][c] == reversedColor) score -= matrix[r][c];
        }
    }
    return score;
}