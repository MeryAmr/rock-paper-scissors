// Initial game state
let gameData = {
    playerScore: 0,
    computerScore: 0,
    playerChoice: null,
    computerChoice: null,
    result: null
};

// Choices available in the game
const choices = ['rock', 'paper', 'scissors'];

// Color mapping for UI feedback
const colorMapping = {
    rock: 'red',
    paper: 'blue',
    scissors: 'yellow'
};

// When the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded. Running init.');
    loadGameState();

    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        console.log('Initializing main page...');
        initializeMainPage();
    } else if (window.location.pathname.includes('result.html')) {
        console.log('Initializing result page...');
        initializeResultPage();
    }
});

// Load saved game state from localStorage
function loadGameState() {
    const savedData = localStorage.getItem('rockPaperScissorsGame');
    if (savedData) {
        gameData = { ...gameData, ...JSON.parse(savedData) };
        console.log('Loaded game state:', gameData);
    }
    updateScoreDisplay();
}

// Save current game state to localStorage
function saveGameState() {
    localStorage.setItem('rockPaperScissorsGame', JSON.stringify(gameData));
    console.log('Game state saved:', gameData);
}

// Display updated score
function updateScoreDisplay() {
    const scoreElement = document.querySelector('.score');
    if (scoreElement) {
        scoreElement.textContent = `${gameData.playerScore} - ${gameData.computerScore}`;
        console.log('Score displayed:', scoreElement.textContent);
    }
}

// Attach event listeners on index.html
function initializeMainPage() {
    const choiceButtons = document.querySelectorAll('.choice');

    choiceButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Determine player's choice based on button's class
            const playerChoice = this.classList.contains('rock') ? 'rock' :
                               this.classList.contains('paper') ? 'paper' : 'scissors';

            console.log(`Player clicked: ${playerChoice} (coming from JS)`);

            playGame(playerChoice);
        });
    });

    // Show rules button
    const rulesBtn = document.querySelector('.rules-btn');
    if (rulesBtn) {
        rulesBtn.addEventListener('click', showRules);
        console.log('Rules button listener added');
    }
}

// Attach event listeners on result.html
function initializeResultPage() {
    displayGameResult();

    const rulesBtn = document.querySelector('.rules-btn');
    if (rulesBtn) {
        rulesBtn.addEventListener('click', showRules);
        console.log('Rules button on result page activated');
    }

    const playAgainBtn = document.querySelector('.result-text button:not(.reset-btn)');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            console.log('Play Again clicked (coming from JS)');
            window.location.href = '../index.html';
        });
    }

    const resetBtn = document.querySelector('.reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log('Reset Game clicked (coming from JS)');
            resetGame();
            updateScoreDisplay();
        });
    }
}

// Start a new game round
function playGame(playerChoice) {
    gameData.playerChoice = playerChoice;
    gameData.computerChoice = getComputerChoice();
    gameData.result = determineWinner(gameData.playerChoice, gameData.computerChoice);

    console.log(`Player: ${gameData.playerChoice}, Computer: ${gameData.computerChoice}, Result: ${gameData.result}`);

    if (gameData.result === 'win') {
        gameData.playerScore++;
    } else if (gameData.result === 'lose') {
        gameData.computerScore++;
    }

    saveGameState();

    // Go to result page
    window.location.href = 'pages/result.html';
}

// Generate random computer choice
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Determine the game result
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

// Show game result on result.html
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

    console.log('Result page loaded with:', gameData.result);
    updateScoreDisplay();
}

// Show alert with rules
function showRules() {
    const rulesText = `
RULES:

Rock beats Scissors
Paper beats Rock
Scissors beats Paper

DO NOT CHEAT OR I WILL PERSONALLY DELETE YOUR PROJECTS

Score format: Your Score - Computer Score
Each win adds 1 point to the winner.

Good luck!
    `;
    alert(rulesText.trim());
}

// Reset the game entirely
function resetGame() {
    gameData = {
        playerScore: 0,
        computerScore: 0,
        playerChoice: null,
        computerChoice: null,
        result: null
    };
    console.log('Game reset');
    saveGameState();
    updateScoreDisplay();
}
