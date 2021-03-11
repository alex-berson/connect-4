let board = [];
let moovingInterval;
let gameOver = false;
let depth = 1;

// let moveDone = true;

const numberOfRows = 6;
const numberOfColumns = 7;
const timeLimit = 500;
const depthLimit = 7;  //
const empty = 0
const human = 1;
const ai = 2;
const durations = [0.15, 0.28, 0.38, 0.46, 0.54, 0.61];

let firstPlayer = player = human;

// let firstMove = human;


const boardSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size'));

if (window.innerHeight > window.innerWidth) {
    document.documentElement.style.setProperty('--board-size', Math.ceil(window.outerWidth * boardSize / 7) * 7 + 'px');
} else {
    document.documentElement.style.setProperty('--board-size', Math.ceil(window.outerHeight * boardSize / 7) * 7 + 'px');
}

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



const enableTouch = () => {
    for (let cell of document.querySelectorAll('.cell')){
        if (touchScreen()){
            cell.addEventListener("touchstart", humanMove);
        } else {
            cell.addEventListener("mousedown", humanMove);
        }
    }
}

const disableTouch = () => {
    for (let cell of document.querySelectorAll('.cell')){
        if (touchScreen()){
            cell.removeEventListener("touchstart", humanMove);
        } else {
            cell.removeEventListener("mousedown", humanMove);
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

        // clearInterval(moovingInterval); //

    }
}

const disableBoard = () => {

    // if (player == human) {
    //     document.querySelector("h1").classList.add("yellow-color");


    // } else {
    //     document.querySelector("h1").classList.add("red-color");

    // }

    let flatBorad = [...board].reverse().flat();


    document.querySelectorAll(".cell").forEach((cell, i) =>{


        if (flatBorad[i] == 0) cell.classList.add("blue");
        // if (flatBorad[i] == 1) cell.classList.add("yellow");
        // if (flatBorad[i] == 2) cell.classList.add("red");



    });
}

const timeOut = (startTime) => {

    return new Date() - startTime >= timeLimit;
} 

const dropDisc = (board, column, color) => {

    try {
        board[freeRaw(board, column)][column] = color;

    } catch(e) {
        console.log("error");

        console.log(column);
    }

}

const aiMove = async() => {

    let initialColumnes = [];

    // let depth = 2;

    let scores, column, score;

    let validMoves;  //

    let lastScores, lastColumn, lastScore;

    let row;

    let startTime = new Date();


    // let startTime = new Date(Date.now() + delay);



    depth = Math.max(Math.min(depth - 2, freeCells(board) - 2), 1);

    // depth = Math.max(depth, 1);



    // console.log(depth);


    if (freeCells(board) != numberOfColumns * numberOfRows) {
        
        do{

            [scores, column, score] = minimax(board, depth, -Infinity, Infinity, true, startTime, initialColumnes);

            // scores = scores.filter(item => item);

            if (new Date() - startTime >= timeLimit) console.log("timeout");

            if (timeOut(startTime)) {

                [scores, column, score] = [lastScores, lastColumn, lastScore]

                depth--;

                break;

            } else {

                [lastScores, lastColumn, lastScore] = [scores, column, score]

                // initialColumnes = [...new Set([...[column], ...initialColumnes])];

            }

            depth++


        } while(depth < freeCells(board));



        console.log("depth: " , depth);

        // depth -= 2;

        // depth = Math.max(depth - 2, 1);


        await new Promise(r => setTimeout(r, timeLimit - (new Date() - startTime)));


    } else {

    //         [scores, column, score] = negamax(board, 7, -Infinity, Infinity, 1);

        column = 3;

    }


    // console.log("column: ", column);

    // console.log("columnes: ", initialColumnes);


    // console.log("score: ", score );
    // console.log("scores: ", scores );



    // if (!scores.some(x => x > 0) && !scores.every(x => x < 0)) {

    //     validMoves = scores.map((x, i) => x == 0 && x != "empty" ? i : null).filter(x => x != null);

    //     column = evristik(board, player, validMoves);

    //     console.log("evristik: ", column);


    // }


    row = freeRaw(board, column);

    if (player == ai) {

        console.log("%c time: ", 'color: #ff0000', (new Date() - startTime) / 1000); //

    } else {

        console.log("%c time: ", 'color: #ffa500', (new Date() - startTime) / 1000); //

    }


    // updateBoard(board, freeRaw(board, column), column, player);



    // setTimeout(enableTouch, Math.min([...durations].reverse()[freeRaw(board, column)] * 1000, 300));

    // setTimeout(enableTouch, 150);


    // console.log([...durations].reverse()[freeRaw(board, column)] * 1000);

    dropDisc(board, column, player);

    checkEndGame(board, player);

    updateBoard(board, row, column, player);


    if (gameOver) {
        disableBoard();
        setTimeout(enableTouch, 1000);

    } else {
        setTimeout(enableTouch, Math.min([...durations].reverse()[row] * 1000, 300));
        togglePlayer();

    }
   
    // requestAnimationFrame(() => {
    //     requestAnimationFrame(() => {

            // enableTouch();
    //     });
    // });


}

const humanMove = (e) => {

    console.log("human");

    let el = e.currentTarget;

    let delay;

    let row;

    let column = Array.from(el.parentNode.children).indexOf(el) % 7;


    if (gameOver) {
        resetGame();
        return;
    }

    if (!validMove(board, column)) return;

    // moveDone = false;

    disableTouch();

    row = freeRaw(board, column);

    delay = [...durations].reverse()[row * 1000];

    dropDisc(board, column, player);

    checkEndGame(board, player);

    updateBoard(board, row, column, player);

    if (gameOver){

        disableBoard();

        setTimeout(enableTouch, 1000);


    } else {

        togglePlayer();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {

                aiMove(delay);
            });
        });  
    }

    // togglePlayer();

    // if (!gameOver) {

    //     requestAnimationFrame(() => {
    //         requestAnimationFrame(() => {

    //             aiMove(delay);
    //         });
    //     });        
    // }
}

