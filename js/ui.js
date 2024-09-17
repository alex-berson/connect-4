const durations = [150, 280, 380, 460, 540, 610];

const coordsToIndex = (row, col) => row * nCols + col;

const showBoard = () => document.body.style.opacity = 1;

const setBoardSize = () => {

    let minSide = screen.height > screen.width ? screen.width : window.innerHeight;
    let cssBoardSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--board-size')) / 100;
    let boardSize = Math.ceil(minSide * cssBoardSize / 7) * 7;
    let holeSize = Math.ceil(boardSize / 7 / 1.15 / 2) * 2;

    document.documentElement.style.setProperty('--board-size', boardSize + 'px');
    document.documentElement.style.setProperty('--hole-size', holeSize + 'px');
}

const dropDisc = (board, row, col, player) => {

    let duration = durations[row];
    let topCell = document.querySelector(`#c${col + 1}`);
    let disc = document.querySelector(`#d${nRows * nCols - nFreeCells(board)}`);
    let targetCell = document.querySelector(`#c${coordsToIndex(row, col) + 1}`);

    disc.style.left = topCell.offsetLeft + (topCell.offsetWidth - disc.offsetWidth) / 2 + 'px';
    disc.style.top = topCell.offsetTop + (topCell.offsetHeight - disc.offsetHeight) / 2 - topCell.offsetHeight * 1.5 + 'px';

    disc.dataset.r = row;
    disc.dataset.c = col;

    disc.classList.add(player == human ? 'yellow' : 'red');

    let distance = targetCell.offsetTop + (targetCell.offsetHeight - disc.offsetHeight) / 2 - disc.offsetTop + 'px';

    disc.style.transitionDuration = `${duration / 1000}s`;
    disc.style.transform = `translateY(${distance})`;
}

const endGame = (row) => {

    let delay = durations[row];
    let designed = document.querySelector('#designed');
    let line = win(board, player);

    setTimeout(() => {

        if (line == null) {

            designed.classList.add('over');
    
            setTimeout(() => {
                document.querySelector('.board').addEventListener('touchstart', newGame);
                document.querySelector('.board').addEventListener('mousedown', newGame);
            }, 100);
    
            return;
        }

        let discs = document.querySelectorAll('.yellow, .red');
        let lineIdx = line.map(d => coordsToIndex(d[0], d[1]));

        discs.forEach((disc) => {

            let c = Number(disc.dataset.c);
            let r = Number(disc.dataset.r);

            if (!lineIdx.includes(coordsToIndex(r, c))) {
                disc.classList.add('fade');
            }
        });

        setTimeout(() => {

            let board1D = [...board].flat();

            designed.classList.add('over');
    
            document.querySelectorAll('.cell').forEach((cell, i) => {
                if (board1D[i] == 0) cell.classList.add('disabled');
            });

            setTimeout(() => {
                document.querySelector('.board').addEventListener('touchstart', newGame);
                document.querySelector('.board').addEventListener('mousedown', newGame);
            }, 1000);

        }, 1000);

    }, delay);
}

const clearBoard = () => {

    let board = document.querySelector('.board');
    let cells = document.querySelectorAll('.cell');
    let designed = document.querySelector('#designed');
    let discs = document.querySelectorAll('.yellow, .red');
    let maxSide = screen.height > screen.width ? window.innerHeight: window.innerWidth;
    let offset = board.offsetHeight + (board.offsetHeight / 6 ) * 1.5 + maxSide - board.offsetTop - board.offsetHeight;

    board.removeEventListener('touchstart', newGame);
    board.removeEventListener('mousedown', newGame);

    cells.forEach((cell) => cell.classList.remove('disabled'));

    designed.classList.remove('over');

    discs.forEach((disc) => {

        disc.style.transitionDuration = '0.8s';
        disc.style.transform += `translateY(${offset}px)`;

        disc.addEventListener('transitionend', () => {
            
            disc.removeAttribute('style');
            disc.removeAttribute('class');
            disc.classList.add('disc');

            delete disc.dataset.r;
            delete disc.dataset.c;

        }, {once: true});
    });
}

const enableTouch = () => {

    let cells = document.querySelectorAll('.cell');

    for (let cell of cells) {
        cell.addEventListener('touchstart', humanTurn);
        cell.addEventListener('mousedown', humanTurn);
    }
}

const disableTouch = () => {

    let cells = document.querySelectorAll('.cell');

    for (let cell of cells) {
        cell.removeEventListener('touchstart', humanTurn);
        cell.removeEventListener('mousedown', humanTurn);
    }
}

const disableTapZoom = () => {

    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchstart', preventDefault, {passive: false});
    document.body.addEventListener('mousedown', preventDefault, {passive: false});
}