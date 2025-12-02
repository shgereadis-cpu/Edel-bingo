// =========================================================
// I. ግሎባል ተለዋዋጮች እና የመጀመሪያ ዝግጅቶች
// =========================================================

const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];
const CARD_SELECTION_TIME = 60; // 60 ሰከንድ
let currentCardSelectionTimer = null;

let calledNumbers = [];
let availableNumbers = [];
let numberCallInterval = null;
let selectedCardId = null;
let selectedCardData = null; // የተመረጠው ካርድ 5x5 አሬይ ዳታ
let allGeneratedCards = {}; 
let isRoundInProgress = false; // አዲስ ዙር እየተጫወተ መሆኑን የሚጠቁም

// የHTML ኤለመንቶች ማጣቀሻዎች
// ... (ያለፈው ኮድ)
const lobbyScreen = document.getElementById('lobby-screen');
const cardSelectionScreen = document.getElementById('card-selection-screen');
const activeGameScreen = document.getElementById('active-game-screen');
const joinBtn = document.getElementById('join-btn');
const startGameBtn = document.getElementById('start-game-btn');
const backToLobbyBtn = document.getElementById('back-to-lobby-btn');
const bingoBtn = document.getElementById('bingo-btn');
const exitBtn = document.getElementById('exit-btn');
const cardListDiv = document.getElementById('card-list');
const cardGridBody = document.getElementById('bingo-card-grid');
const currentCallDisplay = document.getElementById('current-call');
const recentCallsList = document.getElementById('recent-calls-list');

// አዲስ ኤለመንት ለጊዜ ቆጣሪ
const timerDisplay = document.createElement('h3');
timerDisplay.id = 'timer-display';
timerDisplay.style.color = '#e74c3c';
cardSelectionScreen.prepend(timerDisplay);


// =========================================================
// II. የካርድ ማመንጨት እና ምርጫ (Dynamic Card Generation)
// =========================================================

function getRandomNumbers(min, max) {
    const range = [];
    for (let i = min; i <= max; i++) {
        range.push(i);
    }
    range.sort(() => 0.5 - Math.random());
    return range.slice(0, 5);
}

function generateBingoCard() {
    // ... (የ generateBingoCard ተግባር ሳይቀየር ይቀጥላል)
    const card = {
        B: getRandomNumbers(1, 15),
        I: getRandomNumbers(16, 30),
        N: getRandomNumbers(31, 45),
        G: getRandomNumbers(46, 60),
        O: getRandomNumbers(61, 75)
    };
    
    const structuredCardGrid = [[], [], [], [], []];
    const columns = ['B', 'I', 'N', 'G', 'O'];

    for (let r = 0; r < 5; r++) {
        columns.forEach((col, c) => {
            let cellData;
            if (col === 'N' && r === 2) {
                cellData = { value: 'FREE', marked: true, isFree: true };
            } else {
                const number = card[col].shift();
                cellData = { value: number, marked: false };
            }
            structuredCardGrid[r][c] = cellData;
        });
    }
    return structuredCardGrid;
}

function loadDynamicCards(numCards = 100) {
    cardListDiv.innerHTML = 'ካርዶች እየተፈጠሩ ነው...';
    allGeneratedCards = {};
    selectedCardId = null;
    startGameBtn.disabled = true;

    for (let i = 1; i <= numCards; i++) {
        const cardData = generateBingoCard();
        allGeneratedCards[i] = cardData;

        const cardEl = document.createElement('div');
        cardEl.className = 'mock-bingo-card';
        cardEl.id = `card-${i}`;

        let numberText = '';
        BINGO_LETTERS.forEach((letter, c) => {
             const sampleNumbers = cardData.map(row => row[c].value).filter(v => typeof v === 'number').slice(0, 3).join(', ');
             numberText += `${letter}: ${sampleNumbers} | `;
        });

        cardEl.innerHTML = `
            <h4>ካርድ #${i}</h4>
            <p>${numberText.substring(0, 60)}...</p>
        `;
        
        cardEl.addEventListener('click', () => {
            selectCard(cardEl, i, cardData);
        });

        cardListDiv.appendChild(cardEl);
    }
}

function selectCard(cardElement, cardId, cardData) {
    document.querySelectorAll('.mock-bingo-card').forEach(card => {
        card.classList.remove('selected');
    });

    cardElement.classList.add('selected');
    selectedCardId = cardId;
    selectedCardData = cardData;
    startGameBtn.disabled = false;
    document.getElementById('timer-display').textContent = `Card #${cardId} Selected. Waiting for game start...`;
    
    // ካርድ ሲመረጥም ጊዜ ቆጣሪው ይቀጥላል
}

// =========================================================
// III. የጊዜ አያያዝ እና ፍሰት (Timer and Flow Management)
// =========================================================

