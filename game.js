// =========================================================
// I. ግሎባል ተለዋዋጮች እና የመጀመሪያ ዝግጅቶች
// =========================================================

const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];
const CALL_INTERVAL_MS = 4000; 
// 🔑 ማስተካከያ: የካርድ መምረጫ ጊዜ ወደ 10 ሰከንድ ተቀይሯል።
const CARD_SELECTION_TIME = 10; 
const ROUND_END_PAUSE_MS = 5000; 

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
const timerDisplay = document.getElementById('timer-display');

// Modal Elements
const viewBoardBtn = document.getElementById('view-board-btn');
const callBoardModal = document.getElementById('call-board-modal');
const closeBoardBtn = document.getElementById('close-board-btn');
const callBoardGrid = document.querySelector('#call-board .call-board-grid');


// =========================================================
// II. የካርድ ማመንጨት እና ምርጫ
// =========================================================

/** ለ B, I, N, G, O አምዶች ቁጥሮችን ያመነጫል */
function getRandomNumbers(min, max) {
    const range = [];
    for (let i = min; i <= max; i++) {
        range.push(i);
    }
    range.sort(() => 0.5 - Math.random());
    return range.slice(0, 5);
}

/** ሙሉ የቢንጎ ካርድ ይፈጥራል */
function generateBingoCard() {
    const card = {
        B: getRandomNumbers(1, 15),
        I: getRandomNumbers(16, 30),
        N: getRandomNumbers(31, 45),
        G: getRandomNumbers(46, 60),
        O: getRandomNumbers(61, 75)
    };
    
    // ካርዱን እንደ 5x5 Grid ማዘጋጀት
    const structuredCardGrid = [[], [], [], [], []];
    const columns = ['B', 'I', 'N', 'G', 'O'];

    for (let r = 0; r < 5; r++) {
        columns.forEach((col, c) => {
            let cellData;
            if (col === 'N' && r === 2) {
                // መሃከለኛው 'FREE' ቦታ
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

/** ለካርድ መምረጫ ስክሪን ካርዶችን ይፈጥራል */
function loadDynamicCards(numCards = 100) {
    cardListDiv.innerHTML = 'ካርዶች እየተፈጠሩ ነው...';
    allGeneratedCards = {};
    selectedCardId = null;
    selectedCardData = null; 
    startGameBtn.disabled = true;

    for (let i = 1; i <= numCards; i++) {
        const cardData = generateBingoCard();
        allGeneratedCards[i] = cardData;

        const cardEl = document.createElement('div');
        cardEl.className = 'mock-bingo-card';
        cardEl.id = `card-${i}`;

        // 🔑 ማስተካከያ: በቦክስ ውስጥ የካርድ ቁጥር ብቻ እንዲታይ ተደርጓል።
        cardEl.textContent = i;
        
        cardEl.addEventListener('click', () => {
            selectCard(cardEl, i, cardData);
        });

        cardListDiv.appendChild(cardEl);
    }
}

/** የተጫዋቹን ካርድ ይመርጣል */
function selectCard(cardElement, cardId, cardData) {
    document.querySelectorAll('.mock-bingo-card').forEach(card => {
        card.classList.remove('selected');
    });

    cardElement.classList.add('selected');
    selectedCardId = cardId;
    selectedCardData = cardData;
    startGameBtn.disabled = false;
    
    if (currentCardSelectionTimer) {
        let timeLeft = parseInt(timerDisplay.textContent.match(/\d+/)[0]) || CARD_SELECTION_TIME;
        timerDisplay.textContent = `Card #${cardId} Selected. Time left: ${timeLeft} sec`;
    }
}


// =========================================================
// III. የጨዋታ አፈፃፀም እና ፍሰት
// =========================================================

/** ስክሪኖችን ለመቀያየር የሚያስችል ተግባር */
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

    cardData.forEach(row => {
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
    callBoardGrid.innerHTML = '';
    
    // የBINGO ፊደል ራስጌዎች
    BINGO_LETTERS.forEach(letter => {
        const h4 = document.createElement('h4');
        h4.textContent = letter;
        h4.style.textAlign = 'center'; 
        h4.style.margin = '5px 0';
        callBoardGrid.appendChild(h4);
    });


    // 75 ቁጥሮችን መሙላት
    for (let i = 1; i <= 75; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.textContent = i;
        let letter = BINGO_LETTERS[Math.floor((i - 1) / 15)];
        numberDiv.className = 'call-number';
        numberDiv.id = `call-num-${letter}-${i}`;
        
        if (calledNumbers.includes(i)) {
             numberDiv.classList.add('called');
        }
        
        callBoardGrid.appendChild(numberDiv);
    }
}

/** ተጫዋቹ ቁጥር ሲነካ ምልክት ያደርጋል */
function markPlayerCell(cellElement, cellData) {
    const num = cellData.value;
    
    if (calledNumbers.includes(num)) {
        cellData.marked = !cellData.marked;
        cellElement.classList.toggle('marked', cellData.marked); 
    } else {
        alert(`ቁጥር ${num} ገና አልተጠራም!`);
    }
}

function startCardSelectionTimer() {
    let timeLeft = CARD_SELECTION_TIME;
    timerDisplay.textContent = `የካርድ መምረጫ ጊዜ: ${timeLeft} ሰከንድ`;
    
    if (currentCardSelectionTimer) clearInterval(currentCardSelectionTimer);

    currentCardSelectionTimer = setInterval(() => {
        timeLeft--;
        
        let displayMessage = `የካርድ መምረጫ ጊዜ: ${timeLeft} ሰከንድ`;
        if (selectedCardId) {
             displayMessage = `Card #${selectedCardId} Selected. Time left: ${timeLeft} sec`;
        }
        timerDisplay.textContent = displayMessage;

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

/** አዲስ ዙር ይጀምራል */
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
    
    // 3. የካርዱን ምልክቶች ማፅዳት
    if (selectedCardData) {
        selectedCardData.forEach(row => {
            row.forEach(cell => {
                if (!cell.isFree) {
                    cell.marked = false;
                } else {
                    cell.marked = true; 
                }
            });
        });
    }

    // 4. UI ዝግጅት እና የቁጥር ጥሪ
    createCallBoard();
    populatePlayerCard(selectedCardId, selectedCardData);

    currentCallDisplay.textContent = 'GAME ON!';
    document.getElementById('connection-status').textContent = `Calling Every ${CALL_INTERVAL_MS/1000} Seconds`; 
    
    isRoundInProgress = true;
    numberCallInterval = setInterval(callNextNumber, CALL_INTERVAL_MS); 
}

/** ቀጣዩን የቢንጎ ቁጥር ይጠራል */
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

    // በ Call Board ላይ ምልክት ማድረግ
    const callBoardCell = document.getElementById(`call-num-${letter}-${calledNum}`);
    if (callBoardCell) {
        callBoardCell.classList.add('called');
    }

    // በቅርብ ጊዜ ጥሪዎች ዝርዝር ውስጥ መጨመር
    const li = document.createElement('li');
    li.textContent = callText;
    recentCallsList.prepend(li); 
}

/** የቢንጎ ሁኔታን ያረጋግጣል (አሸናፊነት) */
function checkBingo() {
    if (!selectedCardData || selectedCardData.length === 0) return false;
    const BINGO_SIZE = 5;
    const isMarked = (r, c) => selectedCardData[r][c].marked; 

    // ረድፎችን ማረጋገጥ
    for (let r = 0; r < BINGO_SIZE; r++) { if (selectedCardData[r].every((_, c) => isMarked(r, c))) return true; }
    // አምዶችን ማረጋገጥ
    for (let c = 0; c < BINGO_SIZE; c++) { if (selectedCardData.every((_, r) => isMarked(r, c))) return true; }
    // የመጀመሪያውን ዲያጎናል ማረጋገጥ (\)
    if (Array.from({ length: BINGO_SIZE }, (_, i) => i).every(i => isMarked(i, i))) return true;
    // ሁለተኛውን ዲያጎናል ማረጋገጥ (/)
    if (Array.from({ length: BINGO_SIZE }, (_, i) => i).every(i => isMarked(i, BINGO_SIZE - 1 - i))) return true;

    return false;
}

/** የጨዋታውን ዙር ይዘጋል */
function endGame(isWinner, message) {
    if (numberCallInterval) clearInterval(numberCallInterval);
    isRoundInProgress = false;
    bingoBtn.disabled = true;
    
    if (isWinner) {
        walletBalance += winPayout;
        updateWalletDisplay();
        alert(`🎉🎉🎉 BINGO! ${winPayout} ETB አሸንፈዋል! አዲስ ቀሪ ሂሳብ: ${walletBalance} ETB`);
    } else {
        alert(message);
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
        alert('❌ ቢንጎ አልተሞላም! መጫወትዎን ይቀጥሉ።');
    }
}

// =========================================================
// IX. የፕሮግራም ማስጀመሪያ (Event Listeners)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // ከመጀመሩ በፊት UIን ማዘጋጀት
    createCallBoard();
    updateWalletDisplay(); 

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
         isRoundInProgress = false;
         showScreen(lobbyScreen);
         alert(`ከጨዋታው ወጥተዋል! ቀሪ ሂሳብዎ: ${walletBalance} ETB`);
    });
    
    document.getElementById('refresh-btn').addEventListener('click', () => {
        window.location.reload(); 
    });

    // Modal Controls
    viewBoardBtn.addEventListener('click', () => {
        callBoardModal.classList.remove('hidden');
        createCallBoard(); 
    });

    closeBoardBtn.addEventListener('click', () => {
        callBoardModal.classList.add('hidden');
    });

    showScreen(lobbyScreen);
});
