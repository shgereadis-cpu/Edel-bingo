// 1. የሁሉም ስክሪን ኤለመንቶች ማጣቀሻዎች
const lobbyScreen = document.getElementById('lobby-screen');
const cardSelectionScreen = document.getElementById('card-selection-screen');
const activeGameScreen = document.getElementById('active-game-screen');

// 2. የአዝራር ኤለመንቶች ማጣቀሻዎች
const joinBtn = document.getElementById('join-btn');
const startGameBtn = document.getElementById('start-game-btn');
const backToLobbyBtn = document.getElementById('back-to-lobby-btn');

// 3. የስክሪን መቆጣጠሪያ ተግባር
/**
 * አንድን ስክሪን አክቲቭ ሲያደርግ ሌሎቹን ደግሞ ይደብቃል።
 * @param {HTMLElement} screenToShow - አክቲቭ የሚሆነው ስክሪን ኤለመንት
 */
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

// 4. የኢቨንት ሊስነርስ (Event Listeners) - በአዝራሮች ላይ የሚደረጉ ድርጊቶችን መቆጣጠር

// ከሎቢ ወደ ካርድ ምርጫ ገጽ ይሂዱ
joinBtn.addEventListener('click', () => {
    showScreen(cardSelectionScreen);
    // TODO: ካርዶችን የመጫን (Load Cards) ተግባርን እዚህ እንጨምራለን
    console.log("Card Selection Screen ተከፍቷል");
    
    // ለሙከራ ካርዶች እስኪጫኑ ድረስ start-game-btn ን አሰናክል
    startGameBtn.disabled = true;
    
    // ለጊዜው ካርዶችን ለመፍጠር የሚያስችል Mock ተግባር እንጠራ
    loadMockCards(); 
});

// ከካርድ ምርጫ ወደ ሎቢ ገጽ ተመለስ
backToLobbyBtn.addEventListener('click', () => {
    showScreen(lobbyScreen);
    console.log("ወደ Lobby ተመልሷል");
});

// የካርድ ምርጫ ከተጠናቀቀ በኋላ ወደ Active Game ገጽ ይሂዱ
startGameBtn.addEventListener('click', () => {
    // TODO: የተመረጠውን ካርድ ይዞ ወደ ጨዋታው የመግባት ሎጂክ እዚህ ይገባል
    showScreen(activeGameScreen);
    console.log("Active Game Screen ተከፍቷል");
    
    // TODO: የቢንጎ ፍርግርግ እና የጥሪ ሰሌዳውን የመፍጠር ተግባር እንጨምራለን
    createCallBoard();
    populatePlayerCard(selectedCard); // የተመረጠውን ካርድ ይጠቀማል
});


// 5. Mock Card Data and Selection Logic (ለጊዜው ለመሞከር)
let selectedCard = null;

function loadMockCards() {
    const cardList = document.getElementById('card-list');
    cardList.innerHTML = ''; // ያለውን ያጥፋ

    // የካርዶች ምሳሌ ዝርዝር
    const mockCards = [
        { id: 101, numbers: "B:1,14,2,3,15 | I:16,29,28,30,17 | N:37,39,FREE,36,33 | G:60,54,51,48,52 | O:75,73,68,62,65" },
        { id: 102, numbers: "B:5,10,13,7,9 | I:20,18,25,27,24 | N:40,35,FREE,31,45 | G:46,59,50,56,49 | O:61,70,72,67,64" },
        { id: 103, numbers: "B:6,8,12,11,4 | I:21,23,26,19,22 | N:44,38,FREE,42,41 | G:58,53,47,55,57 | O:63,66,74,71,69" }
    ];

    mockCards.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'mock-bingo-card';
        cardDiv.id = `card-${card.id}`;
        cardDiv.innerHTML = `
            <h4>ካርድ #${card.id}</h4>
            <p>${card.numbers}</p>
        `;

        cardDiv.addEventListener('click', () => {
            selectCard(cardDiv, card.id);
        });

        cardList.appendChild(cardDiv);
    });
    
    // ካርዶች ከታዩ በኋላ startGameBtn ን አክቲቭ እናድርግ (ለሙከራ)
    startGameBtn.disabled = false;
}

function selectCard(cardElement, cardId) {
    // ሁሉንም ካርዶች መመረጥ የለባቸውም አድርግ
    document.querySelectorAll('.mock-bingo-card').forEach(card => {
        card.classList.remove('selected');
    });

    // አዲሱን ካርድ ምረጥ
    cardElement.classList.add('selected');
    selectedCard = cardId;
    console.log(`ካርድ #${cardId} ተመርጧል`);
}


// 6. የቢንጎ ፍርግርግ እና Call Board የመፍጠር ተግባራት (Active Game Logic)
const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];

// የተመረጠውን ካርድ ወደ ፍርግርግ የመሙላት ተግባር
function populatePlayerCard(cardId) {
    const cardGridBody = document.getElementById('bingo-card-grid');
    // እውነተኛ የካርድ ዳታ (ይህ በኋላ በአገልጋይ ዳታ ይተካል)
    const cardData = [
        [5, 17, 37, 60, 75],
        [4, 30, 39, 54, 73],
        [15, 29, 'FREE', 51, 68],
        [2, 28, 36, 48, 62],
        [3, 26, 33, 52, 65]
    ];
    
    // የካርድ ቁጥር ማሳያውን አዘምን
    document.getElementById('card-number').textContent = cardId || 'N/A';
    
    cardGridBody.innerHTML = ''; // የነበረውን አጥፋ

    cardData.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cellValue => {
            const td = document.createElement('td');
            td.textContent = cellValue;
            if (cellValue === 'FREE') {
                td.classList.add('free-space');
            }
            // እያንዳንዱን ቁጥር በመታወቂያ ለይተን እናስቀምጠዋለን (ለምሳሌ: cell-B-5, cell-N-FREE)
            let letter = BINGO_LETTERS[row.indexOf(cellValue)];
            td.id = `cell-${letter}-${cellValue}`; 
            
            tr.appendChild(td);
        });
        cardGridBody.appendChild(tr);
    });
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
        numberDiv.className = 'call-number';
        
        // የቢንጎ ፊደል ለመጨመር
        let letter = '';
        if (i <= 15) letter = 'B';
        else if (i <= 30) letter = 'I';
        else if (i <= 45) letter = 'N';
        else if (i <= 60) letter = 'G';
        else letter = 'O';

        numberDiv.id = `call-num-${letter}-${i}`;
        
        grid.appendChild(numberDiv);
    }
    
    callBoard.appendChild(grid);
}

// መተግበሪያው ሲጀመር ሎቢውን አሳይ
document.addEventListener('DOMContentLoaded', () => {
    showScreen(lobbyScreen);
});