// const updateBoard = (board) => {

//     document.querySelectorAll(".cell").forEach((cell, index) => {

//         let reversedBoard = [...board].reverse();

//         if ((reversedBoard[Math.floor(index / 7)][index % 7]) == human) cell.classList.add("yellow-hole");
        
//         if ((reversedBoard[Math.floor(index / 7)][index % 7]) == ai) cell.classList.add("red-hole");

//     });

// }

const resetBoard = () => {
    board = Array.from(Array(numberOfRows), _ => Array(numberOfColumns).fill(0));



    // board = [[2,1,2,1,1,2,2],
    //         [1,2,1,2,1,1,1],
    //         [1,2,1,1,2,2,2,],
    //         [2,1,2,2,2,1,1],
    //         [2,2,1,1,1,2,2],
    //         [1,1,1,2,2,1,0]];


    // printBoard(board);

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



function minimax(board, depth, alpha, beta, maximizingPlayer, startTime, initialColumnes) {

    let scores = [];

    let tempBoard;
    let bestScore;
    let validMoves = getValidMoves(board);

    let opponent = player == ai ? human : ai;

    let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];

    if (depth == 0 || terminalNode(board)) return [null, null, evaluatePosition(board, player)];

    if (timeOut(startTime)) return [null, null, null];

    if (initialColumnes != null) validMoves = [...new Set([...initialColumnes, ...validMoves])];

    if (maximizingPlayer) {
        
        bestScore = -Infinity;
        
        for (let column of validMoves) {

            tempBoard = board.copy();
    
            dropDisc(tempBoard, column, player);
    
            [_, _, score] = minimax(tempBoard, depth - 1, alpha, beta, false, startTime, null);

            if (initialColumnes != null) scores[column] = score;
    
            if (score > bestScore) [bestScore, bestColumn] = [score, column];

            alpha = Math.max(alpha, score);

            if (alpha >= beta) break;
        }

        return [scores, bestColumn, bestScore];

    } else {

        bestScore = Infinity;
        
        for (let column of validMoves) {

            tempBoard = board.copy();
    
            dropDisc(tempBoard, column, opponent);
    
            [_, _, score] = minimax(tempBoard, depth - 1, alpha, beta, true, startTime, null);
    
            if (score < bestScore) [bestScore, bestColumn] = [score, column];

            beta = Math.min(beta, score);

            if (beta <= alpha) break;
        }

        return [scores, bestColumn, bestScore];

    }
}


// function minimax0(board, depth, alpha, beta, maximizingPlayer, startTime, initialColumnes) {

//     let scores = [];

//     let tempBoard;
//     let bestScore;
//     let validMoves = getValidMoves(board);

//     let opponent = player == ai ? human : ai;

//     let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];


//     if (win(board, player)) return [null, null, depth + 1];

//     if (win(board, opponent)) return [null, null, -(depth + 1)];

//     if (depth == 0 || boardFull(board)) return [null, null,  0];


//     if (timeOut(startTime)) return [null, null, null];

//     if (initialColumnes != null) validMoves = [...new Set([...initialColumnes, ...validMoves])];

//     if (maximizingPlayer) {
        
//         bestScore = -Infinity;
        
//         for (let column of validMoves) {

//             tempBoard = board.copy();
    
//             dropDisc(tempBoard, column, player);
    
//             [_, _, score] = minimax0(tempBoard, depth - 1, alpha, beta, false, startTime, null);