function startCardSelectionTimer() {
    let timeLeft = CARD_SELECTION_TIME;
    timerDisplay.textContent = `የካርድ መምረጫ ጊዜ: ${timeLeft} ሰከንድ`;
    
    if (currentCardSelectionTimer) clearInterval(currentCardSelectionTimer);

    currentCardSelectionTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `የካርድ መምረጫ ጊዜ: ${timeLeft} ሰከንድ`;
        
        if (timeLeft <= 0) {
            clearInterval(currentCardSelectionTimer);
            currentCardSelectionTimer = null;
            
            // ሁሉም ተጫዋቾች እንዲጀምሩ የሚያደርግ የጋራ ተግባር
            if (selectedCardData) {
                // ካርድ የመረጡ ተጫዋቾች ወዲያውኑ ወደ ጨዋታው ይገባሉ
                showScreen(activeGameScreen);
                startGame();
            } else {
                // ካርድ ያልመረጡ ተጫዋቾች ወደ ሎቢው ይመለሳሉ
                alert("ምንም ካርድ አልመረጡም! ወደ ሎቢው ተመልሰዋል።");
                showScreen(lobbyScreen);
            }
        }
    }, 1000);
}

function startGame() {
    // ዳግም ማስጀመር
    calledNumbers = [];
    availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    document.getElementById('recent-calls-list').innerHTML = '';
    bingoBtn.disabled = false; // ቢንጎ ቁልፍን ማንቃት

    if (numberCallInterval) clearInterval(numberCallInterval);
    
    populatePlayerCard(selectedCardId, selectedCardData);

    currentCallDisplay.textContent = 'ጨዋታው ተጀምሯል! ቁጥሮች በራስ-ሰር ይጠራሉ...';
    document.getElementById('connection-status').textContent = 'Game Round Active';
    
    isRoundInProgress = true;
    
    // ማዕከላዊው ስርዓት ቁጥሩን በየ 4 ሰከንዱ መጥራት ይጀምራል
    numberCallInterval = setInterval(callNextNumber, 4000); 
}

