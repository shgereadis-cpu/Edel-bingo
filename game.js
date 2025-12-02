// game.js (ለአንድ ጊዜ የካርድ ዳታ ማውጣት ብቻ - JSON Box ከላይ እንዲሆን ተስተካክሏል)

const CARD_SIZE = 5; 
const LETTERS = ['B', 'I', 'N', 'G', 'O'];
// ለየቢንጎ ፊደል ክልሎች
const RANGES = {
    'B': [1, 15],
    'I': [16, 30],
    'N': [31, 45],
    'G': [46, 60],
    'O': [61, 75]
};

const masterGridElement = document.getElementById('master-grid');
const playerCardElement = document.getElementById('player-bingo-card');
const calledNumberDisplay = document.getElementById('called-number-display'); 
const calledHistoryArea = document.getElementById('called-history');
const bingoButton = document.getElementById('central-bingo-btn');
const cardIdDisplay = document.getElementById('card-id'); 

let calledNumbers = [];
let gameInterval;
const MAX_HISTORY_CHIPS = 10; 

// ቋሚ የ100 ካርዶች መረጃ የሚቀመጥበት ቦታ (Global Pool)
let STATIC_CARD_POOL = {};
const TOTAL_CARDS_TO_GENERATE = 100;

/**
 * በቢንጎ ደንብ መሰረት አንድ ልዩ ካርድ ያመነጫል
 */
function generateUniqueCard() {
    const cardData = {};
    
    LETTERS.forEach(letter => {
        const [min, max] = RANGES[letter];
        const rangeSize = max - min + 1;
        const columnNumbers = [];
        
        while (columnNumbers.length < CARD_SIZE) {
            const randomNumber = Math.floor(Math.random() * rangeSize) + min;
            if (!columnNumbers.includes(randomNumber)) {
                columnNumbers.push(randomNumber);
            }
        }
        cardData[letter] = columnNumbers.sort((a, b) => a - b); 
    });
    
    cardData['N'][Math.floor(CARD_SIZE / 2)] = 'FREE'; 
    
    return cardData;
}

/**
 * 100 ፍጹም የተለያየ የቢንጎ ካርዶችን ያመነጫል
 */
function generateStaticCardPool(count) {
    const cardPool = {};
    const cardHashStorage = new Set(); 
    let attempts = 0;
    
    while (Object.keys(cardPool).length < count && attempts < count * 20) {
        const newCardData = generateUniqueCard();
        const cardHash = JSON.stringify(newCardData);
        
        if (!cardHashStorage.has(cardHash)) {
            const cardId = Object.keys(cardPool).length + 1; 
            cardPool[`card-${cardId}`] = newCardData;
            cardHashStorage.add(cardHash);
        }
        attempts++;
    }

    if (Object.keys(cardPool).length < count) {
        console.error(`Could not generate ${count} unique cards.`);
    }

    return cardPool;
}

// ----------------------------------------------------
// የጨዋታው ቀሪ ተግባራት (ለማውጣት ሲባል ለጊዜው አይጠሩም)
// ----------------------------------------------------
function renderMasterGrid() {/* ... */}
function renderPlayerCard(cardId) {/* ... */}
function toggleMark(cell) {/* ... */}
function getBingoLabel(number) {/* ... */}
function callNumber() {/* ... */}
function checkBingo() {/* ... */}
function startGameLoop() {/* ... */}


// ገጹ ሲከፈት ሁሉንም ማስጀመር
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 100 ቋሚ እና ልዩ የቢንጎ ካርዶችን መፍጠር
    STATIC_CARD_POOL = generateStaticCardPool(TOTAL_CARDS_TO_GENERATE);
    
    // !!! JSON ዳታውን በስክሪን ላይ እንዲታይ እና በቀላሉ ኮፒ እንዲደረግ ማድረግ !!!
    const cardDataString = JSON.stringify(STATIC_CARD_POOL);
    
    // አዲስ textarea ኤለመንት መፍጠር
    const debugOutput = document.createElement('textarea');
    debugOutput.id = 'static-card-data';
    debugOutput.style.width = '95%';
    debugOutput.style.height = '400px';
    debugOutput.style.margin = '10px auto';
    debugOutput.style.display = 'block';
    debugOutput.style.backgroundColor = '#1e1e1e';
    debugOutput.style.color = '#00ff7f'; // Neon Green
    debugOutput.style.border = '2px solid #00ff7f';
    debugOutput.style.fontSize = '10px';
    debugOutput.textContent = cardDataString;
    
    // ይህንን ኤለመንት ከዋናው main-wrapper በፊት በማስገባት ከላይ እንዲታይ ማድረግ
    const mainWrapper = document.querySelector('.main-wrapper');
    if (mainWrapper) {
        mainWrapper.parentNode.insertBefore(debugOutput, mainWrapper);
        mainWrapper.style.display = 'none'; // የጨዋታውን UI ለጊዜው ደብቅ
    } else {
        document.body.appendChild(debugOutput);
    }
    
    console.log("STATIC_CARD_POOL DATA: (በስክሪኑ ላይ ይታያል)", cardDataString);
    // !!! እባክዎ በስክሪኑ ላይ የሚታየውን ሙሉ ጽሑፍ ኮፒ ያድርጉ !!!
    
    // የቴሌግራም ዌብ አፕ ዝግጁ እንዲሆን
    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
    }
});
