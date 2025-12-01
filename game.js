// game.js (FULL - Master Grid Fix እና Display Fixes)

const CARD_SIZE = 5; 
const LETTERS = ['B', 'I', 'N', 'G', 'O'];

const masterGridElement = document.getElementById('master-grid');
const playerCardElement = document.getElementById('player-bingo-card');
// ማስተካከያ 1: በትክክለኛው ID ('called-number-display') እንጠራዋለን
const calledNumberDisplay = document.getElementById('called-number-display'); 
const calledHistoryArea = document.getElementById('called-history');

// የጨዋታ ሁኔታን እና የተጠሩ ቁጥሮችን የሚይዝ ግሎባል ተለዋዋጮች
let calledNumbers = [];
let gameInterval;
const MAX_HISTORY_CHIPS = 10; 

// ቋሚ የቢንጎ ካርዶች ክምችት (Pool) - ለሙከራ
const STATIC_CARD_POOL = {
    'card-44': {
        'B': [5, 4, 15, 2, 3],
        'I': [17, 30, 29, 28, 26],
        'N': [37, 39, 'FREE', 36, 33],
        'G': [60, 54, 51, 48, 52],
        'O': [75, 73, 68, 62, 65]
    }
};

// 1. 75 ቁጥሮችን Master Grid ላይ የሚሞላ ተግባር (በአምድ ተስተካክሏል!)
function renderMasterGrid() {
    masterGridElement.innerHTML = '';
    
    for (let i = 0; i < 75; i++) {
        const rowIndex = i % 15;
        const colIndex = Math.floor(i / 15);
        
        // ትክክለኛው የቢንጎ ቁጥር ስሌት: (የረድፍ ቁጥር + 1) + (የአምድ መጀመሪያ ቁጥር)
        const number = (rowIndex + 1) + (colIndex * 15);

        const cell = document.createElement('div');
        cell.textContent = number;
        cell.classList.add('master-cell');
        cell.dataset.number = number;
        masterGridElement.appendChild(cell);
    }
}

// 2. የተጫዋቹን 5x5 ካርድ የሚጭን ተግባር
function renderPlayerCard(cardId) {
    const cardData = STATIC_CARD_POOL[cardId];
    if (!cardData) return;
    
    playerCardElement.innerHTML = '';
    
    LETTERS.forEach(letter => {
        const header = document.createElement('div');
        header.textContent = letter;
        header.classList.add('header');
        playerCardElement.appendChild(header);
    });

    for (let row = 0; row < CARD_SIZE; row++) {
        LETTERS.forEach(letter => {
            const cell = document.createElement('div');
            const number = cardData[letter][row];
            
            cell.textContent = number;
            cell.classList.add('cell');

            if (number === 'FREE') {
                cell.classList.add('free-space', 'marked');
            } else {
                cell.dataset.number = number;
                cell.dataset.letter = letter; 
                cell.addEventListener('click', () => toggleMark(cell)); 
            }
            playerCardElement.appendChild(cell);
        });
    }
}

// 3. በተጫዋች ካርድ ላይ ምልክት (Mark) ለማድረግ
function toggleMark(cell) {
    const num = parseInt(cell.dataset.number);
    if (calledNumbers.includes(num)) {
        cell.classList.toggle('marked');
    }
}

// 4. ቁጥሮችን በቢንጎ ደንብ የሚመድብ ተግባር 
function getBingoLabel(number) {
    if (number >= 1 && number <= 15) return 'B';
    if (number >= 16 && number <= 30) return 'I';
    if (number >= 31 && number <= 45) return 'N';
    if (number >= 46 && number <= 60) return 'G';
    if (number >= 61 && number <= 75) return 'O';
    return '';
}

// 5. ቁጥር የመጥራት ተግባር
function callNumber() {
    let newNumber;
    
    do {
        newNumber = Math.floor(Math.random() * 75) + 1; 
    } while (calledNumbers.includes(newNumber) && calledNumbers.length < 75);

    if (calledNumbers.length === 75) {
        clearInterval(gameInterval);
        calledNumberDisplay.textContent = 'GAME OVER';
        return;
    }

    const label = getBingoLabel(newNumber);
    const labeledNumber = `${label}-${newNumber}`;

    calledNumbers.push(newNumber);
    
    // Master Grid ላይ ምልክት አድርግ
    const masterCell = document.querySelector(`.master-cell[data-number="${newNumber}"]`);
    if (masterCell) {
        masterCell.classList.add('called');
    }
    
    // ማስተካከያ 2: የአሁኑን ቁጥር በትክክል አሳይ
    calledNumberDisplay.textContent = labeledNumber; 
    
    // ታሪክ ውስጥ መዝግብ (History Chip)
    const historyChip = document.createElement('span');
    historyChip.textContent = labeledNumber;
    historyChip.classList.add('history-chip', label);
    
    calledHistoryArea.prepend(historyChip);

    // የቺፖችን ብዛት ተቆጣጠር
    if (calledHistoryArea.children.length > MAX_HISTORY_CHIPS) {
        calledHistoryArea.removeChild(calledHistoryArea.lastChild);
    }
}

// 6. የጨዋታውን ቆጣሪ ማስጀመር
function startGameLoop() {
    if (gameInterval) clearInterval(gameInterval);
    
    // በየ 3 ሰከንዱ ቁጥር ይጠራ
    gameInterval = setInterval(callNumber, 3000); 
}


// ገጹ ሲከፈት ሁለቱንም ግሪዶች ማስጀመር
document.addEventListener('DOMContentLoaded', () => {
    renderMasterGrid();
    renderPlayerCard('card-44'); 

    startGameLoop(); 

    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
    }
    
    document.getElementById('exit-btn').addEventListener('click', () => {
        if (gameInterval) clearInterval(gameInterval); 
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.close();
        }
    });

    document.getElementById('refresh-btn').addEventListener('click', () => {
        if (gameInterval) clearInterval(gameInterval); 
        window.location.reload();
    });

    document.getElementById('central-bingo-btn').addEventListener('click', () => {
        if (gameInterval) clearInterval(gameInterval); 
        alert('Bingo button clicked. Checking card... (Logic to be implemented)');
    });
});
