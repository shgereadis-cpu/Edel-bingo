// game.js

const CARD_SIZE = 5; 
const LETTERS = ['B', 'I', 'N', 'G', 'O'];

const masterGridElement = document.getElementById('master-grid');
const playerCardElement = document.getElementById('player-bingo-card');

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
                cell.addEventListener('click', () => markNumber(cell));
            }
            playerCardElement.appendChild(cell);
        });
    }
}

// 3. ቁጥር ማርክ ሲደረግ የሚሰራ ተግባር
function markNumber(cell) {
    // ይህ ሎጂክ በኋላ በ Backend የተጠራ ቁጥር መሆኑን ያረጋግጣል
    cell.classList.toggle('marked'); 
}

// 4. ገጹ ሲከፈት ሁለቱንም ግሪዶች ማስጀመር
document.addEventListener('DOMContentLoaded', () => {
    renderMasterGrid();
    renderPlayerCard('card-44'); // ለሙከራ card-44 ን እንጭናለን

    // የ Telegram WebAppን ማስጀመር (Exit button ን ለመጠቀም)
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
    }
});