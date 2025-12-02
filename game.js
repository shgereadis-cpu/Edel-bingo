// 1. የሁሉም ስክሪን ኤለመንቶች ማጣቀሻዎች
const lobbyScreen = document.getElementById('lobby-screen');
const cardSelectionScreen = document.getElementById('card-selection-screen');
const activeGameScreen = document.getElementById('active-game-screen');

// 2. የአዝራር ኤለመንቶች ማጣቀሻዎች
const joinBtn = document.getElementById('join-btn');
const startGameBtn = document.getElementById('start-game-btn');
const backToLobbyBtn = document.getElementById('back-to-lobby-btn');
const bingoBtn = document.getElementById('bingo-btn');
const exitBtn = document.getElementById('exit-btn');
const refreshBtn = document.getElementById('refresh-btn');

// 3. የጨዋታ ሁኔታ ተለዋዋጮች
const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];
let calledNumbers = []; // የተጠሩ ቁጥሮችን ይይዛል (ለምሳሌ: [5, 17, 39, ...])
let availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1); // 1 እስከ 75
let numberCallInterval = null; // የቁጥር ጥሪ ቆጣሪውን (Interval) ይይዛል
let selectedCardId = null; 
let selectedCardData = []; // የተመረጠው ካርድ ቁጥሮች

// 4. የስክሪን መቆጣጠሪያ ተግባር
function showScreen(screenToShow) {
    // ሁሉንም ስክሪኖች ደብቅ
    [lobbyScreen, cardSelectionScreen, activeGameScreen].forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });

    // የተመረጠውን ስክሪን አክቲቭ አድርግ
    screenToShow.classList.remove('hidden');
    screenToShow.classList.add('active');
}

// 5. Mock Card Data and Selection Logic
// የካርድ መረጃን በካርዱ ID መሰረት ለማግኘት
const mockCardDataMap = {
    // 5x5 ፍርግርግ
    101: [
        [5, 17, 37, 60, 75],
        [4, 30, 39, 54, 73],
        [15, 29, 'FREE', 51, 68],
        [2, 28, 36, 48, 62],
        [3, 26, 33, 52, 65]
    ],
    102: [
        [1, 16, 31, 46, 61],
        [6, 20, 40, 50, 70],
        [10, 25, 'FREE', 59, 72],
        [14, 27, 43, 49, 64],
        [8, 22, 35, 53, 67]
    ]
    // ሌሎች ካርዶች እዚህ ሊጨመሩ ይችላሉ
};

function loadMockCards() {
    const cardList = document.getElementById('card-list');
    cardList.innerHTML = ''; 
    selectedCardId = null; // ምርጫን ዳግም አስጀምር
    startGameBtn.disabled = true;

    Object.keys(mockCardDataMap).forEach(id => {
        const cardData = mockCardDataMap[id];
        const cardDiv = document.createElement('div');
        cardDiv.className = 'mock-bingo-card';
        cardDiv.id = `card-${id}`;
        
        let numberText = '';
        BINGO_LETTERS.forEach((letter, i) => {
            numberText += `${letter}: ${cardData.map(row => row[i]).join(', ')} | `;
        });

        cardDiv.innerHTML = `
            <h4>ካርድ #${id}</h4>
            <p>${numberText}</p>
        `;

        cardDiv.addEventListener('click', () => {
            selectCard(cardDiv, id);
        });

        cardList.appendChild(cardDiv);
    });
}

function selectCard(cardElement, cardId) {
    document.querySelectorAll('.mock-bingo-card').forEach(card => {
        card.classList.remove('selected');
    });

    cardElement.classList.add('selected');
    selectedCardId = parseInt(cardId);
    selectedCardData = mockCardDataMap[selectedCardId];
    startGameBtn.disabled = false;
    console.log(`ካርድ #${selectedCardId} ተመርጧል`);
}


// 6. የቢንጎ ፍርግርግ እና Call Board የመፍጠር ተግባራት
function populatePlayerCard(cardId, cardData) {
    const cardGridBody = document.getElementById('bingo-card-grid');
    document.getElementById('card-number').textContent = cardId || 'N/A';
    cardGridBody.innerHTML = ''; 

    cardData.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cellValue, colIndex) => {
            const td = document.createElement('td');
            td.textContent = cellValue;
            
            // የነጻውን ቦታ ምልክት ያድርግ
            if (cellValue === 'FREE') {
                td.classList.add('free-space', 'marked'); // ነጻ ቦታ ሁልጊዜ ምልክት ይደረግበታል
            }

            let letter = BINGO_LETTERS[colIndex];
            td.id = `cell-${letter}-${cellValue}`; 
            
            // ተጫዋቹ እንዲነካው የሚያስችል event listener
            if (cellValue !== 'FREE') {
                td.addEventListener('click', () => markPlayerCell(td, cellValue));
            }
            
            tr.appendChild(td);
        });
        cardGridBody.appendChild(tr);
    });
}

// 🖲️ ተጫዋቹ ቁጥሩን ሲነካ ምልክት ያደርጋል
function markPlayerCell(cellElement, cellValue) {
    const num = parseInt(cellValue);
    
    // 1. ቁጥሩ አስቀድሞ ተጠርቶ እንደሆነ ያረጋግጣል
    if (!calledNumbers.includes(num)) {
        alert(`ቁጥር ${num} ገና አልተጠራም!`);
        return;
    }
    
    // 2. ምልክት የማድረግ ወይም የማንሳት ተግባር
    cellElement.classList.toggle('marked');
    console.log(`ካርድ ላይ ያለ ቁጥር ${num} ተለወጠ።`);
}

