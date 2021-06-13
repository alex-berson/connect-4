const aiMove = async() => {

    let initialColumnes = [];
    let column, score;
    let lastColumn, lastScore;
    let row;
    let startTime = new Date();

    depth = Math.max(Math.min(depth - 2, freeCells(board) - 2), 1);

    if (freeCells(board) == numberOfColumns * numberOfRows) {

    // if (player == ai) {

    // if (false) {

        //  [column, score] = negamax(board, depth, -Infinity, Infinity, 1, startTime, initialColumnes); 
        //  column = monteCarlo(board, startTime);


        column = 3;

    } else {

        do{

            // if (freeCells(board) == numberOfColumns * numberOfRows) {column = 3; break}

            [column, score] = minimax(board, depth, -Infinity, Infinity, true, startTime, initialColumnes);

            // [column, score] = negamax(board, depth, -Infinity, Infinity, 1, startTime, initialColumnes);

            // if (new Date() - startTime >= timeLimit) console.log("timeout");
            if (timeOut(startTime)) {
                [column, score] = [lastColumn, lastScore]
                depth--;
                break;
            } else {
                [lastColumn, lastScore] = [column, score]

                initialColumnes = [...new Set([...[column], ...initialColumnes])];
            }

            depth++

        } while(depth < freeCells(board));

        console.log("depth: " , depth);

        // alert(depth);

        await new Promise(r => setTimeout(r, timeLimit - (new Date() - startTime)));

    }

    // column = nextMove(); 

    row = freeRaw(board, column);

    console.log("column: ", column);
    console.log("score: ", score);

    if (player == ai) {
        console.log("%c time: ", 'color: #ff0000', (new Date() - startTime) / 1000); //
    } else {
        console.log("%c time: ", 'color: #ffa500', (new Date() - startTime) / 1000); //
    }

    placeDisc(board, column, player);
    checkEndGame(board, player);
    dropDisc(board, row, column, player);

    if (gameOver) {
        showWinner(row);
        setTimeout(enableTouch, [...durations].reverse()[row] * 1000 + 1000 + !draw(win(board, player)) * 1000);

        // console.log("pause: ", [...durations].reverse()[row] * 1000 + 1000 + !draw(win(board, player)) * 1000);
        // console.log("win: ", win(board, player));

    } else {
        setTimeout(enableTouch, Math.min([...durations].reverse()[row] * 1000, 300));
        togglePlayer();
    }
}

const humanMove = (e) => {

    let el = e.currentTarget;
    let delay;
    let row;
    let column = Array.from(el.parentNode.children).indexOf(el) % 7;

    if (gameOver) {resetGame(); return;}

    if (!validMove(board, column)) return;

    disableTouch();

    row = freeRaw(board, column);
    delay = [...durations].reverse()[row * 1000];

    placeDisc(board, column, player);
    checkEndGame(board, player);
    dropDisc(board, row, column, player);

    if (gameOver){
        showWinner(row);
        setTimeout(enableTouch, [...durations].reverse()[row] * 1000 + 1000 + !draw(win(board, player)) * 1000);

        // console.log("pause: ", [...durations].reverse()[row] * 1000 + 1000 + !draw(win(board, player)) * 1000);

        // console.log("win: ", win(board, player));

    } else {
        togglePlayer();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiMove(delay);
            });
        });  
    }
}
