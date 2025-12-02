// game.js (Static Data ገብቷል, Logic ለ Lobby ተዘጋጅቷል)

const CARD_SIZE = 5; 
const LETTERS = ['B', 'I', 'N', 'G', 'O'];

// ለየቢንጎ ፊደል ክልሎች (አሁንም ለሌሎች ተግባራት ያስፈልጋል)
const RANGES = {
    'B': [1, 15],
    'I': [16, 30],
    'N': [31, 45],
    'G': [46, 60],
    'O': [61, 75]
};

// ==========================================================
// ቋሚ የ100 ካርዶች መረጃ (ከርስዎ የተገኘ)
// ==========================================================
const STATIC_CARD_POOL = {"card-1":{"B":[4,7,10,12,13],"I":[18,19,24,26,27],"N":[33,35,"FREE",43,44],"G":[49,53,55,56,57],"O":[62,65,68,70,72]},"card-2":{"B":[1,2,9,13,15],"I":[16,19,21,22,23],"N":[34,35,"FREE",39,43],"G":[49,53,54,56,60],"O":[65,66,70,72,75]},"card-3":{"B":[3,9,11,12,13],"I":[17,21,25,27,30],"N":[31,34,"FREE",40,42],"G":[46,51,56,59,60],"O":[61,65,66,67,69]},"card-4":{"B":[4,5,6,7,10],"I":[16,17,20,24,29],"N":[34,36,"FREE",38,40],"G":[46,47,49,59,60],"O":[62,64,65,67,73]},"card-5":{"B":[1,3,7,10,11],"I":[23,24,26,28,30],"N":[32,33,"FREE",38,45],"G":[49,50,52,53,57],"O":[64,67,70,71,75]},"card-6":{"B":[1,3,7,11,14],"I":[16,17,18,26,28],"N":[33,34,"FREE",37,39],"G":[47,48,53,56,58],"O":[61,62,65,70,75]},"card-7":{"B":[1,6,13,14,15],"I":[20,21,23,26,28],"N":[35,37,"FREE",40,41],"G":[46,50,54,57,59],"O":[62,63,64,70,75]},"card-8":{"B":[3,9,13,14,15],"I":[16,17,18,22,28],"N":[32,34,"FREE",40,42],"G":[48,49,50,54,59],"O":[62,63,65,66,73]},"card-9":{"B":[1,2,5,9,11],"I":[20,22,25,29,30],"N":[34,36,"FREE",41,44],"G":[46,47,55,56,57],"O":[64,65,68,69,74]},"card-10":{"B":[1,2,3,7,12],"I":[16,18,20,23,26],"N":[31,34,"FREE",42,45],"G":[48,49,52,55,58],"O":[61,62,63,64,66]},"card-11":{"B":[1,2,5,13,14],"I":[17,19,21,27,30],"N":[31,32,"FREE",36,39],"G":[46,52,55,57,60],"O":[61,62,63,65,72]},"card-12":{"B":[5,6,8,11,12],"I":[16,20,22,25,27],"N":[36,37,"FREE",39,44],"G":[46,50,52,55,58],"O":[63,66,68,72,74]},"card-13":{"B":[4,6,12,13,14],"I":[22,23,24,27,28],"N":[33,39,"FREE",41,44],"G":[48,50,53,54,58],"O":[64,67,69,70,73]},"card-14":{"B":[2,5,11,12,13],"I":[18,19,20,25,28],"N":[31,36,"FREE",38,39],"G":[47,49,52,54,59],"O":[62,65,66,68,71]},"card-15":{"B":[1,4,7,8,9],"I":[17,21,22,28,30],"N":[31,34,"FREE",43,44],"G":[47,48,49,54,60],"O":[61,66,68,70,72]},"card-16":{"B":[4,5,7,11,12],"I":[19,21,25,26,27],"N":[32,41,"FREE",44,45],"G":[47,53,54,55,57],"O":[61,62,67,68,75]},"card-17":{"B":[2,5,8,10,11],"I":[16,18,19,21,28],"N":[31,33,"FREE",40,43],"G":[46,50,56,57,58],"O":[61,63,66,69,72]},"card-18":{"B":[3,7,9,10,12],"I":[16,23,25,26,28],"N":[31,35,"FREE",42,43],"G":[46,47,53,56,59],"O":[62,64,69,70,72]},"card-19":{"B":[2,6,7,11,14],"I":[18,19,22,24,29],"N":[32,34,"FREE",42,43],"G":[47,50,58,59,60],"O":[61,65,67,68,75]},"card-20":{"B":[4,6,8,9,13],"I":[17,22,23,24,30],"N":[35,36,"FREE",38,39],"G":[47,48,50,54,58],"O":[61,64,65,66,68]},"card-21":{"B":[2,7,9,10,15],"I":[17,20,23,27,30],"N":[32,34,"FREE",42,43],"G":[48,50,52,54,60],"O":[62,67,68,71,75]},"card-22":{"B":[1,3,6,10,12],"I":[22,23,24,26,30],"N":[31,34,"FREE",36,41],"G":[47,49,53,57,59],"O":[64,65,70,71,74]},"card-23":{"B":[1,2,7,9,14],"I":[20,23,24,25,29],"N":[31,33,"FREE",40,41],"G":[47,48,49,53,60],"O":[63,66,69,70,74]},"card-24":{"B":[4,7,8,12,14],"I":[16,23,24,26,27],"N":[31,37,"FREE",40,42],"G":[47,54,56,59,60],"O":[62,63,65,68,70]},"card-25":{"B":[7,9,11,13,15],"I":[18,20,23,25,28],"N":[31,32,"FREE",44,45],"G":[46,49,50,56,60],"O":[65,69,70,74,75]},"card-26":{"B":[1,2,5,10,13],"I":[18,26,27,28,29],"N":[31,32,"FREE",39,41],"G":[46,53,54,59,60],"O":[63,64,68,69,74]},"card-27":{"B":[6,8,9,12,13],"I":[19,21,22,27,28],"N":[33,35,"FREE",38,44],"G":[46,52,53,55,57],"O":[61,62,67,72,75]},"card-28":{"B":[3,5,12,14,15],"I":[16,22,23,28,30],"N":[32,34,"FREE",40,43],"G":[46,53,57,58,59],"O":[63,64,68,71,73]},"card-29":{"B":[3,4,7,8,11],"I":[16,18,23,24,28],"N":[34,38,"FREE",41,45],"G":[49,52,54,57,60],"O":[65,70,71,72,73]},"card-30":{"B":[2,3,5,8,10],"I":[18,19,20,23,28],"N":[33,35,"FREE",39,40],"G":[47,49,50,53,54],"O":[65,67,71,72,75]},"card-31":{"B":[2,4,7,9,10],"I":[16,18,26,28,30],"N":[31,36,"FREE",41,42],"G":[48,50,51,53,55],"O":[63,67,69,70,74]},"card-32":{"B":[5,6,8,9,14],"I":[17,18,20,23,29],"N":[35,37,"FREE",41,45],"G":[49,54,56,58,60],"O":[62,67,72,74,75]},"card-33":{"B":[6,10,12,13,15],"I":[18,19,20,25,27],"N":[31,42,"FREE",44,45],"G":[48,50,51,58,59],"O":[61,62,63,64,70]},"card-34":{"B":[2,4,6,7,14],"I":[17,19,23,25,27],"N":[31,33,"FREE",38,41],"G":[48,50,56,58,60],"O":[61,68,71,72,75]},"card-35":{"B":[1,4,6,8,10],"I":[17,20,22,27,28],"N":[31,32,"FREE",38,39],"G":[48,51,54,57,59],"O":[61,64,66,67,71]},"card-36":{"B":[6,9,11,13,15],"I":[16,22,23,25,30],"N":[32,34,"FREE",40,43],"G":[51,53,56,57,58],"O":[62,64,65,66,69]},"card-37":{"B":[2,5,13,14,15],"I":[19,20,21,23,25],"N":[32,33,"FREE",38,45],"G":[47,48,54,56,59],"O":[63,70,71,73,74]},"card-38":{"B":[2,3,5,13,14],"I":[17,19,26,27,30],"N":[37,40,"FREE",44,45],"G":[46,50,51,52,53],"O":[61,62,63,64,73]},"card-39":{"B":[6,9,10,11,15],"I":[17,21,23,25,28],"N":[34,35,"FREE",41,45],"G":[46,48,50,51,54],"O":[65,67,68,69,75]},"card-40":{"B":[3,4,8,9,15],"I":[20,21,24,26,29],"N":[36,37,"FREE",40,44],"G":[47,50,51,55,57],"O":[64,66,68,73,74]},"card-41":{"B":[4,5,9,13,14],"I":[16,17,18,25,27],"N":[31,35,"FREE",41,42],"G":[51,53,56,59,60],"O":[63,65,66,68,69]},"card-42":{"B":[1,9,12,14,15],"I":[18,19,22,27,28],"N":[33,35,"FREE",37,38],"G":[48,52,53,56,57],"O":[63,67,68,70,75]},"card-43":{"B":[6,8,9,13,14],"I":[16,17,19,23,25],"N":[32,34,"FREE",40,41],"G":[51,54,56,57,60],"O":[63,64,65,73,75]},"card-44":{"B":[3,5,7,11,13],"I":[18,20,21,26,30],"N":[31,35,"FREE",39,40],"G":[48,50,54,57,59],"O":[63,64,67,70,73]},"card-45":{"B":[7,8,10,12,14],"I":[17,19,21,28,29],"N":[31,40,"FREE",44,45],"G":[49,51,54,55,58],"O":[62,71,72,73,74]},"card-46":{"B":[1,2,4,9,13],"I":[19,21,22,28,30],"N":[35,36,"FREE",38,41],"G":[46,47,54,55,59],"O":[61,64,67,71,73]},"card-47":{"B":[2,4,10,12,15],"I":[16,20,22,23,30],"N":[31,33,"FREE",39,41],"G":[48,49,53,55,57],"O":[61,63,66,71,75]},"card-48":{"B":[2,5,7,9,12],"I":[20,23,24,26,27],"N":[32,37,"FREE",41,44],"G":[47,55,56,59,60],"O":[61,64,67,70,75]},"card-49":{"B":[4,5,6,7,14],"I":[17,19,22,27,30],"N":[31,33,"FREE",40,45],"G":[49,52,53,54,59],"O":[62,63,72,73,74]},"card-50":{"B":[5,6,7,11,13],"I":[17,18,19,21,25],"N":[32,34,"FREE",41,44],"G":[47,49,56,57,60],"O":[64,66,68,73,74]},"card-51":{"B":[2,6,9,12,14],"I":[17,23,26,27,28],"N":[31,37,"FREE",42,45],"G":[46,48,49,50,55],"O":[61,68,70,71,74]},"card-52":{"B":[1,3,5,12,13],"I":[16,18,20,25,26],"N":[31,36,"FREE",41,43],"G":[47,54,56,59,60],"O":[63,65,66,68,74]},"card-53":{"B":[6,7,12,13,14],"I":[16,17,22,25,27],"N":[33,35,"FREE",42,44],"G":[46,51,52,54,58],"O":[61,65,67,72,74]},"card-54":{"B":[5,7,12,14,15],"I":[17,18,23,26,29],"N":[31,34,"FREE",38,41],"G":[47,49,51,54,55],"O":[65,68,72,73,74]},"card-55":{"B":[2,4,7,13,15],"I":[16,17,24,25,30],"N":[31,35,"FREE",43,44],"G":[50,52,54,55,59],"O":[63,64,66,70,74]},"card-56":{"B":[1,9,11,12,14],"I":[19,21,25,28,30],"N":[31,32,"FREE",43,45],"G":[47,50,52,54,57],"O":[62,63,66,67,70]},"card-57":{"B":[3,8,9,13,14],"I":[16,17,18,19,29],"N":[34,37,"FREE",41,44],"G":[48,50,53,58,60],"O":[61,62,67,68,72]},"card-58":{"B":[1,2,5,11,14],"I":[18,19,24,27,28],"N":[33,34,"FREE",38,40],"G":[49,54,55,57,60],"O":[66,68,72,73,75]},"card-59":{"B":[4,8,9,10,12],"I":[19,20,24,28,30],"N":[33,37,"FREE",42,45],"G":[47,48,49,53,60],"O":[61,63,65,69,71]},"card-60":{"B":[2,12,13,14,15],"I":[18,20,26,27,30],"N":[33,34,"FREE",42,45],"G":[46,54,57,59,60],"O":[63,66,68,72,74]},"card-61":{"B":[1,3,9,12,15],"I":[16,17,18,25,30],"N":[34,35,"FREE",37,44],"G":[49,50,51,54,57],"O":[63,65,68,72,74]},"card-62":{"B":[4,7,9,11,14],"I":[16,18,19,21,27],"N":[32,33,"FREE",38,43],"G":[46,48,53,58,60],"O":[67,68,71,72,75]},"card-63":{"B":[5,7,11,13,14],"I":[21,22,24,25,26],"N":[33,35,"FREE",43,45],"G":[51,53,55,57,58],"O":[64,65,70,73,74]},"card-64":{"B":[4,5,12,14,15],"I":[16,21,23,25,30],"N":[35,39,"FREE",41,44],"G":[46,50,51,56,59],"O":[62,64,66,67,69]},"card-65":{"B":[4,7,8,10,11],"I":[20,21,22,24,25],"N":[32,36,"FREE",42,45],"G":[48,50,58,59,60],"O":[66,67,69,70,75]},"card-66":{"B":[1,3,10,11,12],"I":[17,18,20,23,29],"N":[36,38,"FREE",40,44],"G":[47,48,51,54,57],"O":[61,65,67,70,72]},"card-67":{"B":[4,10,11,14,15],"I":[17,19,24,26,30],"N":[33,37,"FREE",41,45],"G":[46,50,52,53,58],"O":[61,65,72,74,75]},"card-68":{"B":[1,4,9,12,15],"I":[21,27,28,29,30],"N":[39,40,"FREE",43,45],"G":[48,49,53,58,59],"O":[62,64,71,72,73]},"card-69":{"B":[2,5,10,11,13],"I":[17,18,23,26,28],"N":[33,36,"FREE",44,45],"G":[47,50,51,56,58],"O":[61,63,66,70,71]},"card-70":{"B":[4,5,7,9,12],"I":[17,19,24,25,27],"N":[34,36,"FREE",40,45],"G":[47,53,54,56,57],"O":[66,67,68,73,74]},"card-71":{"B":[1,4,7,11,14],"I":[21,22,24,28,30],"N":[33,39,"FREE",41,44],"G":[46,47,51,56,58],"O":[62,69,73,74,75]},"card-72":{"B":[4,5,9,10,11],"I":[18,19,20,24,26],"N":[38,39,"FREE",42,45],"G":[48,50,54,55,60],"O":[61,62,67,68,70]},"card-73":{"B":[1,5,7,11,12],"I":[18,22,24,25,29],"N":[31,34,"FREE",38,45],"G":[49,50,51,53,55],"O":[64,65,67,69,71]},"card-74":{"B":[6,9,11,12,13],"I":[16,18,19,27,29],"N":[34,39,"FREE",42,44],"G":[47,48,49,51,55],"O":[61,67,68,72,75]},"card-75":{"B":[2,3,8,9,15],"I":[16,18,23,29,30],"N":[31,33,"FREE",41,42],"G":[50,52,54,56,58],"O":[61,64,67,68,70]},"card-76":{"B":[3,5,8,13,14],"I":[17,18,19,24,29],"N":[34,35,"FREE",43,45],"G":[48,50,52,54,57],"O":[62,64,71,73,75]},"card-77":{"B":[2,4,6,11,13],"I":[19,20,24,26,30],"N":[32,37,"FREE",41,45],"G":[48,51,52,53,56],"O":[63,66,67,68,69]},"card-78":{"B":[1,2,3,8,10],"I":[16,18,19,26,29],"N":[32,33,"FREE",41,43],"G":[52,53,55,58,60],"O":[61,63,65,72,75]},"card-79":{"B":[1,5,8,13,15],"I":[17,20,23,25,27],"N":[35,36,"FREE",39,45],"G":[50,52,53,55,58],"O":[62,64,65,71,75]},"card-80":{"B":[9,10,11,13,15],"I":[18,20,22,24,25],"N":[31,35,"FREE",37,44],"G":[46,48,49,50,53],"O":[68,71,72,73,75]},"card-81":{"B":[5,6,7,9,12],"I":[23,24,25,28,29],"N":[33,35,"FREE",39,40],"G":[48,51,52,56,59],"O":[61,63,64,65,70]},"card-82":{"B":[5,6,11,13,15],"I":[16,19,21,22,26],"N":[33,35,"FREE",38,45],"G":[47,48,54,57,58],"O":[63,64,65,70,73]},"card-83":{"B":[1,4,5,11,13],"I":[23,25,26,27,28],"N":[31,33,"FREE",43,45],"G":[50,52,54,56,57],"O":[63,64,66,71,72]},"card-84":{"B":[5,10,11,13,15],"I":[17,18,25,29,30],"N":[31,40,"FREE",44,45],"G":[48,50,51,55,56],"O":[63,64,67,70,74]},"card-85":{"B":[2,4,5,9,15],"I":[18,26,28,29,30],"N":[34,36,"FREE",44,45],"G":[46,51,53,55,57],"O":[62,63,69,72,74]},"card-86":{"B":[1,2,6,10,14],"I":[17,19,21,24,27],"N":[39,41,"FREE",43,45],"G":[46,47,52,58,59],"O":[62,67,68,70,74]},"card-87":{"B":[5,9,10,12,14],"I":[20,22,24,25,27],"N":[31,38,"FREE",41,44],"G":[47,48,50,54,59],"O":[64,66,68,69,75]},"card-88":{"B":[1,6,10,12,13],"I":[16,24,25,26,27],"N":[31,34,"FREE",39,42],"G":[49,50,51,56,60],"O":[64,65,68,71,72]},"card-89":{"B":[1,2,3,10,13],"I":[16,23,25,27,30],"N":[33,38,"FREE",41,45],"G":[46,49,57,58,60],"O":[63,68,72,73,75]},"card-90":{"B":[3,5,9,13,14],"I":[19,20,22,23,27],"N":[36,40,"FREE",43,45],"G":[49,54,55,59,60],"O":[61,65,66,67,70]},"card-91":{"B":[2,10,12,14,15],"I":[20,21,22,25,28],"N":[32,35,"FREE",40,44],"G":[46,49,57,59,60],"O":[62,68,69,71,73]},"card-92":{"B":[2,4,8,10,13],"I":[17,18,20,28,30],"N":[36,38,"FREE",44,45],"G":[46,52,54,55,58],"O":[61,62,66,68,74]},"card-93":{"B":[4,10,11,12,14],"I":[17,24,26,27,30],"N":[31,37,"FREE",42,44],"G":[49,52,53,55,58],"O":[67,68,69,70,74]},"card-94":{"B":[4,5,6,9,10],"I":[19,23,24,25,26],"N":[31,33,"FREE",41,43],"G":[49,51,54,55,60],"O":[64,67,71,72,73]},"card-95":{"B":[6,7,12,13,14],"I":[17,18,23,25,26],"N":[31,35,"FREE",42,43],"G":[49,50,51,52,57],"O":[64,65,66,68,69]},"card-96":{"B":[1,3,7,8,12],"I":[17,18,26,28,30],"N":[31,33,"FREE",38,39],"G":[46,47,52,55,60],"O":[64,65,68,71,72]},"card-97":{"B":[1,4,7,11,15],"I":[16,20,25,26,30],"N":[32,36,"FREE",38,42],"G":[48,51,52,56,60],"O":[61,62,63,65,71]},"card-98":{"B":[4,6,7,11,14],"I":[17,18,19,20,24],"N":[33,35,"FREE",37,45],"G":[48,49,51,53,60],"O":[62,64,67,70,74]},"card-99":{"B":[3,5,8,11,13],"I":[17,21,23,25,30],"N":[31,32,"FREE",42,43],"G":[46,50,53,55,56],"O":[63,64,68,72,74]},"card-100":{"B":[1,2,4,9,13],"I":[19,20,22,24,27],"N":[31,38,"FREE",40,43],"G":[46,47,50,54,57],"O":[61,62,64,65,67]}}

