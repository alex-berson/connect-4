const disableTouchMove = () => {

    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchmove', preventDefault, { passive: false });
}

const touchScreen = () => {
    return matchMedia('(hover: none)').matches;
}

const phoneApp = () => {
    if ((document.URL.indexOf('http://') == -1 && document.URL.indexOf('https://') == -1) && 
        (screen.width < 460 || screen.height < 460)) {
            return true;
    } 
    return false;
}

const enableTouch = () => {
    for (let cell of document.querySelectorAll('.cell')){
        if (touchScreen()){
            cell.addEventListener("touchstart", humanTurn);
        } else {
            cell.addEventListener("mousedown", humanTurn);
        }
    }
}

const disableTouch = () => {
    for (let cell of document.querySelectorAll('.cell')){
        if (touchScreen()){
            cell.removeEventListener("touchstart", humanTurn);
        } else {
            cell.removeEventListener("mousedown", humanTurn);
        }
    }
}

const setBoardSize = () => {

    if (screen.height > screen.width) {
         var boardSize = Math.ceil(screen.width * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 7) * 7;
    } else {
         var boardSize = Math.ceil(window.innerHeight * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 7) * 7;
    }

    let holeSize = Math.ceil(boardSize / 7 / 1.15 / 2) * 2;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
    document.documentElement.style.setProperty('--hole-size', holeSize + 'px');
}

const setFontSize = () => {

    let h1 = document.querySelector('h1');
    let board = document.querySelector('.board');

    let fontSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-size'));
    
    let borderSize = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--border-size'));

    while (parseInt(getComputedStyle(h1).getPropertyValue("width")) <= parseInt(getComputedStyle(board).getPropertyValue("width")) + borderSize * 2) {

        fontSize += 0.2;
        document.documentElement.style.setProperty('--font-size', fontSize + 'vmin');
    }
}

const showBoard = () => {
    document.querySelector("body").style.opacity = 1;
}

const showWinner = (row) => {

    let flatBoard = [...board].reverse().flat();
    let cells = win(board, player);

    if (!win(board, player)) {
        document.querySelector("#designed").style.opacity = 0.5;
        return;
    }

    setTimeout(() => {

        document.querySelectorAll('.disc').forEach((disc) => {

            if (cells.every(cell => !disc.classList.contains(cell))) {

                disc.style.transition = "opacity 1s";  
            }
        });

        document.querySelectorAll('.disc').forEach((disc) => {

            if (cells.every(cell => !disc.classList.contains(cell))) {
                disc.style.opacity = 0.5;
            }
        });
    }, [...durations].reverse()[row] * 1000);

    setTimeout(() => {

        document.querySelector("#designed").style.opacity = 0.5;
        document.querySelectorAll(".cell").forEach((cell, i) => {
         if (flatBoard[i] == 0) cell.classList.add("blue");
        });

        document.querySelectorAll('.disc').forEach((disc) => {
            disc.style.opacity = 1;
        })
    }, [...durations].reverse()[row] * 1000 + 1000);
}

const dropDisc = (board, row , column, color) => {

    const topCell = document.querySelector(`#cell${column + 1}`);
    const disc = document.querySelector(`#disc${numberOfRows * numberOfColumns - freeCells(board)}`);
    const targetCell = document.querySelector(`#cell${cellNumber(row, column)}`);

    disc.classList.add(`${cellNumber(row, column)}`);
    disc.style.left = topCell.offsetLeft + (topCell.offsetWidth - disc.offsetWidth) / 2 + "px";
    disc.style.top = topCell.offsetTop + (topCell.offsetHeight - disc.offsetHeight) / 2 - topCell.offsetHeight * 1.5 + "px";

    if (color == 1) disc.classList.add("yellow");
    if (color == 2) disc.classList.add("red");

    disc.style.opacity = 1;
    disc.style.transition = `transform ${[...durations].reverse()[row]}s cubic-bezier(0.33, 0, 0.66, 0.33)`;

    let distance = targetCell.offsetTop + (targetCell.offsetHeight - disc.offsetHeight) / 2  -  parseFloat(disc.offsetTop) + "px";

    disc.style.transform = `translateY(${distance})`;
}

const clearBoard = (cleaningTime) => {

    document.querySelector("#designed").style.transition = "background-color 0s ease-in-out";
    document.querySelector("#designed").style.opacity = 1;
    document.querySelectorAll(".cell").forEach((cell) => {
        cell.style.transition = "background-color 0s ease-in-out";  
    });

    document.querySelectorAll(".cell").forEach((cell) =>{
            cell.classList.remove("blue");
    });

    document.querySelectorAll(".disc").forEach((disc) => {
        disc.style.transition = `transform ${cleaningTime / 1000}s cubic-bezier(0.33, 0, 0.66, 0.33)`;
    });

    document.querySelectorAll(".disc").forEach((disc) => {

        let offset;

        let board = document.querySelector(".board");

        if (window.innerHeight > window.innerWidth) {
            offset = board.offsetHeight + (board.offsetHeight / 6 ) * 1.5 + window.innerHeight - board.offsetTop - board.offsetHeight;
        } else {
            offset = board.offsetHeight + (board.offsetHeight / 6 ) * 1.5 + window.innerWidth - board.offsetTop - board.offsetHeight;
        }

        disc.style.transform += `translateY(${offset}px)`;
    });
}

const resetDiscs = () => {

    document.querySelector("#designed").style = "";
    document.querySelectorAll(".cell").forEach((cell) =>{
        cell.style = "";
    });
    document.querySelectorAll(".disc").forEach((disc) =>{
        disc.style = "";
        disc.classList.remove("red");
        disc.classList.remove("yellow");

        for (let i = 1; i <= numberOfRows * numberOfColumns; i++) {
            disc.classList.remove(`${i}`);
        }
    });
}
