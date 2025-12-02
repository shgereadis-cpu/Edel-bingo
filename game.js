// =========================================================
// I. ግሎባል ተለዋዋጮች እና የመጀመሪያ ዝግጅቶች
// =========================================================

const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];
let calledNumbers = [];
let availableNumbers = [];
let numberCallInterval = null; // የቁጥር ጥሪ ቆጣሪ
let selectedCardId = null;
let selectedCardData = null; // የተመረጠው ካርድ 5x5 አሬይ ዳታ

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

// የካርድ ዳታ (ሁሉንም 100 ካርዶች ይይዛል)
let allGeneratedCards = {}; 


// =========================================================
// II. የካርድ ማመንጨት (Dynamic Card Generation for 100 Cards)
// =========================================================

/** ከአንድ ክልል ውስጥ 5 ልዩ ቁጥሮችን ይመርጣል */
function getRandomNumbers(min, max) {
    const range = [];
    for (let i = min; i <= max; i++) {
        range.push(i);
    }
    range.sort(() => 0.5 - Math.random());
    return range.slice(0, 5);
}

/** አዲስ የቢንጎ ካርድ (5x5 ፍርግርግ) ያመነጫል። */
function generateBingoCard() {
    const card = {
        B: getRandomNumbers(1, 15),
        I: getRandomNumbers(16, 30),
        N: getRandomNumbers(31, 45),
        G: getRandomNumbers(46, 60),
        O: getRandomNumbers(61, 75)
    };
    
    // 5x5 የ2D አሬይ መፍጠር
    const structuredCardGrid = [[], [], [], [], []];
    const columns = ['B', 'I', 'N', 'G', 'O'];

    for (let r = 0; r < 5; r++) {
        columns.forEach((col, c) => {
            let cellData;
            
            if (col === 'N' && r === 2) {
                // ነጻ ቦታ
                cellData = { value: 'FREE', marked: true, isFree: true };
            } else {
                // መደበኛ ቁጥር
                // ቁጥሩን ከካርዱ አምድ ዝርዝር ውስጥ ወስዶ ምልክት የማድረግ ሁኔታን ይጨምራል
                const number = card[col].shift();
                cellData = { value: number, marked: false };
            }
            structuredCardGrid[r][c] = cellData;
        });
    }

    return structuredCardGrid;
}

/** 100 ካርዶችን አምርቶ ለምርጫ ያሳያል። */
function loadDynamicCards(numCards = 100) {
    cardListDiv.innerHTML = '';
    allGeneratedCards = {};
    selectedCardId = null;
    startGameBtn.disabled = true;

    for (let i = 1; i <= numCards; i++) {
        const cardData = generateBingoCard();
        allGeneratedCards[i] = cardData;

        const cardEl = document.createElement('div');
        cardEl.className = 'mock-bingo-card';
        cardEl.id = `card-${i}`;

        // የካርዱን ይዘት በረድፍ መሰረት ማሳየት (ለተጨማሪ መረጃ)
        let numberText = '';
        BINGO_LETTERS.forEach((letter, c) => {
             // የእያንዳንዱን ረድፍ 1ኛ፣ 2ኛ፣ 3ኛ ቁጥሮች ብቻ ማሳየት
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
    selectedCardData = cardData; // 5x5 ዳታው እዚህ ተይዟል።
    startGameBtn.disabled = false;
    console.log(`ካርድ #${selectedCardId} ተመርጧል`);
}


// =========================================================
// III. የጨዋታ አፈፃፀም እና ቁጥጥር
// =========================================================

function showScreen(screenToShow) {
    // ... (ያለፈው ኮድ)
    [lobbyScreen, cardSelectionScreen, activeGameScreen].forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });

    screenToShow.classList.remove('hidden');
    screenToShow.classList.add('active');
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

            // ዳታውን ከ cell ጋር ማገናኘት
            td.cellData = cellData;

            if (cellData.isFree) {
                td.classList.add('free-space', 'marked');
            } else {
                // ቁጥሮችን ብቻ እንዲጫን ማድረግ
                td.addEventListener('click', () => markPlayerCell(td, cellData));
            }

            let letter = BINGO_LETTERS[colIndex];
            td.id = `cell-${letter}-${cellData.value}`; // cell-${B}-5

            // ቀድሞ ምልክት የተደረገበት ከሆነ marked class መጨመር
            if (cellData.marked && !cellData.isFree) {
                 td.classList.add('marked');
            }
            
            tr.appendChild(td);
        });
        cardGridBody.appendChild(tr);
    });
}

/** ተጫዋቹ ቁጥር ሲነካ ምልክት ያደርጋል */
function markPlayerCell(cellElement, cellData) {
    const num = cellData.value;
    
    // 1. ቁጥሩ አስቀድሞ ተጠርቶ እንደሆነ ያረጋግጣል
    if (!calledNumbers.includes(num)) {
        alert(`ቁጥር ${num} ገና አልተጠራም!`);
        return;
    }
    
    // 2. በዳታ ሞዴሉ እና በ UI ላይ ምልክት ማድረግ/ማንሳት
    cellData.marked = !cellData.marked;
    cellElement.classList.toggle('marked', cellData.marked);
    
    console.log(`ካርድ ላይ ያለ ቁጥር ${num} ተለወጠ።`);
    
    // ቢንጎ ለመፈተሽ አዝራሩን ማንቃት (አስፈላጊ ከሆነ)
    // checkNearBingo();
}

