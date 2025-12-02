// =========================================================
// I. ግሎባል ተለዋዋጮች እና የመጀመሪያ ዝግጅቶች
// =========================================================

const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];
const CALL_INTERVAL_MS = 4000; // ቁጥር የሚጠራበት ፍጥነት (በ ሚሊ ሰከንድ)
const CARD_SELECTION_TIME = 60; // 60 ሰከንድ ለካርድ ምርጫ
const ROUND_END_PAUSE_MS = 5000; // 5 ሰከንድ አሸናፊውን ለማሳየት

// የገንዘብ አያያዝ ተለዋዋጮች
let walletBalance = 100; 
const stakeAmount = 10; 
const winPayout = 50; 

// የጨዋታ ሁኔታ ተለዋዋጮች
let calledNumbers = [];
let availableNumbers = [];
let numberCallInterval = null; 
let currentCardSelectionTimer = null;
let selectedCardId = null;
let selectedCardData = null; 
let allGeneratedCards = {}; 
let isRoundInProgress = false; 

// የHTML ኤለመንቶች ማጣቀሻዎች
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

// አዲስ ኤለመንት ለጊዜ ቆጣሪ (በHTML ውስጥ ስላልነበር እዚሁ ፈጠርነው)
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
    selectedCardData = null; // የድሮ ካርድ መረጃ ማፅዳት
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
    timerDisplay.textContent = `Card #${cardId} Selected. Waiting for game start... (${CARD_SELECTION_TIME} sec left)`;
}


// =========================================================
// III. የጨዋታ አፈፃፀም እና የገንዘብ አያያዝ
// =========================================================

function showScreen(screenToShow) {
    [lobbyScreen, cardSelectionScreen, activeGameScreen].forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });

    screenToShow.classList.remove('hidden');
    screenToShow.classList.add('active');
}

/** የ Wallet እና Stake ማሳያዎችን በUI ላይ ያዘምናል */
function updateWalletDisplay() {
    document.getElementById('wallet-balance').textContent = `Wallet: ${walletBalance} ETB`;
    document.getElementById('stake-amount').textContent = `Stake: ${stakeAmount} ETB`;
}

/** የካርድ ፍርግርግን በHTML ውስጥ መሙላት */
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

/** የጥሪ ሰሌዳውን መፍጠር (ከ1-75) */
function createCallBoard() {
    const callBoard = document.getElementById('call-board');
    let grid = callBoard.querySelector('.call-board-grid');
    if (grid) { 
        grid.innerHTML = ''; // ያለፉ ጥሪዎችን ለማፅዳት
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

/** ተጫዋቹ ቁጥር ሲነካ ምልክት ያደርጋል */
function markPlayerCell(cellElement, cellData) {
    const num = cellData.value;
    
    if (!calledNumbers.includes(num)) {
        alert(`ቁጥር ${num} ገና አልተጠራም!`);
        return;
    }
    
    cellData.marked = !cellData.marked;
    cellElement.classList.toggle('marked', cellData.marked);
}

// =========================================================
// IV. የጨዋታ ዑደት መቆጣጠሪያ (Game Loop Controllers)
// =========================================================

function startCardSelectionTimer() {
    let timeLeft = CARD_SELECTION_TIME;
    timerDisplay.textContent = `የካርድ መምረጫ ጊዜ: ${timeLeft} ሰከንድ`;
    
    if (currentCardSelectionTimer) clearInterval(currentCardSelectionTimer);

    currentCardSelectionTimer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `የካርድ መምረጫ ጊዜ: ${timeLeft} ሰከንድ`;
        
        if (selectedCardId) {
             timerDisplay.textContent = `Card #${selectedCardId} Selected. Time left: ${timeLeft} sec`;
        }

        if (timeLeft <= 0) {
            clearInterval(currentCardSelectionTimer);
            currentCardSelectionTimer = null;
            
            if (selectedCardData) {
                showScreen(activeGameScreen);
                startGame();
            } else {
                alert("ምንም ካርድ አልመረጡም! ወደ ሎቢው ተመልሰዋል።");
                showScreen(lobbyScreen);
            }
        }
    }, 1000);
}