// ==========================================================
// ኤለመንት መራጮች
// ==========================================================
const mainWrapper = document.querySelector('.main-wrapper'); // የዋናው ጨዋታ መያዣ
const lobbyScreen = document.getElementById('lobby-screen');
const cardSelectionScreen = document.getElementById('card-selection-screen');
const activeGameScreen = document.getElementById('active-game-screen');

const joinButton = document.getElementById('join-btn');
const cardGridElement = document.getElementById('card-grid'); // አዲስ፡ 100 ካርዶች የሚታዩበት
const selectedCardDisplay = document.getElementById('selected-card-display'); // ካርድ ሲመረጥ የሚታይበት
const selectCardButton = document.getElementById('select-card-btn'); // አዲስ፡ Play የሚለው አዝራር

const masterGridElement = document.getElementById('master-grid');
const playerCardElement = document.getElementById('player-bingo-card');
const calledNumberDisplay = document.getElementById('called-number-display'); 
const calledHistoryArea = document.getElementById('called-history');
const bingoButton = document.getElementById('central-bingo-btn');
const cardIdDisplay = document.getElementById('card-id'); 

// ==========================================================
// ግሎባል ሁኔታ ተለዋዋጮች
// ==========================================================
let currentGameState = 'LOBBY'; // LOBBY, CARD_SELECTION, ACTIVE_GAME
let calledNumbers = [];
let gameInterval;
const MAX_HISTORY_CHIPS = 10; 
let selectedPlayerCardId = null; // ተጫዋቹ የመረጠው የካርድ ID

