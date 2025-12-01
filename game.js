// game.js (ሙሉ እና የተሻሻለ - የቁጥር ጥሪ Logic ታክሏል)

const CARD_SIZE = 5; 
const LETTERS = ['B', 'I', 'N', 'G', 'O'];

const masterGridElement = document.getElementById('master-grid');
const playerCardElement = document.getElementById('player-bingo-card');
const calledNumberDisplay = document.getElementById('called-number-circle'); // የተጠራውን ክብ ማሳያ
const calledHistoryArea = document.getElementById('called-history');

// የጨዋታ ሁኔታን እና የተጠሩ ቁጥሮችን የሚይዝ ግሎባል ተለዋዋጮች
let calledNumbers = [];
let gameInterval;
const MAX_HISTORY_CHIPS = 10; // በታሪክ ላይ የሚታዩት ከፍተኛው የቺፕስ ብዛት

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

// 1. 75 ቁጥሮችን Master Grid ላይ የሚሞላ ተግባር
function renderMasterGrid() {
    masterGridElement.innerHTML = '';
    for (let i = 1; i <= 75; i++) {
        const cell = document.createElement('div');
        cell.textContent = i;
        cell.classList.add('master-cell');
        cell.dataset.number = i;
        masterGridElement.appendChild(cell);
    }
}

// 2. የተጫዋቹን 5x5 ካርድ የሚጭን ተግባር
function renderPlayerCard(cardId) {
    const cardData = STATIC_CARD_POOL[cardId];
    if (!cardData) return;
    
    playerCardElement.innerHTML = '';
    
    // ፊደሎቹን (Headers) ማሳየት
    LETTERS.forEach(letter => {
        const header = document.createElement('div');
        header.textContent = letter;
        header.classList.add('header');
        playerCardElement.appendChild(header);
    });

    // ቁጥሮችን መሙላት
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
                // የተጫዋቹ ካርድ ላይ ቁጥር ማርክ የማድረግ ሎጂክ
                cell.addEventListener('click', () => toggleMark(cell)); 
            }
            playerCardElement.appendChild(cell);
        });
    }
}

// 3. በተጫዋች ካርድ ላይ ምልክት (Mark) ለማድረግ
function toggleMark(cell) {
    const num = parseInt(cell.dataset.number);

    // ቁጥሩ ከተጠራ ብቻ ምልክት እንዲደረግ መፍቀድ
    if (calledNumbers.includes(num)) {
        cell.classList.toggle('marked');
    } else {
        // ቁጥሩ እስኪጠራ መጠበቅ እንዳለበት ማስጠንቀቂያ
        // alert(`ቁጥር ${num} እስካሁን አልተጠራም!`); // ይህንን መልእክት አጠፋን
    }
}

// 4. ቁጥሮችን በቢንጎ ደንብ የሚመድብ ተግባር (1-15:B, 16-30:I, etc.)
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
    
    // እስካሁን ያልተጠራ ቁጥር በዘፈቀደ መምረጥ
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

    // ቁጥሩን መዝግብ
    calledNumbers.push(newNumber);
    
    // Master Grid ላይ ምልክት አድርግ
    const masterCell = document.querySelector(`.master-cell[data-number="${newNumber}"]`);
    if (masterCell) {
        masterCell.classList.add('called');
    }
    
    // የአሁኑን ቁጥር አሳይ
    calledNumberDisplay.textContent = labeledNumber;
    
    // ታሪክ ውስጥ መዝግብ (History Chip)
    const historyChip = document.createElement('span');
    historyChip.textContent = labeledNumber;
    historyChip.classList.add('history-chip', label);
    
    // አዲሱን ቺፕ መጀመሪያ ላይ ጨምር
    calledHistoryArea.prepend(historyChip);

    // የቺፖችን ብዛት ተቆጣጠር
    if (calledHistoryArea.children.length > MAX_HISTORY_CHIPS) {
        calledHistoryArea.removeChild(calledHistoryArea.lastChild);
    }
    
    // Player Card ላይ አውቶማቲክ ማርክ ማድረግ (አዲስ ሎጂክ - አማራጭ)
    const playerCells = document.querySelectorAll(`.cell[data-number="${newNumber}"]`);
    playerCells.forEach(cell => {
        // ቁጥሩ ከተጠራ በኋላ ተጫዋቹ ራሱ እንዲማርክ ይደረጋል (ለማለት ያህል)
        // ወይም እዚህ ላይ cell.classList.add('called-match'); የሚል ሌላ ስታይል መጨመር ይቻላል
    });
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
    renderPlayerCard('card-44'); // ለሙከራ card-44 ን እንጭናለን

    // ጨዋታውን ወዲያውኑ ጀምር
    startGameLoop(); 

    // የ Telegram WebAppን ማስጀመር (Exit button ን ለመጠቀም)
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
    }
    
    // ለ Exit አዝራር ክሊክ ሎጅክ
    document.getElementById('exit-btn').addEventListener('click', () => {
        if (gameInterval) clearInterval(gameInterval); // ቆጣሪውን አስቁም
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.close();
        }
    });

    // ለ Refresh አዝራር
    document.getElementById('refresh-btn').addEventListener('click', () => {
        if (gameInterval) clearInterval(gameInterval); // ቆጣሪውን አስቁም
        // alert('Data refreshing...'); // ለማሳየት
        window.location.reload();
    });

    // ለ BINGO አዝራር
    document.getElementById('central-bingo-btn').addEventListener('click', () => {
        if (gameInterval) clearInterval(gameInterval); // ቆጣሪውን አስቁም
        alert('Bingo button clicked. Checking card... (Logic to be implemented)');
        // እውነተኛ የቢንጎ ማረጋገጫ Logic እዚህ ጋር ይመጣል
    });
});
