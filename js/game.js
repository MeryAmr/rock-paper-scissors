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
    loadGameState();
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initializeMainPage();
    } else if (window.location.pathname.includes('result.html')) {
        initializeResultPage();
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
            
            playGame(playerChoice);
        });
    });
    
    const rulesBtn = document.querySelector('.rules-btn');
    if (rulesBtn) {
        rulesBtn.addEventListener('click', showRules);
    }
}

function initializeResultPage() {
    displayGameResult();
    
    const rulesBtn = document.querySelector('.rules-btn');
    if (rulesBtn) {
        rulesBtn.addEventListener('click', showRules);
    }
    
    const playAgainBtn = document.querySelector('.result-text button:not(.reset-btn)');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }

    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
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
    
    saveGameState();
    window.location.href = 'pages/result.html';
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
        window.location.href = '../index.html';
        return;
    }
    
    const playerChoiceContainer = document.querySelector('.choice.left');
    const playerIconCircle = playerChoiceContainer.querySelector('.icon-circle');
    const playerImage = playerIconCircle.querySelector('img');
    
    const computerChoiceContainer = document.querySelector('.choice.right');
    const computerIconCircle = computerChoiceContainer.querySelector('.icon-circle');
    const computerImage = computerIconCircle.querySelector('img');
    
    playerImage.src = `../Assets/images/${gameData.playerChoice}.png`;
    playerImage.alt = `You picked ${gameData.playerChoice}`;
    
    computerImage.src = `../Assets/images/${gameData.computerChoice}.png`;
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