/** የጥሪ ሰሌዳውን መፍጠር (ከ1-75) */
function createCallBoard() {
    const callBoard = document.getElementById('call-board');
    // Call Boardን እንደገና እንዳይፈጥር መፈተሽ
    if (callBoard.querySelector('.call-board-grid')) return; 
    
    // ... (የቀረው ኮድ)
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
    // ዳግም ማስጀመር
    calledNumbers = [];
    availableNumbers = Array.from({ length: 75 }, (_, i) => i + 1);
    document.getElementById('recent-calls-list').innerHTML = '';
    
    if (numberCallInterval) clearInterval(numberCallInterval);
    
    // Call Board እና Player Card ፍርግርጎችን ፈጥሩ
    createCallBoard();
    populatePlayerCard(selectedCardId, selectedCardData);

    currentCallDisplay.textContent = 'ጨዋታው ተጀምሯል!';
    document.getElementById('connection-status').textContent = 'Active Game';
    
    // ቁጥሩን በየ 4 ሰከንዱ መጥራት
    numberCallInterval = setInterval(callNextNumber, 4000); 
    console.log("ጨዋታው ተጀምሯል፣ ቁጥሮች በራስ-ሰር ይጠራሉ!");
}

function callNextNumber() {
    if (availableNumbers.length === 0) {
        endGame(false, "ሁሉም ቁጥሮች ተጠርተዋል!");
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const calledNum = availableNumbers.splice(randomIndex, 1)[0];
    calledNumbers.push(calledNum);
    
    let letter = BINGO_LETTERS[Math.floor((calledNum - 1) / 15)];
    const callText = `${letter}-${calledNum}`;

    // 1. የአሁን ጥሪ ማሳያውን አዘምን
    currentCallDisplay.textContent = callText;

    // 2. Call Board ላይ ምልክት አድርግ
    const callBoardCell = document.getElementById(`call-num-${letter}-${calledNum}`);
    if (callBoardCell) {
        callBoardCell.classList.add('called');
    }

    // 3. የቅርብ ጊዜ ጥሪዎች ዝርዝርን አዘምን
    const li = document.createElement('li');
    li.textContent = callText;
    recentCallsList.prepend(li);
}

// 8. የቢንጎ መፈተሻ ተግባር
function checkBingo() {
    if (!selectedCardData || selectedCardData.length === 0) return false;

    const BINGO_SIZE = 5;
    const isMarked = (r, c) => {
        return selectedCardData[r][c].marked; // የዳታ ሞዴሉን በቀጥታ መጠቀም
    };

    // 1. አግድም (Rows) ተፈተሽ
    for (let r = 0; r < BINGO_SIZE; r++) {
        if (selectedCardData[r].every((_, c) => isMarked(r, c))) return true;
    }

    // 2. አቀባዊ (Columns) ተፈተሽ
    for (let c = 0; c < BINGO_SIZE; c++) {
        if (selectedCardData.every((_, r) => isMarked(r, c))) return true;
    }

    // 3. ዲያግናል (Diagonals) ተፈተሽ
    // ከላይ-ግራ ወደ ታች-ቀኝ
    if (Array.from({ length: BINGO_SIZE }, (_, i) => i).every(i => isMarked(i, i))) return true;

    // ከላይ-ቀኝ ወደ ታች-ግራ
    if (Array.from({ length: BINGO_SIZE }, (_, i) => i).every(i => isMarked(i, BINGO_SIZE - 1 - i))) return true;

    return false;
}

/** የጨዋታውን ፍሰት ይዘጋል */
function endGame(isWinner, message) {
    clearInterval(numberCallInterval);
    numberCallInterval = null;
    
    document.getElementById('connection-status').textContent = isWinner ? 'Winner!' : 'Game Over';
    
    if (isWinner) {
        alert(`🎉🎉🎉 BINGO! ካርድ ቁጥር ${selectedCardId} አሸንፏል። ${message}`);
    } else {
        alert(`😞 ${message} ጨዋታው ተጠናቋል።`);
    }
    
    // ወደ ካርድ መምረጫ ክፍል ይመልሳል
    setTimeout(() => {
        showScreen(cardSelectionScreen);
        loadDynamicCards(100); // 100 ካርዶችን እንደገና ይጭናል
    }, 5000); // አሸናፊውን ካሳየ በኋላ ለ 5 ሰከንድ ይጠብቃል
}

function handleBingoClick() {
    if (checkBingo()) {
        endGame(true, `አሸንፈዋል! ካርድዎ #${selectedCardId} ነው።`);
    } else {
        alert('ገና ቢንጎ አልሆነም! መፈተሽዎን ይቀጥሉ!');
    }
}


// =========================================================
// IX. የፕሮግራም ማስጀመሪያ
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // የክስተት አድማጮችን ማያያዝ
    joinBtn.addEventListener('click', () => {
        showScreen(cardSelectionScreen);
        loadDynamicCards(100); // 100 ካርዶችን እንዲመርጡ ያደርጋል
    });

    backToLobbyBtn.addEventListener('click', () => {
        showScreen(lobbyScreen);
        if (numberCallInterval) clearInterval(numberCallInterval); // ጨዋታ ላይ ከሆኑ ያቁም
    });

    startGameBtn.addEventListener('click', () => {
        if (selectedCardId) {
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
         showScreen(lobbyScreen);
         alert('ከጨዋታው ወጥተዋል!');
    });

    showScreen(lobbyScreen);
    createCallBoard(); // Call Boardን መጀመሪያ ላይ ይፍጠር
});