// የጥሪ ሰሌዳውን (Call Board) የመፍጠር ተግባር (1-75)
function createCallBoard() {
    const callBoard = document.getElementById('call-board');
    callBoard.innerHTML = '<h3>የተጠሩ ቁጥሮች</h3>';
    
    const grid = document.createElement('div');
    grid.className = 'call-board-grid';

    for (let i = 1; i <= 75; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.textContent = i;
        
        let letter = BINGO_LETTERS[Math.floor((i - 1) / 15)];

        numberDiv.className = 'call-number';
        numberDiv.id = `call-num-${letter}-${i}`;
        
        grid.appendChild(numberDiv);
    }
    
    callBoard.appendChild(grid);
}


// 7. ዋናው የጨዋታ ሎጂክ
function startGame() {
    // የጨዋታ ሁኔታን ዳግም አስጀምር
    calledNumbers = [];
    availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    document.getElementById('current-call').textContent = 'BINGO!';
    document.getElementById('recent-calls-list').innerHTML = '';
    
    // Call Board እና Player Card ፍርግርጎችን ፈጥሩ
    createCallBoard();
    populatePlayerCard(selectedCardId, selectedCardData);

    // የቁጥር ጥሪውን ጀምር (በየ3 ሰከንዱ)
    numberCallInterval = setInterval(callNextNumber, 3000);
    console.log("ጨዋታው ተጀምሯል!");
}

function callNextNumber() {
    if (availableNumbers.length === 0) {
        clearInterval(numberCallInterval);
        document.getElementById('current-call').textContent = 'ጨዋታው ተጠናቋል!';
        alert('ሁሉም ቁጥሮች ተጠርተዋል። ማንም አላሸነፈም!');
        return;
    }

    // በዘፈቀደ ቁጥር ይምረጡ
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const calledNum = availableNumbers.splice(randomIndex, 1)[0]; // ከAvailable ውስጥ አስወግድ
    calledNumbers.push(calledNum);
    
    // የቢንጎ ፊደል ይፈልጉ
    let letter = BINGO_LETTERS[Math.floor((calledNum - 1) / 15)];
    const callText = `${letter}-${calledNum}`;

    // 1. የአሁን ጥሪ ማሳያውን አዘምን
    document.getElementById('current-call').textContent = callText;

    // 2. Call Board ላይ ምልክት አድርግ
    const callBoardCell = document.getElementById(`call-num-${letter}-${calledNum}`);
    if (callBoardCell) {
        callBoardCell.classList.add('called');
    }

    // 3. የቅርብ ጊዜ ጥሪዎች ዝርዝርን አዘምን
    const recentCallsList = document.getElementById('recent-calls-list');
    const li = document.createElement('li');
    li.textContent = callText;
    recentCallsList.prepend(li); // አዲሱን ቁጥር ከላይ አስቀምጥ
}

// 8. የቢንጎ መፈተሻ ተግባር
function checkBingo() {
    if (!selectedCardData || selectedCardData.length === 0) return;

    const BINGO_SIZE = 5;
    const isMarked = (r, c) => {
        const cellValue = selectedCardData[r][c];
        if (cellValue === 'FREE') return true;
        
        const cellId = document.getElementById(`cell-${BINGO_LETTERS[c]}-${cellValue}`);
        return cellId && cellId.classList.contains('marked');
    };

    // 1. አግድም (Rows) ተፈተሽ
    for (let r = 0; r < BINGO_SIZE; r++) {
        if (selectedCardData[r].every((_, c) => isMarked(r, c))) {
            return true;
        }
    }

    // 2. አቀባዊ (Columns) ተፈተሽ
    for (let c = 0; c < BINGO_SIZE; c++) {
        if (selectedCardData.every((_, r) => isMarked(r, c))) {
            return true;
        }
    }

    // 3. ዲያግናል (Diagonals) ተፈተሽ
    // ከላይ-ግራ ወደ ታች-ቀኝ
    if (Array.from({ length: BINGO_SIZE }, (_, i) => i).every(i => isMarked(i, i))) {
        return true;
    }
    // ከላይ-ቀኝ ወደ ታች-ግራ
    if (Array.from({ length: BINGO_SIZE }, (_, i) => i).every(i => isMarked(i, BINGO_SIZE - 1 - i))) {
        return true;
    }

    return false;
}

// 9. የኢቨንት ሊስነርስ (Event Listeners)
joinBtn.addEventListener('click', () => {
    showScreen(cardSelectionScreen);
    loadMockCards();
});

backToLobbyBtn.addEventListener('click', () => {
    showScreen(lobbyScreen);
});

startGameBtn.addEventListener('click', () => {
    if (selectedCardId) {
        showScreen(activeGameScreen);
        startGame(); // ጨዋታውን ጀምር
    } else {
        alert("እባክዎ መጀመሪያ ካርድ ይምረጡ!");
    }
});

// ቢንጎ ቁልፍ ሲጫን
bingoBtn.addEventListener('click', () => {
    if (checkBingo()) {
        clearInterval(numberCallInterval);
        document.getElementById('connection-status').textContent = 'WON!';
        document.getElementById('connection-status').style.color = 'yellow';
        alert('ቢንጎ! አሸንፈዋል!');
    } else {
        alert('ገና ቢንጎ አልሆነም! መፈተሽዎን ይቀጥሉ!');
    }
});

exitBtn.addEventListener('click', () => {
    clearInterval(numberCallInterval);
    showScreen(lobbyScreen);
    alert('ከጨዋታው ወጥተዋል!');
});

// መተግበሪያው ሲጀመር ሎቢውን አሳይ
document.addEventListener('DOMContentLoaded', () => {
    showScreen(lobbyScreen);
});
