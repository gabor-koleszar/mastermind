const startGame = document.querySelector(".js-start-game");
const startBtn = document.querySelector(".js-start-game-btn")
const resultContainer = document.querySelector(".js-result-container");
const resultOutput = document.querySelector(".js-result");
const winnOutput = document.querySelector(".js-winn");
const guessSection = document.querySelector(".js-guess");
const guessForm = document.querySelector(".js-guess-form");
const errContainer = document.querySelector(".js-err");
const guessInput = document.querySelector("[name=guess-num]");
const infoIcon = document.querySelector(".js-info-icon");
const rulesContainer = document.querySelector(".js-rules-container");
const roundsRemains = document.querySelector(".js-rounds-remains");
let guessArr = [];
let secretArr = [];
let rounds = 0;

function generateSecretCode() {
    for (let i = 0; i < 4; i++) {
        secretArr.push(Math.trunc(Math.random() * 10));
    }
}

function identicalMatch(secret, guess) {
    let sCopy = secret.slice();
    let gCopy = guess.slice();
    let match = 0;
    let minus = 0;
    for (let i in guess) {
        if (guess[i] === secret[i]) {
            match++;
            sCopy.splice(i - minus, 1);
            gCopy.splice(i - minus, 1);
            minus++;
        }
    }

    return [match, sCopy, gCopy];
}

function halfMatch(secret, guess) {
    let guessCopy = guess.slice();
    let match = 0;
    for (let secretNum of secret) {
        if (guessCopy.includes(secretNum)) {
            guessCopy.splice(guessCopy.indexOf(secretNum), 1);
            match++;
        }
    }
    
    return match;
}

function notMatch(totalMatch, partialMatch) {
    return 4 - (totalMatch + partialMatch);
}

function match(secret, guess) {
    let totalMatch = identicalMatch(secret, guess);
    let partialMatch = halfMatch(totalMatch[1], totalMatch[2]);
    let reminder = notMatch(totalMatch[0], partialMatch);

    return [totalMatch[0], partialMatch, reminder];
}

function drawSquares(whiteSquares, blackSquares, emptySquares) {
    let html = '';

    if (whiteSquares > 0) {
        for (let i = 1; i <= whiteSquares; i++) {
            html += `<div class="square white-square"></div>`;
        }
    }

    if (blackSquares > 0) {
        for (let i = 1; i <= blackSquares; i++) {
            html += `<div class="square black-square"></div>`;
        }
    }

    if (emptySquares > 0) {
        for (let i = 1; i <= emptySquares; i++) {
            html += `<div class="square empty-square"></div>`;
        }
    }

    return html;
}

function drawGuess() {
    return guessArr.map(num => `<div class="guess-num">${num}</div>`).join('');
}

function showResult(whiteSquares, blackSquares, emptySquares) {
    if (resultContainer.classList.contains("result-container-hidden")) {
        resultContainer.classList.remove("result-container-hidden");
        resultContainer.classList.add("result-container-show");
    }

    const squares = drawSquares(whiteSquares, blackSquares, emptySquares);
    const guessNums = drawGuess();
    
    let html = `
        <div class="round-container">
            <div class="rounds">${rounds}</div>
            <div class="square-container">${squares}</div>
            <div class="guess-container">${guessNums}</div>
        </div>
    `;

    resultOutput.innerHTML += html;
}

function renderGameResult(whiteSquares) {
    let gameResult = "";

    if (whiteSquares === 4) {
        gameResult = "Nyertél"
    } else {
        gameResult = "Vesztettél";
    }

    winnOutput.innerHTML = gameResult;
}

function evaluateInput(event) {
    event.preventDefault();
    
    const guessValue = guessInput.value;

    if (guessValue.length === 4 && !guessValue.includes('e')) {
        errContainer.innerHTML = "";
        rounds++;
        roundsRemains.innerHTML = `Tippelési lehetőség: ${10 - rounds}`;
        guessArr = [];
        guessArr = [...guessValue].map(num => parseInt(num));
        const matchArr = match(secretArr, guessArr);

        let whiteSquares = matchArr[0];
        let blackSquares = matchArr[1];
        let emptySquares = matchArr[2];

        if (whiteSquares === 4 || rounds >= 10) {
            startBtn.disabled = true;
            startBtn.classList.add("btn-disabled");
            renderGameResult(whiteSquares);
        }

        showResult(whiteSquares, blackSquares, emptySquares);
        guessInput.value = '';
    } else {
        errContainer.innerHTML = '<p class="err">Négy számjegyből kell állnia a kódnak.</p>';
    }

}

function newGame(event) {
    event.preventDefault();
    if (guessSection.classList.contains("guess-hidden")) {
        guessSection.classList.remove("guess-hidden");
        guessSection.classList.add("guess-show");
    }

    if (startBtn.disabled === true) {
        startBtn.disabled = false;
        startBtn.classList.remove("btn-disabled");
    }

    secretArr = [];
    guessArr = [];
    guessInput.value = '';
    winnOutput.innerHTML = '';
    rounds = 0;
    resultOutput.innerHTML = '';
    roundsRemains.innerHTML = `Tippelési lehetőség: 10`;

    if (resultContainer.classList.contains("result-container-show")) {
        resultContainer.classList.remove("result-container-show");
        resultContainer.classList.add("result-container-hidden");
    }

    generateSecretCode();
}

function toggleRules() {
    rulesContainer.classList.toggle("d-none");
}

startGame.addEventListener("click", newGame);
guessForm.addEventListener("submit", evaluateInput);
infoIcon.addEventListener("mouseenter", toggleRules);
infoIcon.addEventListener("mouseleave", toggleRules);
