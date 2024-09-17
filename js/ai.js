const timeOver = (startTime, timeLimit) => new Date() - startTime >= timeLimit;

const alphabeta = (board, depth, alpha, beta, maximizingPlayer, startTime, timeLimit, initMoves = []) => {

    let bestMove;
    let moves = validMoves(board);
    let opponent = player == ai ? human : ai;

    if (timeOver(startTime, timeLimit)) return [null, null];
    if (depth == 0 || gameOver(board)) return [null, evaluation(board, player)];
    if (initMoves.length != 0) moves = [...new Set([...initMoves, ...moves])];
    
    if (maximizingPlayer) {
        
        let bestScore = -Infinity;
        
        for (let move of moves) {

            let tempBoard = board.map(arr => arr.slice());
    
            updateBoard(tempBoard, move, player);
    
            let [_, score] = alphabeta(tempBoard, depth - 1, alpha, beta, false, startTime, timeLimit);

            if (score > bestScore) [bestScore, bestMove] = [score, move];

            alpha = Math.max(alpha, score);

            if (alpha >= beta) break;
        }

        return [bestMove, bestScore];

    } else {

        let bestScore = Infinity;
        
        for (let move of moves) {

            let tempBoard = board.map(arr => arr.slice());
    
            updateBoard(tempBoard, move, opponent);
    
            let [_, score] = alphabeta(tempBoard, depth - 1, alpha, beta, true, startTime, timeLimit);
    
            if (score < bestScore) [bestScore, bestMove] = [score, move];

            beta = Math.min(beta, score);
           
            if (beta <= alpha) break;
        }

        return [bestMove, bestScore];
    }
}

const minimax = (board, startTime, timeLimit) => {

    let bestMove, bestScore;
    let depth = 1;
    let initMoves = [];

    do {

        let [move, score] = alphabeta(board, depth, -Infinity, Infinity, true, startTime, timeLimit, initMoves);

        if (timeOver(startTime, timeLimit)) break;

        [bestMove, bestScore] = [move, score];
        initMoves = [...new Set([...[move], ...initMoves])];

        depth++;

    } while(depth <= nFreeCells(board) && Math.abs(bestScore) < 100);

    return bestMove;
}