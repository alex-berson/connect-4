const aiMove = async() => {

    let initialColumnes = [];

    // let depth = 2;

    let scores, column, score;
    let validMoves;  //
    let lastScores, lastColumn, lastScore;
    let row;
    let startTime = new Date();

    // MonteCarloSimulation(board, startTime);

    // if (player == ai) {

    //     console.log("%c timeMC: ", 'color: #ff0000', (new Date() - startTime) / 1000); //

    // } else {

    //     console.log("%c timeMC: ", 'color: #ffa500', (new Date() - startTime) / 1000); //

    // }

    // startTime = new Date();


    // let startTime = new Date(Date.now() + delay);

    depth = Math.max(Math.min(depth - 2, freeCells(board) - 2), 1);

    // depth = Math.max(depth, 1);



    // console.log(depth);


    // if (freeCells(board) != numberOfColumns * numberOfRows) {

    if (player == ai) {

        do{
            [column, score] = minimax(board, depth, -Infinity, Infinity, true, startTime, initialColumnes);

            // scores = scores.filter(item => item);

            if (new Date() - startTime >= timeLimit) console.log("timeout");
            if (timeOut(startTime)) {
                [column, score] = [lastColumn, lastScore]
                depth--;
                break;
            } else {
                [lastColumn, lastScore] = [column, score]

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

        column = 3; //
        column = monteCarloSimulation(board, startTime);
    }


    console.log("column: ", column);

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


    // dropDisc(board, freeRaw(board, column), column, player);

    // setTimeout(enableTouch, Math.min([...durations].reverse()[freeRaw(board, column)] * 1000, 300));

    // setTimeout(enableTouch, 150);


    // console.log([...durations].reverse()[freeRaw(board, column)] * 1000);

    placeDisc(board, column, player);
    checkEndGame(board, player);
    dropDisc(board, row, column, player);

    if (gameOver) {
        showWinner(row);
        setTimeout(enableTouch, [...durations].reverse()[row] * 1000 + 1000 + !draw(win(board, player)) * 1000);

        console.log("pause: ", [...durations].reverse()[row] * 1000 + 1000 + !draw(win(board, player)) * 1000);

        console.log("win: ", win(board, player));


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

    placeDisc(board, column, player);
    checkEndGame(board, player);
    dropDisc(board, row, column, player);

    if (gameOver){
        showWinner(row);
        setTimeout(enableTouch, [...durations].reverse()[row] * 1000 + 1000 + !draw(win(board, player)) * 1000);

        console.log("pause: ", [...durations].reverse()[row] * 1000 + 1000 + !draw(win(board, player)) * 1000);

        console.log("win: ", win(board, player));

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

// const dropDisc = (board) => {

//     document.querySelectorAll(".cell").forEach((cell, index) => {

//         let reversedBoard = [...board].reverse();

//         if ((reversedBoard[Math.floor(index / 7)][index % 7]) == human) cell.classList.add("yellow-hole");
        
//         if ((reversedBoard[Math.floor(index / 7)][index % 7]) == ai) cell.classList.add("red-hole");

//     });

// }