// ... (callNextNumber, populatePlayerCard, createCallBoard, markPlayerCell, checkBingo ተግባራት ሳይቀየሩ ይቀጥላሉ)
// ... (callNextNumber, populatePlayerCard, createCallBoard, markPlayerCell, checkBingo ተግባራት ሳይቀየሩ ይቀጥላሉ)
function populatePlayerCard(cardId, cardData) {
    document.getElementById('card-number').textContent = cardId;
    cardGridBody.innerHTML = '';

    cardData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cellData, colIndex) => {
            const td = document.createElement('td');
            td.textContent = cellData.value;
            td.cellData = cellData;

            if (cellData.isFree) {
                td.classList.add('free-space', 'marked');
            } else {
                td.addEventListener('click', () => markPlayerCell(td, cellData));
            }

            let letter = BINGO_LETTERS[colIndex];
            td.id = `cell-${letter}-${cellData.value}`;

            if (cellData.marked && !cellData.isFree) {
                 td.classList.add('marked');
            }
            
            tr.appendChild(td);
        });
        cardGridBody.appendChild(tr);
    });
}
function createCallBoard() {
    const callBoard = document.getElementById('call-board');
    let grid = callBoard.querySelector('.call-board-grid');
    if (grid) { // ዳግም እንዳይፈጠር መፈተሽ
        grid.innerHTML = '';
    } else {
        grid = document.createElement('div');
        grid.className = 'call-board-grid';
        callBoard.appendChild(grid);
    }
    
    for (let i = 1; i <= 75; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.textContent = i;
        let letter = BINGO_LETTERS[Math.floor((i - 1) / 15)];
        numberDiv.className = 'call-number';
        numberDiv.id = `call-num-${letter}-${i}`;
        grid.appendChild(numberDiv);
    }
}
function markPlayerCell(cellElement, cellData) {
    const num = cellData.value;
    if (!calledNumbers.includes(num)) {
        alert(`ቁጥር ${num} ገና አልተጠራም!`);
        return;
    }
    cellData.marked = !cellData.marked;
    cellElement.classList.toggle('marked', cellData.marked);
    console.log(`ካርድ ላይ ያለ ቁጥር ${num} ተለወጠ።`);
}
function checkBingo() {
    if (!selectedCardData || selectedCardData.length === 0) return false;
    const BINGO_SIZE = 5;
    const isMarked = (r, c) => selectedCardData[r][c].marked; 

    for (let r = 0; r < BINGO_SIZE; r++) { if (selectedCardData[r].every((_, c) => isMarked(r, c))) return true; }
    for (let c = 0; c < BINGO_SIZE; c++) { if (selectedCardData.every((_, r) => isMarked(r, c))) return true; }
    if (Array.from({ length: BINGO_SIZE }, (_, i) => i).every(i => isMarked(i, i))) return true;
    if (Array.from({ length: BINGO_SIZE }, (_, i) => i).every(i => isMarked(i, BINGO_SIZE - 1 - i))) return true;

    return false;
}
function callNextNumber() {
    if (!isRoundInProgress) {
        clearInterval(numberCallInterval);
        return;
    }

    if (availableNumbers.length === 0) {
        endGame(false, "ሁሉም ቁጥሮች ተጠርተዋል! ማንም አላሸነፈም።");
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const calledNum = availableNumbers.splice(randomIndex, 1)[0];
    calledNumbers.push(calledNum);
    
    let letter = BINGO_LETTERS[Math.floor((calledNum - 1) / 15)];
    const callText = `${letter}-${calledNum}`;

    currentCallDisplay.textContent = callText;

    const callBoardCell = document.getElementById(`call-num-${letter}-${calledNum}`);
    if (callBoardCell) {
        callBoardCell.classList.add('called');
    }

    const li = document.createElement('li');
    li.textContent = callText;
    recentCallsList.prepend(li);
}
// ... (የቀረው ኮድ)

/** የጨዋታውን ዙር ይዘጋል */
function endGame(isWinner, message) {
    if (numberCallInterval) clearInterval(numberCallInterval);
    isRoundInProgress = false;
    bingoBtn.disabled = true; // ተጨማሪ ቢንጎ ጥሪዎችን መከልከል
    
    document.getElementById('connection-status').textContent = isWinner ? 'Winner Declared!' : 'Round Ended';
    
    if (isWinner) {
        alert(`🏆🏆🏆 አሸናፊነት ተረጋግጧል! ካርድ #${selectedCardId} አሸንፏል።`);
    } else {
        alert(`😞 ${message}`);
    }
    
    // ከ 5 ሰከንድ በኋላ ወደ ካርድ መምረጫ ክፍል ይመልሳል
    setTimeout(() => {
        showScreen(cardSelectionScreen);
        loadDynamicCards(100); // አዲስ ዙር ለመጀመር
        startCardSelectionTimer(); // አዲስ ሰአት ቆጣሪ ይጀምራል
    }, 5000); 
}

function handleBingoClick() {
    if (!isRoundInProgress) {
        alert("ጨዋታው ገና አልተጀመረም ወይም አብቅቷል።");
        return;
    }
    
    if (checkBingo()) {
        // የራስዎ ካርድ አሸናፊ መሆኑን ማረጋገጥ
        endGame(true, "በቅፅበት ተረጋግጧል!");
    } else {
        alert('❌ ቢንጎ አልተሞላም! መጫወትዎን ይቀጥሉ.');
    }
}


// =========================================================
// IX. የፕሮግራም ማስጀመሪያ
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    createCallBoard();

    // የክስተት አድማጮችን ማያያዝ
    joinBtn.addEventListener('click', () => {
        showScreen(cardSelectionScreen);
        loadDynamicCards(100);
        startCardSelectionTimer(); // ጊዜ ቆጣሪውን መጀመር
        startGameBtn.disabled = true; // ካርድ ሳይመርጡ መጀመር አይቻልም
    });

    // startGameBtn አዝራር አሁን ቆጣሪው ሲያልቅ በሚሰራው ተግባር ውስጥ ነው ያለው
    // ነገር ግን ለተጫዋች ምቹነት ካርድ ከመረጡ በኋላ ቢጫኑት ወደ ጨዋታው እንዲገቡ እናደርጋለን
    startGameBtn.addEventListener('click', () => {
        if (selectedCardId) {
            // ቆጣሪው እንዳይጠብቅ እና ወዲያውኑ ወደ ጨዋታው እንዲገባ
            if (currentCardSelectionTimer) {
                clearInterval(currentCardSelectionTimer);
                currentCardSelectionTimer = null;
            }
            showScreen(activeGameScreen);
            startGame();
        } else {
            alert("እባክዎ መጀመሪያ ካርድ ይምረጡ!");
        }
    });

    bingoBtn.addEventListener('click', handleBingoClick);
    
    // Exit ሲጫን ወደ ሎቢው መመለስ
    exitBtn.addEventListener('click', () => {
         if (numberCallInterval) clearInterval(numberCallInterval);
         if (currentCardSelectionTimer) clearInterval(currentCardSelectionTimer);
         showScreen(lobbyScreen);
         alert('ከጨዋታው ወጥተዋል!');
    });
    
    backToLobbyBtn.addEventListener('click', () => {
        if (currentCardSelectionTimer) clearInterval(currentCardSelectionTimer);
        showScreen(lobbyScreen);
    });

    showScreen(lobbyScreen);
});
