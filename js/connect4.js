let board = [];
let moovingInterval;
let gameOver = false;
let depth = 1;

// let moveDone = true;

const numberOfRows = 6;
const numberOfColumns = 7;
const timeLimit = 600;
const depthLimit = 7;  //
const empty = 0
const human = 1;
const ai = 2;
const durations = [0.15, 0.28, 0.38, 0.46, 0.54, 0.61];

let firstPlayer = player = human;
let firstMove = human;
let boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 14) * 14;

// boardSize = Math.ceil(screen.width * boardSize / 14) * 14;

let holeSize = Math.ceil(boardSize / 7 / 1.15 / 2) * 2;

document.documentElement.style.setProperty('--board-size', boardSize + 'px');
document.documentElement.style.setProperty('--hole-size', holeSize + 'px');

const resetGame = () =>{

    depth = 1;
    gameOver = false;
    firstPlayer = firstPlayer == human ? ai : human;
    player = firstPlayer;

    disableTouch();
    clearBoard();
    resetBoard();

    if (player == ai) {
            setTimeout(() => {
                clearDiscs();
                aiMove();
            }, 1000);
    } else {
        setTimeout(() => {
            clearDiscs();
            enableTouch();
        }, 1000);
    }
}

const randomFirst = () => {

    player = (Math.random() < 0.5) ? human : ai;
    moovingInterval = setInterval(aiMove, 1000); ///

    // if (player == ai) {
    //     aiMove();
    // } else {
    //     enableTouch();
    // }

}

const init = () => {

    disableTouchMove();

    resetBoard();
    enableTouch();

    // setBoardSize();
    // setTransitionDisc();

    // randomFirst(); ///

    // drawDisc();    

    // const object = {
    //     wins: 0,
    //     visits: 0
    // }

    // stats = Array.from({length: 7}, (_, i) => Object.assign({}, object));


    // const stats = [{}, {}, {}, {}, {}, {}, {}];

    // const stats = [object, Object.assign({}, object), object, object, object, object, object]

    // stats[0].wins = 1;
    // stats[0].visits = 1;

    // stats[1].visits++;



    // console.log(stats);

}

window.onload = () => {
    document.fonts.ready.then(() => {
        init(); 
    });
}