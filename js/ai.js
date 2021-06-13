const minimax = (board, depth, alpha, beta, maximizingPlayer, startTime, initialColumnes) => {

    let tempBoard;
    let bestScore;
    let validMoves = getValidMoves(board);
    let opponent = player == ai ? human : ai;
    let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];

    if (player == ai) {
        if (depth == 0 || terminalNode(board)) return [null, evaluation(board, player)];
    } else {
        if (win(board, player)) return [null, 100 * (freeCells(board) + 1)];
        if (win(board, opponent)) return [null, -100 * (freeCells(board) + 1)];
        if (boardFull(board)) return [null, 0];
        if (depth == 0) return [null, evaluation(board, player)];
    }

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

const negamax = (board, depth, alpha, beta, color, startTime, initialColumnes) => {

    let tempBoard;
    let bestScore;
    let validMoves = getValidMoves(board);
    let opponent = player == ai ? human : ai;
    let currentPlayer = color == 1 ? player : opponent;
    let bestColumn = validMoves[Math.floor(Math.random() * validMoves.length)];

    if (depth == 0 || terminalNode(board)) return [null,  color * evaluation(board, player)];
    if (timeOut(startTime)) return [null, null];
    if (initialColumnes != null) validMoves = [...new Set([...initialColumnes, ...validMoves])];
 
    bestScore = -Infinity;
    
    for (let column of validMoves) {

        tempBoard = board.map(arr => arr.slice());

        placeDisc(tempBoard, column, currentPlayer);

        score = -negamax(tempBoard, depth - 1, -beta, -alpha, -color, startTime, null)[1];

        if (score > bestScore) [bestScore, bestColumn] = [score, column];

        alpha = Math.max(alpha, score);

        if (alpha >= beta) break;
    }

    return [bestColumn, bestScore];
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
            tempBoard = board.map(arr => arr.slice());
            color = player;
            firstMove = null;

            do{
                validMoves = getValidMoves(tempBoard);
                random = Math.floor(Math.random() * validMoves.length);
                column = validMoves[random];
 
                if (firstMove == null) firstMove = column;
        
                placeDisc(tempBoard, column, color);
    
                if (win(tempBoard, player)) {stats[firstMove].wins += 100 * freeCells(tempBoard); stats[firstMove].visits++; break}
                if (win(tempBoard, opponent)) {stats[firstMove].wins -= 100 * freeCells(tempBoard); stats[firstMove].visits++ ; break}
                if (boardFull(tempBoard)) {stats[firstMove].visits++ ; break}
        
                color = color == ai ? human : ai;
        
            } while(true);

    } while (!timeOut(startTime))

    bestValue = -Infinity    

    for (let [i, s] of stats.entries()) {

        if (s.visits == 0) continue;
        if (s.wins / s.visits > bestValue) [bestValue, bestColumn] = [s.wins / s.visits, i]

    }

    return bestColumn;
}

