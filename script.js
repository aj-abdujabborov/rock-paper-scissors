const players = ["human", "computer"];

const numTools = 3;
const tools = ["rock", "paper", "scissors"];
const toolImgs = {
    rock: "./imgs/rock.jpeg",
    paper: "./imgs/paper.jpeg",
    scissors: "./imgs/scissors.jpeg"
}
const toolClickCallbacks = [null, null, null];

const winScore = 3;
const playerScores = {
    human: 0,
    computer: 0
}
const stars = {human: [], computer: []};

const defaultToolShadow = document.querySelector(`.tool-container`).style.boxShadow;
const winChoiceShadow = "0 0 30px 8px rgba(255, 255, 255, 0.5)";
const defaultPlayerShadow = document.querySelector(`.profile-container`).style.boxShadow;
const winPlayerShadow = "0 0 100px 50px rgba(255, 255, 255, 0.4)";

const msAfterChoice = {
    human: {
        choiceVisible: 0
    },
    computer: {
        choiceVisible: 0.5 * 1000
    },
    winChoiceHighlight: 0.8 * 1000,
    starVisible: 1 * 1000,
    winPlayerHighlight: 1 * 1000,
    choiceHidden: 2 * 1000,
    nextRound: 2 * 1000,
    gameOverRestart: 5 * 1000
}

makeToolClickCallbackFunctions();
makeStars();
setAcceptInputs(true);

function makeToolClickCallbackFunctions() {
    for (let i = 0; i < numTools; i++) {
        toolClickCallbacks[i] = () => {playRound(tools[i]);};
    }
}

function setAcceptInputs(ON) {
    for (let i = 0; i < numTools; i++) {
        let target = document.querySelector(`.tools-container > .tool-container.${tools[i]}`);
        if (ON) {
            target.addEventListener("click", toolClickCallbacks[i], false);
        }
        else {
            target.removeEventListener("click", toolClickCallbacks[i], false);
        }
    }
}

function playRound(playerSelection) {
    setAcceptInputs(false);
    const computerSelection = getComputerChoice();
    const winner = getWinnerOfRound(playerSelection, computerSelection);
    if (winner !== "tie") {
        ++playerScores[winner];
        setTimeout(() => {updateStars(playerScores[winner], winner)}, msAfterChoice.starVisible);
    }
    showMove(playerSelection, computerSelection, winner);

    if (!isGameOver()) {
        setTimeout(() => {setAcceptInputs(true)}, msAfterChoice.nextRound);
    }
    else {
        setTimeout(() => {setAcceptInputs(true);}, msAfterChoice.gameOverRestart);

        const profile = document.querySelector(`.player.${winner} .profile-container`);
        showWinnerPlayer(profile);
        resetScores();
    }
}

function makeStars() {
    for (const player of players) {
        let starsContainer = document.querySelector(`.${player}.player > .stars-container`);
        for (let i = 0; i < winScore; i++) {
            const star = document.createElement("img");
            starsContainer.appendChild(star);
            stars[player].push(star);
        }
        updateStars(0, player);
    }
}

function updateStars(score, player) {
    for (let i = 0; i < winScore; i++) {
        const star = stars[player][i];
        if (i < score) {
            star.src = "./imgs/starFilled.svg";
            star.alt = "red star";
        }
        else {
            star.src = "./imgs/starEmpty.svg";
            star.alt = "gray star";
        }
    }
}

function showMove(humanTool, computerTool, winner) {
    const tools = {human: humanTool, computer: computerTool};
    for (const player of players) {
        let choiceImg = document.querySelector(`.player.${player} .choice > img`);
        choiceImg.src = toolImgs[tools[player]];

        let choice = document.querySelector(`.player.${player} .choice`);
        setTimeout(() => {choice.style.visibility = "visible";}, msAfterChoice[player].choiceVisible);
        setTimeout(() => {choice.style.visibility = "hidden";}, msAfterChoice.choiceHidden);

        if (player === winner) {
            setTimeout(() => {choice.style.boxShadow = winChoiceShadow;}, msAfterChoice.winChoiceHighlight);
            setTimeout(() => {choice.style.boxShadow = defaultToolShadow;}, msAfterChoice.choiceHidden);
        }
    }
}

function showWinnerPlayer(profile) {
    setTimeout(() => {profile.style.boxShadow = winPlayerShadow;}, msAfterChoice.winPlayerHighlight);
    setTimeout(() => {profile.style.boxShadow = defaultPlayerShadow;}, msAfterChoice.gameOverRestart);
}

function resetScores() {
    setTimeout(
        () => {
            playerScores.human = playerScores.computer = 0;
            updateStars(0, "human"); 
            updateStars(0, "computer");}, 
        msAfterChoice.gameOverRestart
        );
}

function getComputerChoice() {
    return tools[Math.floor(Math.random() * numTools)];
}

function getWinnerOfRound(humanChoice, computerChoice) {
    if (humanChoice === computerChoice) { return "tie"; }
    
    const humanWinCases = ["paper-rock", "scissors-paper", "rock-scissors"];
    const currentCase = (humanChoice + "-" + computerChoice);
    for (const humanWinCase of humanWinCases) {
        if (currentCase === humanWinCase) {
            return "human";
        }
    }
    return "computer";
}

function isGameOver() {
    return Math.max(playerScores.human, playerScores.computer) === winScore;
}