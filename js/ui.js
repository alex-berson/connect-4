const disableTouchMove = () => {

    const preventDefault = (e) => e.preventDefault();

    document.body.addEventListener('touchmove', preventDefault, { passive: false });

}

const touchScreen = () => {
    return matchMedia('(hover: none)').matches;
}

const enableTouch = () => {
    for (let cell of document.querySelectorAll('.cell')){
        if (touchScreen()){
            cell.addEventListener("touchstart", humanMove);
        } else {
            cell.addEventListener("mousedown", humanMove);
        }
    }
}

const disableTouch = () => {
    for (let cell of document.querySelectorAll('.cell')){
        if (touchScreen()){
            cell.removeEventListener("touchstart", humanMove);
        } else {
            cell.removeEventListener("mousedown", humanMove);
        }
    }
}

const disableBoard = () => {

    let flatBorad = [...board].reverse().flat();

    document.querySelector("#designed").style.opacity = 0.5;
    document.querySelectorAll(".cell").forEach((cell, i) => {
        if (flatBorad[i] == 0) cell.classList.add("blue");
    });
}


const printBoard = (board) => {
    console.log([...board].reverse());
}

const dropDisc = (board, row , column, color) => {

    // console.log(board);

    const topCell = document.querySelector(`#cell${column + 1}`);
    const disc = document.querySelector(`#disc${numberOfRows * numberOfColumns - freeCells(board)}`);
    const targetCell = document.querySelector(`#cell${7 * ((numberOfRows - 1) - row) + (column + 1)}`);


    // const rectDisc = document.querySelector(`#disc1`).getBoundingClientRect();
    // const rectCell = document.querySelector(`#cell39`).getBoundingClientRect();

    // console.log(rectDisc);

    // console.log(rectCell);

    // const topCell = document.querySelector(`#cell4`);

    // const disc = document.querySelector(`#disc1`);

    // const targetCell = document.querySelector(`#cell4`);

    // console.log(topCell.offsetHeight);

    // console.log(disc.offsetHeight);



    disc.style.left = topCell.offsetLeft + (topCell.offsetWidth - disc.offsetWidth) / 2 + "px";
    disc.style.top = topCell.offsetTop + (topCell.offsetHeight - disc.offsetHeight) / 2 - topCell.offsetHeight * 1.5 + "px";



    // console.log("disc.style.top", disc.style.top);

    // console.log("targercell.top", targetCell.offsetTop);


   
    if (color == 1) disc.classList.add("yellow");
    if (color == 2) disc.classList.add("red");

    disc.style.opacity = 1;

    // disc.style.transition = `transform ${0.6 / 6 * (6 - row)}s cubic-bezier(0.33, 0, 0.66, 0.33)`;

    disc.style.transition = `transform ${[...durations].reverse()[row]}s cubic-bezier(0.33, 0, 0.66, 0.33)`;

    let distance = targetCell.offsetTop + (targetCell.offsetHeight - disc.offsetHeight) / 2  -  parseFloat(disc.offsetTop) + "px";
    let styles = window.getComputedStyle(targetCell, '::after')
    // let content = styles['left'];

    // console.log("target ", styles.top);


    // console.log("distance ", distance);

    // console.log("disc.style.top", parseFloat(disc.offsetTop));


    disc.style.transform = `translateY(${distance})`;


    // disc.style.transform = `translateY(${distance}) rotateY(30deg)`;


    // disc.style.transform = `rotateY(30deg)`;

    // const disc1 = document.querySelector(`#disc1`);

    // const cell1 = document.querySelector(`#cell39`);


    // console.log(disc1.offsetTop);
    // console.log(disc1.offsetLeft);
    // console.log(disc1.offsetWidth);
    // console.log(disc1.offsetHeight);

    // console.log("");


    // console.log(cell1.offsetTop);
    // console.log(cell1.offsetLeft);
    // console.log(cell1.offsetWidth);
    // console.log(cell1.offsetHeight);


    // console.log("");

}

const clearBoard = () => {

    document.querySelector("#designed").style.transition = "background-color 0s ease-in-out"; //
    document.querySelector("#designed").style.opacity = 1; //
    document.querySelectorAll(".cell").forEach((cell) =>{
        cell.style.transition = "background-color 0s ease-in-out";  
    });

    document.querySelectorAll(".cell").forEach((cell) =>{
            cell.classList.remove("blue");
    });


    document.querySelectorAll(".disc").forEach((disc) => {

        // disc.style.transition = "opacity 0s";  
        // disc.style.opacity = 1;

        disc.style.transition = `transform 0.6s cubic-bezier(0.33, 0, 0.66, 0.33)`;
        let board = document.querySelector(".board");
        let offset = board.offsetHeight + (board.offsetHeight / 6 ) * 1.5 + window.innerHeight - board.offsetTop - board.offsetHeight;
        disc.style.transform += `translateY(${offset}px)`;
    });
}

const clearDiscs = () => {

    document.querySelector("#designed").style = ""; //
    document.querySelectorAll(".cell").forEach((cell) =>{
        cell.style = "";
    });
    document.querySelectorAll(".disc").forEach((disc) =>{
        disc.style = "";
        disc.classList.remove("red");
        disc.classList.remove("yellow");
    });
}