// ==========================================================
// 8. የሁኔታ መቀየሪያ ተግባር (Screen Controller)
// ==========================================================
function setGameState(newState) {
    currentGameState = newState;
    
    // ሁሉንም ደብቅ
    lobbyScreen.style.display = 'none';
    cardSelectionScreen.style.display = 'none';
    activeGameScreen.style.display = 'none';
    
    // በሚፈለገው ሁኔታ መሰረት አሳይ
    if (newState === 'LOBBY') {
        lobbyScreen.style.display = 'block';
    } else if (newState === 'CARD_SELECTION') {
        cardSelectionScreen.style.display = 'block';
        renderCardSelectionGrid(); // ካርድ መምረጫውን ሎድ አድርግ
    } else if (newState === 'ACTIVE_GAME') {
        activeGameScreen.style.display = 'block';
        // ጨዋታው ሲጀመር Active Gameን ሎድ አድርግ
        initializeActiveGame(selectedPlayerCardId); 
    }
}

// ==========================================================
// 9. የካርድ መምረጫ ስክሪን Logic (CARD_SELECTION)
// ==========================================================

// አሁን የተመረጠውን ካርድ ምልክት የሚያደርግ ግሎባል ተለዋዋጭ
let currentSelectedCardElement = null;

function renderCardSelectionGrid() {
    cardGridElement.innerHTML = '';
    
    // በ STATIC_CARD_POOL ውስጥ ያሉትን ሁሉንም ካርዶች አሳይ
    Object.keys(STATIC_CARD_POOL).forEach(cardId => {
        const cardNum = cardId.replace('card-', '');
        
        const cardChip = document.createElement('div');
        cardChip.classList.add('card-selection-chip');
        cardChip.textContent = `#${cardNum}`;
        cardChip.dataset.cardId = cardId;
        
        cardChip.addEventListener('click', () => {
            // ምልክት አድርግ
            if (currentSelectedCardElement) {
                currentSelectedCardElement.classList.remove('selected');
            }
            cardChip.classList.add('selected');
            currentSelectedCardElement = cardChip;
            
            selectedPlayerCardId = cardId;
            
            // የተመረጠውን ካርድ ቁጥር ከዋናው ሰንጠረዥ በላይ አሳይ
            selectedCardDisplay.textContent = `የተመረጠ ካርድ: #${cardNum}`;
            selectCardButton.disabled = false;
        });
        
        cardGridElement.appendChild(cardChip);
    });
    
    // መጀመሪያ ላይ ምንም ካርድ ስላልተመረጠ አዝራሩን አጥፋ
    selectCardButton.disabled = true;
    selectedCardDisplay.textContent = 'ካርድ ይምረጡ...';
}