//             if (initialColumnes != null) scores[column] = score;
    
//             if (score > bestScore) [bestScore, bestColumn] = [score, column];

//             alpha = Math.max(alpha, score);

//             if (alpha >= beta) break;
//         }

//         return [scores, bestColumn, bestScore];

//     } else {

//         bestScore = Infinity;
        
//         for (let column of validMoves) {

//             tempBoard = board.copy();
    
//             dropDisc(tempBoard, column, opponent);
    
//             [_, _, score] = minimax0(tempBoard, depth - 1, alpha, beta, true, startTime, null);
    
//             if (score < bestScore) [bestScore, bestColumn] = [score, column];

//             beta = Math.min(beta, score);

//             if (beta <= alpha) break;
//         }

//         return [scores, bestColumn, bestScore];

//     }
// }


//     // if (win(board, player)) return [null, null, 100 * (freeCells(board) + 1)];

//     // if (win(board, opponent)) return [null, null, -100 * (freeCells(board) + 1)];

//     // if (boardFull(board)) return [null, 0];

//     if (win(board, player)) return [null, null, depth + 1];

//     if (win(board, opponent)) return [null, null, -(depth + 1)];

//     if (depth == 0 || boardFull(board)) return [null, null,  0];


//     // if (depth == 0 || terminalNode(board)) return [null, null,  evaluatePosition(board, player)];

//     // if (depth == 0 || terminalNode(board)) return [null, null,  0];




function negamax(board, depth, alpha, beta, color) {

    let tempBoard;
    let bestScore;
    let validMoves = getValidMoves(board);
    let scores = [];


    let opponent = player == ai ? human : ai;

    let currentPlayer = color == 1 ? player : opponent;

    let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];

    if (depth == 0 || terminalNode(board)) return [null, null,  color * evaluatePosition(board, player)];
 
    bestScore = -Infinity;
    
    for (let column of validMoves) {

        tempBoard = board.copy();

        dropDisc(tempBoard, column, currentPlayer);

        score = -negamax(tempBoard, depth - 1, -beta, -alpha, -color)[2];

        if (depth == depthLimit) scores[column] = score;

        if (score > bestScore) [bestScore, bestColumn] = [score, column];

        alpha = Math.max(alpha, score);

        if (alpha >= beta) break;

    }

    return [scores, bestColumn, bestScore];
}


const evristik = (board, color, validMoves) => {

    let tempBoard;
    let tempBoard2;

    let score;

    let scoreArray = [0,0,0,0,0,0,0,] //

    // let validMoves = getValidMoves(board);

    let bestScore = -Infinity;


    for (let column of validMoves) {

        tempBoard = board.copy();

        dropDisc(tempBoard, column, color);

        score = evaluatePosition(tempBoard, color);

        // if (!win(tempBoard, color)) {

        //     let reversedColor = color == ai ? human : ai;

        //     let validMoves2 = getValidMoves(tempBoard);

        //     for (let column2 of validMoves2) {

        //         tempBoard2 = tempBoard.copy();

        //         dropDisc(tempBoard2, column2, reversedColor);

        //         if (win(tempBoard2, reversedColor)) score -= 50;

        //     }
        // }

        scoreArray[column] = score; //

        if (score > bestScore) [bestScore, bestColumn] = [score, column];
    }

    return bestColumn;

}

// const setTransitionDisc = () => {
//     for (disc of document.querySelectorAll('.disc')){
//         disc.addEventListener('transitionend', stopMoving);
//     }
// }

// const stopMoving = (e) => {

//     // console.log("stopmoving");

//     // if (player == human) {
//     //     enableTouch();
//     // } else {
//     //     // aiMove();
//     // }

//     if (e.currentTarget.classList.contains("red")) enableTouch();

//     // if (e.currentTarget.classList.contains("yellow")) {
        
//     //     moveDone = true;
//     //     // startTime = new Date();

//     //     console.log("yellow stop")


//     // }


//     // console.log(e.currentTarget);


// }

// const randomFirst = () => {

//     player = (Math.random() < 0.5) ? human : ai;

//     // moovingInterval = setInterval(aiMove, 600); //

//     if (player == ai) {
//         aiMove();
//     } else {
//         enableTouch();
//     }

// }

// const updateBoard = (board, row = 1, column = 3, color = 2) => {

//     const cell = document.querySelector(`#cell${column + 1}`);

//     const disc = document.querySelector(`#disc${numberOfRows * numberOfColumns - freeCells(board) + 1}`);

//     const rectCell = cell.getBoundingClientRect();

//     const rectDisc = disc.getBoundingClientRect();

//     const targetCell = document.querySelector(`#cell${7 * (5 - row) + (column + 1)}`);

//     const rectTargetCell = targetCell.getBoundingClientRect();


