const minimax = (board, depth, alpha, beta, maximizingPlayer, startTime, initialColumnes) => {

    let tempBoard;
    let bestScore;
    let validMoves = getValidMoves(board);
    let opponent = player == ai ? human : ai;
    let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];

    if (depth == 0 || terminalNode(board)) return [null, evaluation(board, player)];
    if (timeOut(startTime)) return [null, null];
    if (initialColumnes != null) validMoves = [...new Set([...initialColumnes, ...validMoves])];
    
    if (maximizingPlayer) {
        
        bestScore = -Infinity;
        
        for (let column of validMoves) {

            tempBoard = board.map(arr => arr.slice());
    
            placeDisc(tempBoard, column, player);
    
            [_, score] = minimax(tempBoard, depth - 1, alpha, beta, false, startTime, null);

            if (score > bestScore) [bestScore, bestColumn] = [score, column];

            alpha = Math.max(alpha, score);

            if (alpha >= beta) break;
        }
        return [bestColumn, bestScore];

    } else {

        bestScore = Infinity;
        
        for (let column of validMoves) {

            tempBoard = board.map(arr => arr.slice());
    
            placeDisc(tempBoard, column, opponent);
    
            [_, score] = minimax(tempBoard, depth - 1, alpha, beta, true, startTime, null);
    
            if (score < bestScore) [bestScore, bestColumn] = [score, column];

            beta = Math.min(beta, score);

            if (beta <= alpha) break;
        }
        return [bestColumn, bestScore];
    }
}

