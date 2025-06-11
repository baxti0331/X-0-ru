const words = [
  "абрик", "аванс", "аврал", "автор", "агент", "адрес", "азарт", "акция", "акула", "актер",
  "алмаз", "альфа", "амбар", "анонс", "апорт", "арена", "арест", "армия", "атака", "афера",
  "базис", "байка", "балет", "балка", "банда", "банка", "барон", "бегле", "белок", "билет",
  "бинок", "биржа", "богат", "бокал", "болид", "бонус", "борец", "босс", "броня", "будка",
  "буфет", "бухта", "взлет", "вилка", "винт", "вирус", "волна", "время", "выбор", "вышка",
  "газон", "гайка", "галка", "гамма", "гараж", "гвард", "гвозд", "гений", "герой", "гитара",
  "глава", "гнезд", "голос", "грань", "графа", "губка", "густо", "дача", "дверь", "дедук",
  "дележ", "детка", "дичь", "долг", "домик", "донор", "дорог", "доска", "драка", "драма",
  "дробь", "друг", "дымок", "еврей", "жабра", "жажда", "ждать", "желез", "жена", "жердь",
  "живот", "жирок", "жница", "забег", "закон", "засор", "заход", "заяц", "звено", "звонк",
  "зебра", "зодчий", "зола", "зона", "зубец", "игрок", "идол", "изба", "икона", "импорт",
  "индик", "искры", "испуг", "кабан", "казак", "калий", "калит", "камин", "канал", "каска",
  "квант", "кедр", "коза", "козел", "койка", "кокон", "колба", "колон", "комар", "конек",
  "копия", "корка", "короб", "коса", "котел", "крага", "кран", "кредо", "крик", "кроль",
  "круг", "кубик", "кулак", "купаж", "курс", "кусок", "ладан", "ладья", "лакей", "лампа",
  "ланка", "лапка", "ларец", "латте", "лепет", "леска", "лето", "лидер", "лист", "литер",
  "ложка", "локон", "лоза", "лыжа", "мажор", "мазок", "майор", "макет", "малый", "мантия",
  "марка", "маска", "мастер", "матка", "медик", "мелод", "милка", "мираж", "миска", "молва",
  "мороз", "моряк", "музей", "мусор", "набор", "накал", "напев", "наука", "начал", "невод",
  "немец", "низко", "нитка", "новак", "нога", "носик", "обида", "облик", "огонь", "одежда",
  "ожог", "озеро", "округ", "олива", "опера", "опасн", "оплот", "опора", "осина", "остов",
  "отвал", "отель", "отказ", "отлив", "отрез", "офсет", "очаг", "пакет", "панда", "парус",
  "паста", "пауза", "пена", "перец", "песок", "пикет", "пила", "план", "племя", "плоть",
  "побег", "повар", "подвал", "поднос", "позыв", "пойма", "покуп", "поле", "полос", "помпа",
  "порог", "посох", "поток", "почва", "почка", "празд", "прима", "проба", "пруд", "прыжок",
  "птица", "пушка", "путь", "пчела", "работа", "радио", "разговор", "ракет", "рамка", "рапорт",
  "растор", "рвать", "речка", "рисок", "рота", "рубка", "рулет", "рулон", "рыбак", "рысь",
  "ряда", "рядок", "сабля", "сайт", "сало", "самец", "самка", "сапог", "сарай", "сварка",
  "свеча", "сектор", "сено", "сила", "сироп", "сказка", "скала", "сквер", "склад", "склон",
  "слава", "слово", "снова", "снос", "сокол", "солид", "сосуд", "спектр", "спина", "спичка",
  "спор", "способ", "среда", "срок", "сталь", "степь", "стих", "стол", "страх", "строка",
  "ступа", "суть", "сфера", "сырок", "сыщик", "табак", "тайна", "талант", "талия", "танец",
  "тара", "тариф", "театр", "тело", "темп", "тенор", "терем", "тигр", "тимус", "тираж",
  "тихое", "точка", "трава", "треск"
];

let score = 0;
let usedIndexes = new Set();
let currentWord = "";
let bottomLettersArr = [];
let topSlotsArr = [];
let hintUsed = false;

