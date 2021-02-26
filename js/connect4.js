let board = [];

let  moovingInterval; //

let first; //


const numberOfRows = 6;
const numberOfColumns = 7;

const empty = 0
const human = 1;
const ai = 2;

let gameOver = false;

let player;

const disableTouchMove = () => {

    const preventDefault = (e) => e.preventDefault();
    document.body.addEventListener('touchmove', preventDefault, { passive: false });

}

const freeCells = (board) => {

    return board.flat().count(empty);
}

const occupiedCells = (board) => {

    return numberOfRows * numberOfColumns - board.flat().count(empty);
}

const touchScreen = () => {
    return matchMedia('(hover: none)').matches;
}

const setEvents = () => {
    for (let cell of document.querySelectorAll('.cell')){
        if (touchScreen()){
            cell.addEventListener("touchstart", humanMove);
        } else {
            cell.addEventListener("mousedown", humanMove);
        }
    }
}

const boardFull = (board) => {
    for (let c = 0; c < numberOfColumns; c++) {
        if (board[numberOfRows - 1][c] == 0) return false;
    }

    return true;
}

const togglePlayer = () =>  player = player == ai ? human : ai;

const checkEndGame = (board, color) =>  {
    if (win(board, color) || boardFull(board)) {
        
        gameOver = true;

        clearInterval(moovingInterval); //


    }
}

const dropDisc = (board, column, color) => {

    board[freeRaw(board, column)][column] = color;

}

const aiMove = () => {

    let startTime = new Date(); //

    let column;

    // let opponent = player == ai ? human : ai;

    // if (player == first) {

        [column, _] = minimax(board, 10, -Infinity, Infinity, true);

    // } else {

    //     [column, _] = negamax(board, 10, -Infinity, Infinity, 1);

    // }



    let endTime = new Date(); //

    console.log((endTime - startTime) / 1000); //

    console.log(column);




    dropDisc(board, column, player);

    checkEndGame(board, player);

    togglePlayer();

    updateBoard(board);


}

const humanMove = (e) => {

    let el = e.currentTarget;

    let column = Array.from(el.parentNode.children).indexOf(el) % 7;

    if (gameOver || !validMove(board, column)) return;

    dropDisc(board, column, player);

    checkEndGame(board, player);

    togglePlayer();

    // printBoard(board);

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
            if (board[r][c] == color && board[r][c + 1] == color && board[r][c + 2] == color && board[r][c + 3] == color) return true;
        }
    }
}

const verticalWin = (board, color) => {

    for (let c = 0; c < numberOfColumns; c++) {
        for (let r = 0; r < numberOfRows - 3; r++) {
            if (board[r][c] == color && board[r + 1][c] == color && board[r + 2][c] == color && board[r + 3][c] == color) return true;
        }
    }
}

const diagonalPositiveWin = (board, color) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 0; r < numberOfRows - 3; r++) {
            if (board[r][c] == color && board[r + 1][c + 1] == color && board[r + 2][c + 2] == color && board[r + 3][c + 3] == color) return true;
        }
    }
}

const diagonalNegativeWin = (board, color) => {

    for (let c = 0; c < numberOfColumns - 3; c++) {
        for (let r = 3; r < numberOfRows; r++) {
            if (board[r][c] == color && board[r - 1][c + 1] == color && board[r - 2][c + 2] == color && board[r - 3][c + 3] == color) return true;
        }
    }
}

const win = (board, color) => {

    return horizontalWin(board, color) || verticalWin(board, color) || diagonalPositiveWin(board, color) || diagonalNegativeWin(board, color);
}

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

const evaluatePosition = (board, color) => {

    let score = 0;

    score = centralColumnEval(board, color) + horizontalEval(board, color) + verticalEval(board, color) + diagonalPositiveEval(board, color) + diagonalNegativeEval(board, color) + bottomFork(board, color);

    return score;
}

const getValidMoves = (board) => {

    let validMoves = [];

    for (let c = 0; c < numberOfColumns; c++) {

        if (validMove(board, c)) validMoves.push(c);

    }

    validMoves = validMoves.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);

    return validMoves;
}