// ==========================================================
// 10. የጨዋታውን ማስጀመር (Active Game Initialization)
// ==========================================================
function initializeActiveGame(cardId) {
    // የቀድሞ ሁኔታዎችን አጽዳ
    calledNumbers = [];
    calledHistoryArea.innerHTML = '';
    
    // Master Gridን አዘጋጅ
    renderMasterGrid(); 
    
    // የተመረጠውን ካርድ ጫን
    renderPlayerCard(cardId);
    
    // የቁጥር መጥራት ዑደቱን ጀምር
    startGameLoop(); 
}

// ==========================================================
// 11. የኤለመንት Logic (ከዚህ በፊት የሰሩዋቸው)
// ==========================================================

// 1. 75 ቁጥሮችን Master Grid ላይ የሚሞላ ተግባር
function renderMasterGrid() {
    masterGridElement.innerHTML = '';
    for (let i = 0; i < 75; i++) {
        const rowIndex = Math.floor(i / 5);
        const colIndex = i % 5;
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
    
    if (cardIdDisplay) {
        cardIdDisplay.textContent = cardId.replace('card-', '');
    }
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
    const masterCell = document.querySelector(`.master-cell[data-number="${newNumber}"]`);
    if (masterCell) {
        masterCell.classList.add('called');
    }
    calledNumberDisplay.textContent = labeledNumber; 
    const historyChip = document.createElement('span');
    historyChip.textContent = labeledNumber;
    historyChip.classList.add('history-chip', label);
    calledHistoryArea.prepend(historyChip);
    if (calledHistoryArea.children.length > MAX_HISTORY_CHIPS) {
        calledHistoryArea.removeChild(calledHistoryArea.lastChild);
    }
}

// 6. የማሸነፊያ (Bingo) ቼክ Logic
function checkBingo() {
    const cells = playerCardElement.querySelectorAll('.cell');
    const markedStatus = [];
    for (let i = 0; i < CARD_SIZE; i++) { 
        markedStatus[i] = [];
        for (let j = 0; j < CARD_SIZE; j++) { 
            const cellIndex = (i * CARD_SIZE) + j;
            markedStatus[i][j] = cells[cellIndex].classList.contains('marked');
        }
    }
    // Rows Check
    for (let i = 0; i < CARD_SIZE; i++) {
        if (markedStatus[i].every(status => status)) return true;
    }
    // Columns Check
    for (let j = 0; j < CARD_SIZE; j++) {
        let isWinningColumn = true;
        for (let i = 0; i < CARD_SIZE; i++) {
            if (!markedStatus[i][j]) {
                isWinningColumn = false;
                break;
            }
        }
        if (isWinningColumn) return true;
    }
    // Diagonals Check
    let diag1 = true; let diag2 = true; 
    for (let i = 0; i < CARD_SIZE; i++) {
        if (!markedStatus[i][i]) diag1 = false;
        if (!markedStatus[i][CARD_SIZE - 1 - i]) diag2 = false;
    }
    return diag1 || diag2;
}

// 7. የጨዋታውን ቆጣሪ ማስጀመር
function startGameLoop() {
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(callNumber, 3000); 
}


// ==========================================================
// ገጹ ሲከፈት ማስጀመሪያዎች (Event Listeners)
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
    // መጀመሪያ ላይ ወደ Lobby ስክሪን ቅየር
    setGameState('LOBBY'); 

    if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.ready();
    }
    
    // --- LOBBY Listeners ---
    joinButton.addEventListener('click', () => {
        setGameState('CARD_SELECTION');
    });

    // --- CARD SELECTION Listeners ---
    selectCardButton.addEventListener('click', () => {
        if (selectedPlayerCardId) {
            setGameState('ACTIVE_GAME');
        } else {
            alert('እባክዎ መጀመሪያ አንድ ካርድ ይምረጡ።');
        }
    });

    // --- ACTIVE GAME Listeners ---
    document.getElementById('exit-btn').addEventListener('click', () => {
        if (gameInterval) clearInterval(gameInterval); 
        // ወደ ካርድ መምረጫው ተመለስ (ወይም ወደ Lobby)
        setGameState('LOBBY'); 
    });

    document.getElementById('refresh-btn').addEventListener('click', () => {
        if (gameInterval) clearInterval(gameInterval); 
        // የMaster Gridን ለማጥራት ገጹን reload ማድረግ
        window.location.reload(); 
    });

    // Bingo አዝራር Logic
    bingoButton.addEventListener('click', () => {
        if (gameInterval) clearInterval(gameInterval); 
        const hasWon = checkBingo();
        if (hasWon) {
            alert('🎉 እንኳን ደስ አለዎት! ቢንጎ አሸንፈዋል! 🎉');
            bingoButton.textContent = 'WON!';
            bingoButton.style.backgroundColor = '#28a745'; 
        } else {
            alert('❌ ቢንጎ ገና አልተሞላም! ጨዋታው ይቀጥላል።');
            startGameLoop(); 
        }
    });
});
