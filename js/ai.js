function minimax(board, depth, alpha, beta, maximizingPlayer, startTime, initialColumnes) {

    let scores = [];
    let tempBoard;
    let bestScore;
    let validMoves = getValidMoves(board);
    let opponent = player == ai ? human : ai;
    let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];

    if (player == ai) {
        if (depth == 0 || terminalNode(board)) return [null, evaluatePosition(board, player)];
    } else {
        if (win(board, player)) return [null, 100 * (freeCells(board) + 1)];
        if (win(board, opponent)) return [null, -100 * (freeCells(board) + 1)];
        if (boardFull(board)) return [null, 0];
        if (depth == 0) return [null, evaluationWithMatrix(board, player)];
    }

    if (timeOut(startTime)) return [null, null];
    if (initialColumnes != null) validMoves = [...new Set([...initialColumnes, ...validMoves])];
    if (maximizingPlayer) {
        
        bestScore = -Infinity;
        
        for (let column of validMoves) {

            tempBoard = board.copy();
    
            placeDisc(tempBoard, column, player);
    
            [_, score] = minimax(tempBoard, depth - 1, alpha, beta, false, startTime, null);

            if (initialColumnes != null) scores[column] = score;
            if (score > bestScore) [bestScore, bestColumn] = [score, column];

            alpha = Math.max(alpha, score);

            if (alpha >= beta) break;
        }
        return [bestColumn, bestScore];

    } else {

        bestScore = Infinity;
        
        for (let column of validMoves) {

            tempBoard = board.copy();
    
            placeDisc(tempBoard, column, opponent);
    
            [_, score] = minimax(tempBoard, depth - 1, alpha, beta, true, startTime, null);
    
            if (score < bestScore) [bestScore, bestColumn] = [score, column];

            beta = Math.min(beta, score);

            if (beta <= alpha) break;
        }
        return [bestColumn, bestScore];
    }
}

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

        placeDisc(tempBoard, column, currentPlayer);

        score = -negamax(tempBoard, depth - 1, -beta, -alpha, -color)[2];

        if (depth == depthLimit) scores[column] = score;
        if (score > bestScore) [bestScore, bestColumn] = [score, column];

        alpha = Math.max(alpha, score);

        if (alpha >= beta) break;

    }

    return [scores, bestColumn, bestScore];
}

const matrix = (board, color) => {

    let score = 138;
    let reversedColor = color == ai ? human : ai;

    const scoresMatrix = [
        [3, 4, 5, 7, 5, 4, 3], 
        [4, 6, 8, 10, 8, 6, 4],
        [5, 8, 11, 13, 11, 8, 5], 
        [5, 8, 11, 13, 11, 8, 5],
        [4, 6, 8, 10, 8, 6, 4],
        [3, 4, 5, 7, 5, 4, 3]
    ]

    for (let r = 0; r < numberOfRows; r++) {
        for (let c = 0; c < numberOfColumns; c++) {
            if (board[r][c] == color) score += scoresMatrix[r][c];
            if (board[r][c] == reversedColor) score -= scoresMatrix[r][c];
        }
    }
    return score;
}

const monteCarlo = (board, startTime) => {

    let validMoves;
    let column;
    let bestColumn, bestValue;
    const columnStat = {
        wins: 0,
        visits: 0
    }
    let stats = Array.from({length: 7}, (_, i) => Object.assign({}, columnStat));
    let random;
    let opponent = player == ai ? human : ai;
    let tempBoard;

    do{
            tempBoard = board.copy();
            color = player;
            firstMove = null;

            do{
                validMoves = getValidMoves(tempBoard);
                random = Math.floor(Math.random() * validMoves.length);
                column = validMoves[random];
 
                if (firstMove == null) firstMove = column;
        
                placeDisc(tempBoard, column, color);
        
                // if (win(tempBoard, player)) {stats[firstMove].wins++; stats[firstMove].visits++; break}
        
                // if (win(tempBoard, opponent)) {stats[firstMove].wins--; stats[firstMove].visits++ ; break}


                if (win(tempBoard, player)) {stats[firstMove].wins += 1000 * freeCells(tempBoard); stats[firstMove].visits++; break}
                if (win(tempBoard, opponent)) {stats[firstMove].wins -= 1000 * freeCells(tempBoard); stats[firstMove].visits++ ; break}
                if (boardFull(tempBoard)) {stats[firstMove].visits++ ; break}
        
                color = color == ai ? human : ai;
        
            } while(true);

    } while (!timeOut(startTime))

    bestValue = -Infinity    

    for (let [i, s] of stats.entries()) {

        // console.log(s.wins / s.visits);

        if (s.visits == 0) continue;
        if (s.wins / s.visits > bestValue) [bestValue, bestColumn] = [s.wins / s.visits, i]

    }


    console.log(stats);

    // console.log(bestColumn);

    return bestColumn;

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

        placeDisc(tempBoard, column, color);

        score = evaluatePosition(tempBoard, color);

        // if (!win(tempBoard, color)) {

        //     let reversedColor = color == ai ? human : ai;

        //     let validMoves2 = getValidMoves(tempBoard);

        //     for (let column2 of validMoves2) {

        //         tempBoard2 = tempBoard.copy();

        //         placeDisc(tempBoard2, column2, reversedColor);

        //         if (win(tempBoard2, reversedColor)) score -= 50;

        //     }
        // }

        scoreArray[column] = score; //

        if (score > bestScore) [bestScore, bestColumn] = [score, column];
    }

    return bestColumn;
}