//     disc.style.left = rectCell.left + ((rectCell.width - rectDisc.width) / 2) + "px";

//     disc.style.top = rectCell.top + ((rectCell.height - rectDisc.height) / 2) - rectCell.height * 1.5 + "px";

   
//     if (color == 1) disc.classList.add("yellow");

//     if (color == 2) disc.classList.add("red");


//     disc.style.opacity = 1;

//     disc.style.transition = `transform ${0.6 / 6 * (6 - row)}s ease-in`;



//     let distance = rectTargetCell.top + (rectTargetCell.height - rectDisc.height) / 2  -  parseFloat(disc.style.top) + "px";

//     disc.style.transform = `translateY(${distance})`;



//     console.log(distance);

    

//     console.log(rectCell.width, rectDisc.width, rectCell.left, rectCell.top);

//     console.log(disc.style.left, disc.style.top);



// }


const updateBoard = (board, row , column, color) => {

    console.log(board);

    const topCell = document.querySelector(`#cell${column + 1}`);

    const disc = document.querySelector(`#disc${numberOfRows * numberOfColumns - freeCells(board)}`);

    const targetCell = document.querySelector(`#cell${7 * ((numberOfRows - 1) - row) + (column + 1)}`);


    // const topCell = document.querySelector(`#cell4`);

    // const disc = document.querySelector(`#disc1`);

    // const targetCell = document.querySelector(`#cell4`);



    disc.style.left = topCell.offsetLeft + (topCell.offsetWidth - disc.offsetWidth) / 2 + "px";

    disc.style.top = topCell.offsetTop + (topCell.offsetHeight - disc.offsetHeight) / 2 - topCell.offsetHeight * 1.5 + "px";

   
    if (color == 1) disc.classList.add("yellow");

    if (color == 2) disc.classList.add("red");


    disc.style.opacity = 1;

    // disc.style.transition = `transform ${0.6 / 6 * (6 - row)}s cubic-bezier(0.33, 0, 0.66, 0.33)`;


    disc.style.transition = `transform ${[...durations].reverse()[row]}s cubic-bezier(0.33, 0, 0.66, 0.33)`;



    let distance = targetCell.offsetTop + (targetCell.offsetHeight - disc.offsetHeight) / 2  -  parseFloat(disc.offsetTop) + "px";

    disc.style.transform = `translateY(${distance})`;



    // const disc1 = document.querySelector(`#disc1`);

    // const cell1 = document.querySelector(`#cell39`);


    // console.log(disc1.offsetTop);
    // console.log(disc1.offsetLeft);
    // console.log(disc1.offsetWidth);
    // console.log(disc1.offsetHeight);

    // console.log("");


    // console.log(cell1.offsetTop);
    // console.log(cell1.offsetLeft);
    // console.log(cell1.offsetWidth);
    // console.log(cell1.offsetHeight);


    // console.log("");

}

const resetGame = () =>{

    depth = 1;

    gameOver = false;

    firstPlayer = firstPlayer == human ? ai : human;

    player = firstPlayer;



    disableTouch();



    document.querySelectorAll(".cell").forEach((cell) =>{

        cell.style.transition = "background-color 0s ease-in-out";
        

    });




    document.querySelectorAll(".cell").forEach((cell) =>{

            cell.classList.remove("blue");

    });



    document.querySelectorAll(".disc").forEach((disc) =>{


        disc.style.transition = `transform 0.6s cubic-bezier(0.33, 0, 0.66, 0.33)`;

        let board = document.querySelector(".board");

        let offset = board.offsetHeight + (board.offsetHeight / 6 ) * 1.5 + window.innerHeight - board.offsetTop - board.offsetHeight;

        disc.style.transform = `translateY(${offset}px)`;


    });


    resetBoard();


    if (player == ai) {
    
            setTimeout(() => {

                document.querySelectorAll(".cell").forEach((cell) =>{

                    cell.style = "";
            
                });

                document.querySelectorAll(".disc").forEach((disc) =>{

                    disc.style = "";
                    disc.classList.remove("red");
                    disc.classList.remove("yellow");
            
                });

                aiMove();



            }, 1000);

    } else {

        setTimeout(() => {

            document.querySelectorAll(".cell").forEach((cell) =>{

                cell.style = "";
        
            });

            document.querySelectorAll(".disc").forEach((disc) =>{

                disc.style = "";
                disc.classList.remove("red");
                disc.classList.remove("yellow");
        
            });

            enableTouch();

        }, 1000);

    }
    
}



const init = () => {

    // disableTouchMove();
    resetBoard();
    enableTouch();
    // setTransitionDisc();

    // randomFirst();

    // drawDisc();


    


    

}

window.onload = () => {
    document.fonts.ready.then(() => {
        init(); 
    });
}