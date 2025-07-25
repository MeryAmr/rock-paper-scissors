let gameData = {
    playerScore: 0,
    computerScore: 0,
    playerChoice: null,
    computerChoice: null,
    result: null
};

const choices = ['rock', 'paper', 'scissors'];

const colorMapping = {
    rock: 'red',
    paper: 'blue',
    scissors: 'yellow'
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - JS is working');
    loadGameState();
    const pageId = document.body.id;

    switch (pageId) {
        case 'home':
            console.log('Initializing main page');
            initializeMainPage();
            break;
        case 'result':
            console.log('Initializing result page');
            initializeResultPage();
            break;
        default:
            console.warn('Unknown page id:', pageId);
    }
});

function loadGameState() {
    const savedData = localStorage.getItem('rockPaperScissorsGame');
    if (savedData) {
        gameData = { ...gameData, ...JSON.parse(savedData) };
    }
    updateScoreDisplay();
}

function saveGameState() {
    localStorage.setItem('rockPaperScissorsGame', JSON.stringify(gameData));
}

function updateScoreDisplay() {
    const scoreElement = document.querySelector('.score');
    if (scoreElement) {
        scoreElement.textContent = `${gameData.playerScore} - ${gameData.computerScore}`;
    }
}

function initializeMainPage() {
    const choiceButtons = document.querySelectorAll('.choice');
    
    choiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const playerChoice = this.classList.contains('rock') ? 'rock' :
                               this.classList.contains('paper') ? 'paper' : 'scissors';
            console.log(`Player clicked: ${playerChoice} (coming from JS)`);
            playGame(playerChoice);
        });
    });

    const rulesBtn = document.querySelector('.rules-btn');
    if (rulesBtn) {
        rulesBtn.addEventListener('click', () => {
            console.log('Rules button clicked (coming from JS)');
            showRules();
        });
    }
}

function initializeResultPage() {
    displayGameResult();

    const rulesBtn = document.querySelector('.rules-btn');
    if (rulesBtn) {
        rulesBtn.addEventListener('click', () => {
            console.log('Rules button clicked (coming from JS)');
            showRules();
        });
    }

    const playAgainBtn = document.querySelector('.result-text button:not(.reset-btn)');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            console.log('Play Again button clicked (coming from JS)');
            window.location.href = 'index.html';
        });
    }

    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log('Reset button clicked (coming from JS)');
            resetGame();
            updateScoreDisplay();
        });
    }
}

function playGame(playerChoice) {
    gameData.playerChoice = playerChoice;
    gameData.computerChoice = getComputerChoice();
    gameData.result = determineWinner(gameData.playerChoice, gameData.computerChoice);

    if (gameData.result === 'win') {
        gameData.playerScore++;
    } else if (gameData.result === 'lose') {
        gameData.computerScore++;
    }

    console.log(`Game result: ${gameData.result}, Player: ${gameData.playerChoice}, Computer: ${gameData.computerChoice}`);

    saveGameState();
    window.location.href = 'result.html';
}

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }

    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };

    return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
}

function displayGameResult() {
    if (!gameData.playerChoice || !gameData.computerChoice) {
        window.location.href = 'index.html';
        return;
    }

    const playerChoiceContainer = document.querySelector('.choice.left');
    const playerIconCircle = playerChoiceContainer.querySelector('.icon-circle');
    const playerImage = playerIconCircle.querySelector('img');

    const computerChoiceContainer = document.querySelector('.choice.right');
    const computerIconCircle = computerChoiceContainer.querySelector('.icon-circle');
    const computerImage = computerIconCircle.querySelector('img');

    playerImage.src = `Assets/images/${gameData.playerChoice}.png`;
    playerImage.alt = `You picked ${gameData.playerChoice}`;

    computerImage.src = `Assets/images/${gameData.computerChoice}.png`;
    computerImage.alt = `Computer picked ${gameData.computerChoice}`;

    playerIconCircle.className = `icon-circle ${colorMapping[gameData.playerChoice]}`;
    computerIconCircle.className = `icon-circle ${colorMapping[gameData.computerChoice]}`;

    const resultText = document.querySelector('.result-text h1');
    switch (gameData.result) {
        case 'win':
            resultText.textContent = 'YOU WIN';
            break;
        case 'lose':
            resultText.textContent = 'YOU LOSE';
            break;
        case 'tie':
            resultText.textContent = "IT'S A TIE";
            break;
    }

    updateScoreDisplay();
}

function showRules() {
    const rulesText = `
RULES:

Rock beats Scissors
Paper beats Rock
Scissors beats Paper
DO NOT CHEAT ELSE I, THE DEVELOPER, WILL HUNT YOU DOWN MYSELF AND SEND YOUR PROJECTS TO THE GOOGLE GRAVEYARD
Score format: Your Score - Computer Score
Both player and computer get 1 point for each win.
Ties don't affect either score.

Good luck!
    `;
    alert(rulesText.trim());
}

function resetGame() {
    gameData = {
        playerScore: 0,
        computerScore: 0,
        playerChoice: null,
        computerChoice: null,
        result: null
    };
    saveGameState();
    updateScoreDisplay();
}
