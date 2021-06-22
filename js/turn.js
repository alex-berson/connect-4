const aiTurn = async() => {

    let initialColumnes = [];
    let column, score;
    let lastColumn, lastScore;
    let row;
    let startTime = new Date();

    depth = Math.max(Math.min(depth - 2, freeCells(board) - 2), 1);
    if (freeCells(board) == numberOfColumns * numberOfRows) {

        column = 3;

    } else {

        do{

            [column, score] = minimax(board, depth, -Infinity, Infinity, true, startTime, initialColumnes);

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

        await new Promise(r => setTimeout(r, timeLimit - (new Date() - startTime)));

    }

    row = freeRaw(board, column);

    placeDisc(board, column, player);
    checkEndGame(board, player);
    dropDisc(board, row, column, player);

    if (gameOver) {
        showWinner(row);
        setTimeout(enableTouch, [...durations].reverse()[row] * 1000 + 1000 + !draw(win(board, player)) * 1000);
    } else {
        setTimeout(enableTouch, Math.min([...durations].reverse()[row] * 1000, 300));
        togglePlayer();
    }
}

const humanTurn = (e) => {

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
    } else {
        togglePlayer();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                aiTurn(delay);
            });
        });  
    }
}
