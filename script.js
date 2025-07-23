let boxes = document.querySelectorAll('.box');
let RstBtn = document.querySelector("#Rstbtn");
let newBtn = document.querySelector("#newBtn");
let container = document.querySelector(".msgContainer");
let msg = document.querySelector(".msg");
let statusText = document.querySelector("#statusText")

let turnO = true;
let currPlayer = "X";
let nxtPlayer = "O";

const winPatterns = [[0,1,2],
                     [0,3,6],
                     [0,4,8],
                     [1,4,7],
                     [2,5,8],
                     [2,4,6],
                     [3,4,5],
                     [6,7,8]]

const resetGame = () => {
    turnO=true;
    enableBoxes();
    container.classList.add("hide");
    statusText.innerText = `${nxtPlayer}'s Turn`;
    document.querySelectorAll(".win-line").forEach(line => line.remove());
}

boxes.forEach((box) => {
    box.addEventListener('click', () => {
        if (turnO){
            box.innerText = 'O';
            turnO=false;
            statusText.innerText = `${currPlayer}'s Turn`;
        }
        else{
            box.innerText = 'X';
            turnO=true;
            statusText.innerText = `${nxtPlayer}'s Turn`;
        }
        box.disabled = true;
        checkWinner();
    });
});

const disableBoxes = () => {
    boxes.forEach(box => {
        box.disabled = true;
    });
}

const enableBoxes= () => {
    for(let box of boxes){
        box.disabled=false;
        box.innerText="";
    }
}

const showWinner = (winner, pattern) => {
    drawWinLine(pattern); 

    setTimeout(() => {
        msg.innerText = `🎉 Congratulations, Winner is ${winner}!`;
        container.classList.remove("hide");
        disableBoxes();
    }, 1300);
};

const checkWinner = () => {
    let isWinner = false;

    for (let pattern of winPatterns) {
        let pos1 = boxes[pattern[0]].innerText;
        let pos2 = boxes[pattern[1]].innerText;
        let pos3 = boxes[pattern[2]].innerText;

        if (pos1 !== "" && pos1 === pos2 && pos2 === pos3) {
            showWinner(pos1,pattern);
            isWinner = true;
        }
    }

    let isTie = true;
    boxes.forEach(box => {
        if (box.innerText === "") {
            isTie = false;
        }
    });

   if (!isWinner && isTie) {
    setTimeout(() => {
        msg.innerText = "🤝 It's a Tie!";
        container.classList.remove("hide");
        disableBoxes();
    }, 500);
}
};

const drawWinLine = (pattern) => {
    const line = document.createElement("div");
    line.classList.add("win-line");

    const gridSize = boxes[0].offsetWidth * 3; // size of the full game grid
    const boxCenter = boxes[0].offsetWidth / 2;

    // Get positions of the first and last box in the win pattern
    const startBox = boxes[pattern[0]].getBoundingClientRect();
    const endBox = boxes[pattern[2]].getBoundingClientRect();
    const containerBox = document.querySelector(".game").getBoundingClientRect();

    const x1 = startBox.left + boxCenter - containerBox.left;
    const y1 = startBox.top + boxCenter - containerBox.top;
    const x2 = endBox.left + boxCenter - containerBox.left;
    const y2 = endBox.top + boxCenter - containerBox.top;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.width = `0px`;

    document.querySelector(".game").appendChild(line);

    // Trigger the animation after a tick
    requestAnimationFrame(() => {
        line.style.width = `${length}px`;
    });
};

RstBtn.addEventListener("click", resetGame);
newBtn.addEventListener("click", resetGame);