const terminalNode = (board) => {

	return win(board, human) || win(board, ai) || boardFull(board);
}



function minimax(board, depth, alpha, beta, maximizingPlayer) {


    // console.log("minimax", depth);

    let tempBoard;
    let bestScore;
    let validMoves = getValidMoves(board);

    let  opponent = player == ai ? human : ai;


    let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];


    // if (win(board, player)) return [null, 100 * (freeCells(board) + 1)];

    // if (win(board, opponent)) return [null, -100 * (freeCells(board) + 1)];

    // if (boardFull(board)) return [null, 0];

    if (depth == 0 || terminalNode(board)) return [null,  evaluatePosition(board, player)];

    if (maximizingPlayer) {
        
        bestScore = -Infinity;
        
        for (let column of validMoves) {

            tempBoard = board.copy();
    
            dropDisc(tempBoard, column, player);
    
            [_, score] = minimax(tempBoard, depth - 1, alpha, beta, false);
    
            if (score > bestScore) {

                [bestScore, bestColumn] = [score, column];
            }

            alpha = Math.max(alpha, score);

            if (alpha >= beta) break;

        }

        // console.log(bestColumn, bestScore)

        return [bestColumn, bestScore];


    } else {

        bestScore = Infinity;
        
        for (let column of validMoves) {

            tempBoard = board.copy();
    
            dropDisc(tempBoard, column, opponent);
    
            [_, score] = minimax(tempBoard, depth - 1, alpha, beta, true);
    
            if (score < bestScore) {

                [bestScore, bestColumn] = [score, column];
            }

            beta = Math.min(beta, score);

            if (beta <= alpha) break;
        }

        // console.log(bestColumn, bestScore)

        return [bestColumn, bestScore];

    }

}

function negamax(board, depth, alpha, beta, color) {

    let tempBoard;
    let bestScore;
    let validMoves = getValidMoves(board);

    let opponent = player == ai ? human : ai;

    let currentPlayer = color == 1 ? player : opponent;

    let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];


    if (depth == 0 || terminalNode(board)) return [null,  color * evaluatePosition(board, player)];

        
    bestScore = -Infinity;
    
    for (let column of validMoves) {

        tempBoard = board.copy();

        dropDisc(tempBoard, column, currentPlayer);

        score = -negamax(tempBoard, depth - 1, -beta, -alpha, -color)[1];

        if (score > bestScore) {

            [bestScore, bestColumn] = [score, column];
        }

        alpha = Math.max(alpha, score);

        if (alpha >= beta) break;

    }

    // console.log(bestColumn, bestScore)

    return [bestColumn, bestScore];

}


const getBestMove = (board, color) => {

    let tempBoard;
    let tempBoard2;

    let score;

    let scoreArray = [0,0,0,0,0,0,0,] //

    let validMoves = getValidMoves(board);

    let bestScore = -Infinity;


    for (let column of validMoves) {

        tempBoard = board.copy();

        dropDisc(tempBoard, column, color);

        score = evaluatePosition(tempBoard, color);

        if (!win(tempBoard, color)) {

            let reversedColor = color == ai ? human : ai;

            let validMoves2 = getValidMoves(tempBoard);

            // console.log(validMoves);

            for (let column2 of validMoves2) {

                tempBoard2 = tempBoard.copy();

                dropDisc(tempBoard2, column2, reversedColor);

                if (win(tempBoard2, reversedColor)) score -= 50;

            }

        }

        scoreArray[column] = score; //

        if (score > bestScore) {

            [bestScore, bestColumn] = [score, column];

        }
    }

    // console.log(scoreArray); //

    return bestColumn;

}

const randomFirst = () => {

    player = (Math.random() < 0.5) ? human : ai;

    first = player; //


    moovingInterval = setInterval(aiMove, 50); //


    // if (player == ai) aiMove();




    // do {

    //     setTimeout(aiMove(), 300);

    //     updateBoard(board);


    // } while (!gameOver);

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