function startGame() {
    // 1. የገንዘብ ማረጋገጫ እና ውርርድ
    if (walletBalance < stakeAmount) {
        alert("በቂ ገንዘብ የለዎትም! እባክዎ አካውንትዎን ይሙሉ።");
        showScreen(lobbyScreen);
        return;
    }
    
    walletBalance -= stakeAmount;
    updateWalletDisplay();
    
    // 2. ዳግም ማስጀመር
    calledNumbers = [];
    availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    recentCallsList.innerHTML = '';
    bingoBtn.disabled = false;
    if (numberCallInterval) clearInterval(numberCallInterval);
    
    // 3. የካርዱን ምልክቶች ማፅዳት (Markings Reset)
    if (selectedCardData) {
        selectedCardData.forEach(row => {
            row.forEach(cell => {
                if (!cell.isFree) {
                    cell.marked = false;
                }
            });
        });
    }

    // 4. UI ዝግጅት እና የቁጥር ጥሪ
    createCallBoard();
    populatePlayerCard(selectedCardId, selectedCardData);

    currentCallDisplay.textContent = 'ጨዋታው ተጀምሯል! ቁጥሮች በራስ-ሰር ይጠራሉ...';
    document.getElementById('connection-status').textContent = `Calling Every ${CALL_INTERVAL_MS/1000} Seconds`; 
    
    isRoundInProgress = true;
    numberCallInterval = setInterval(callNextNumber, CALL_INTERVAL_MS); 
}

function callNextNumber() {
    if (!isRoundInProgress) {
        if (numberCallInterval) clearInterval(numberCallInterval);
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

function checkBingo() {
    if (!selectedCardData || selectedCardData.length === 0) return false;
    const BINGO_SIZE = 5;
    const isMarked = (r, c) => selectedCardData[r][c].marked; 

    // Rows, Columns, Diagonals Check...
    for (let r = 0; r < BINGO_SIZE; r++) { if (selectedCardData[r].every((_, c) => isMarked(r, c))) return true; }
    for (let c = 0; c < BINGO_SIZE; c++) { if (selectedCardData.every((_, r) => isMarked(r, c))) return true; }
    if (Array.from({ length: BINGO_SIZE }, (_, i) => i).every(i => isMarked(i, i))) return true;
    if (Array.from({ length: BINGO_SIZE }, (_, i) => i).every(i => isMarked(i, BINGO_SIZE - 1 - i))) return true;

    return false;
}

/** የጨዋታውን ዙር ይዘጋል */
function endGame(isWinner, message) {
    if (numberCallInterval) clearInterval(numberCallInterval);
    isRoundInProgress = false;
    bingoBtn.disabled = true;
    
    // የገንዘብ ክፍያ
    if (isWinner) {
        walletBalance += winPayout;
        updateWalletDisplay();
        alert(`🎉🎉🎉 BINGO! ${winPayout} ETB አሸንፈዋል! አዲስ ቀሪ ሂሳብ: ${walletBalance} ETB`);
    }
    
    document.getElementById('connection-status').textContent = isWinner ? 'Winner Declared!' : 'Round Ended';
    
    // ከ 5 ሰከንድ በኋላ ወደ ካርድ መምረጫ ክፍል ይመልሳል
    setTimeout(() => {
        showScreen(cardSelectionScreen);
        loadDynamicCards(100); 
        startCardSelectionTimer();
    }, ROUND_END_PAUSE_MS); 
}

function handleBingoClick() {
    if (!isRoundInProgress) {
        alert("ጨዋታው ገና አልተጀመረም ወይም አብቅቷል።");
        return;
    }
    
    if (checkBingo()) {
        endGame(true, "በቅፅበት ተረጋግጧል!");
    } else {
        alert('❌ ቢንጎ አልተሞላም! መጫወትዎን ይቀጥሉ.');
    }
}


// =========================================================
// IX. የፕሮግራም ማስጀመሪያ (Entry Point)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    createCallBoard();
    updateWalletDisplay(); // የ Wallet ማሳያውን መጀመሪያ ላይ መጀመር

    // የክስተት አድማጮችን ማያያዝ
    joinBtn.addEventListener('click', () => {
        showScreen(cardSelectionScreen);
        loadDynamicCards(100);
        startCardSelectionTimer();
    });

    backToLobbyBtn.addEventListener('click', () => {
        if (currentCardSelectionTimer) clearInterval(currentCardSelectionTimer);
        showScreen(lobbyScreen);
    });
    
    // ቆጣሪውን አቋርጦ ወደ ጨዋታው ለመግባት (አንድ ካርድ ከተመረጠ)
    startGameBtn.addEventListener('click', () => {
        if (selectedCardId) {
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
    
    exitBtn.addEventListener('click', () => {
         if (numberCallInterval) clearInterval(numberCallInterval);
         if (currentCardSelectionTimer) clearInterval(currentCardSelectionTimer);
         showScreen(lobbyScreen);
         alert(`ከጨዋታው ወጥተዋል! ቀሪ ሂሳብዎ: ${walletBalance} ETB`);
    });

    showScreen(lobbyScreen);
});