const scoreboard = document.getElementById('scoreboard');
const topSlots = document.getElementById('topSlots');
const bottomLetters = document.getElementById('bottomLetters');
const hintButton = document.getElementById('hintButton');
const message = document.getElementById('message');
const loadingScreen = document.getElementById('loadingScreen');

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function pickNewWord() {
  if (usedIndexes.size === words.length) {
    message.style.color = "#fff";
    message.textContent = "Слова закончились! Игра окончена.";
    topSlots.innerHTML = "";
    bottomLetters.innerHTML = "";
    hintButton.disabled = true;
    return false;
  }
  let idx;
  do {
    idx = Math.floor(Math.random() * words.length);
  } while (usedIndexes.has(idx));
  usedIndexes.add(idx);
  currentWord = words[idx];
  return true;
}

function prepareGame() {
  hintUsed = false;
  message.textContent = "";
  hintButton.disabled = false;

  // Очистка
  topSlots.innerHTML = "";
  bottomLetters.innerHTML = "";
  topSlotsArr = [];
  bottomLettersArr = [];

  // Создаем слоты для букв слова
  for (let i = 0; i < currentWord.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    slot.dataset.index = i;
    slot.textContent = '';
    topSlots.appendChild(slot);
    topSlotsArr.push(slot);
  }

  // Создаем перемешанный массив букв
  bottomLettersArr = currentWord.split('');
  shuffleArray(bottomLettersArr);

  // Отрисовка букв снизу
  for (let i = 0; i < bottomLettersArr.length; i++) {
    const letter = document.createElement('div');
    letter.className = 'letter';
    letter.textContent = bottomLettersArr[i];
    letter.dataset.index = i;
    letter.dataset.letter = bottomLettersArr[i];
    letter.addEventListener('click', () => onLetterClick(i));
    bottomLetters.appendChild(letter);
  }
}

function onLetterClick(i) {
  if (bottomLettersArr[i] === null) return; // уже использовано

  // Найдем первый пустой слот сверху
  let slotIndex = topSlotsArr.findIndex(slot => slot.textContent === '');
  if (slotIndex === -1) return; // все слоты заполнены

  // Заполняем слот
  topSlotsArr[slotIndex].textContent = bottomLettersArr[i];
  topSlotsArr[slotIndex].classList.add('filled');

  // Помечаем букву снизу как использованную
  const letterDiv = bottomLetters.children[i];
  letterDiv.classList.add('used');
  letterDiv.style.pointerEvents = 'none';
  bottomLettersArr[i] = null;

  checkWordComplete();
}

function checkWordComplete() {
  const guess = topSlotsArr.map(slot => slot.textContent).join('');
  if (guess.length !== currentWord.length) return;

  if (guess === currentWord) {
    score += currentWord.length * 10;
    scoreboard.textContent = `Очки: ${score}`;
    message.style.color = "#7FFF00";
    message.textContent = "Правильно!";

    markSlotsCorrect();
    hintButton.disabled = true;

    setTimeout(() => {
      if (pickNewWord()) {
        prepareGame();
        message.textContent = "";
      }
    }, 1500);
  } else {
    message.style.color = "#ff4444";
    message.textContent = "Неверно. Попробуй еще.";
  }
}

function markSlotsCorrect() {
  topSlotsArr.forEach(slot => {
    slot.classList.add('correct');
  });
}

hintButton.addEventListener('click', () => {
  if (hintUsed) return;

  // Подсказка — подставляем первую букву, если она не стоит на месте
  for (let i = 0; i < currentWord.length; i++) {
    if (topSlotsArr[i].textContent !== currentWord[i]) {
      // Найдем букву снизу и имитируем нажатие
      for (let j = 0; j < bottomLettersArr.length; j++) {
        if (bottomLettersArr[j] === currentWord[i]) {
          onLetterClick(j);
          hintUsed = true;
          hintButton.disabled = true;
          return;
        }
      }
    }
  }
});

window.onload = () => {
  if (pickNewWord()) {
    prepareGame();
    loadingScreen.style.display = 'none';
  }
};
