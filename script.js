// Список слов (~1000 слов, для примера здесь сокращён)
const words = [
  "аванс","агент","адрес","акула","актер","алмаз","амбар","арена","армия","атака",
  "базис","балет","балка","банда","банка","барон","билет","биржа","богат","бонус",
  "вирус","волна","время","выбор","вышка","галка","гараж","гений","герой","гитара",
  "голос","графа","губка","дача","дверь","дележ","детка","долг","домик","донор",
  "доска","драма","друг","еврей","жажда","ждать","жена","живот","закон","заяц",
  "зебра","зона","игрок","идол","изба","икона","индик","искры","казак","камин",
  "канал","каска","квант","колон","комар","копия","короб","коса","котел","кран",
  "круг","кулак","курс","лакей","лампа","ланка","лапка","ларец","латте","леска",
  "лето","лидер","лист","ложка","локон","лыжа","мажор","малый","марка","маска",
  "медик","мираж","миска","молва","мороз","моряк","музей","мусор","набор","накал",
  "напев","наука","начал","немец","низко","нитка","новак","нога","носик","обида",
  "облик","огонь","одежда","ожог","озеро","округ","опера","опасн","опора","осина",
  "отель","отказ","отлив","отрез","очаг","пакет","панда","парус","паста","пауза",
  "перец","песок","пила","план","племя","плоть","побег","повар","подвал","позыв",
  "покуп","поле","полос","помпа","порог","посох","поток","почва","почка","пруд",
  "прыжок","птица","пушка","пчела","работа","радио","ракет","рамка","рапорт","растор",
  "рота","рубка","рулет","рулон","рыбак","рысь","рядок","сабля","сайт","сало",
  "самец","сапог","сарай","сварка","свеча","сектор","сила","сироп","сказка","скала",
  "склад","склон","слава","слово","снова","сокол","солид","сосуд","спина","спичка",
  "способ","среда","срок","сталь","степь","стих","стол","страх","строка","ступа",
  "суть","сфера","сырок","сыщик","табак","тайна","талант","талия","танец","тариф",
  "театр","тело","темп","тенор","терем","тигр","тимус","тираж","тихое","точка",
  "трава","треск","фабрика","фигура","философ","флотилия","хозяйка","цветок","человек","школа",
  "экран","электроника","юбилей","якорь"
  // Добавьте сюда остальные слова для полного списка
];

const roundTimeSec = 60;
const levels = [
  {minLen: 4, maxLen: 5},
  {minLen: 5, maxLen: 6},
  {minLen: 6, maxLen: 8},
  {minLen: 8, maxLen: 100},
];

let score = 0;
let usedIndexes = new Set();
let currentWord = "";
let shuffledWord = [];
let selectedLetters = [];
let level = 0;
let timerInterval = null;
let timeLeft = roundTimeSec;

const scoreboard = document.getElementById('scoreboard');
const wordContainer = document.getElementById('wordContainer');
const hintButton = document.getElementById('hintButton');
const nextLevelButton = document.getElementById('nextLevelButton');
const message = document.getElementById('message');
const bottomLetters = document.getElementById('bottomLetters');
const timerEl = document.getElementById('timer');
const levelEl = document.getElementById('level');
const loadingScreen = document.getElementById('loadingScreen');
const recordBoard = document.getElementById('recordBoard');

function shuffleArray(array) {
  for(let i = array.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function pickWordForLevel() {
  let filtered = words.filter(w => w.length >= levels[level].minLen && w.length <= levels[level].maxLen);
  if(filtered.length === 0) return null;

  let idx;
  do {
    idx = Math.floor(Math.random() * filtered.length);
  } while (usedIndexes.has(idx) && usedIndexes.size < filtered.length);
  usedIndexes.add(idx);
  return filtered[idx];
}

function renderWord() {
  wordContainer.innerHTML = "";
  shuffledWord.forEach((letter, i) => {
    const span = document.createElement('div');
    span.textContent = letter;
    span.classList.add('letter');
    span.addEventListener('click', () => {
      if(selectedLetters.includes(i)) return;
      selectedLetters.push(i);
      renderSelectedWord();
    });
    wordContainer.appendChild(span);
  });
}

function renderSelectedWord() {
  bottomLetters.innerHTML = "";
  selectedLetters.forEach(i => {
    const span = document.createElement('div');
    span.textContent = shuffledWord[i];
    span.classList.add('letter');
    bottomLetters.appendChild(span);
  });
}

function checkAnswer() {
  const answer = selectedLetters.map(i => shuffledWord[i]).join('');
  if(answer === currentWord){
    score += currentWord.length; 
    updateScore();
    message.textContent = "Правильно! +"+currentWord.length+" очков!";
    nextLevelButton.style.display = "inline-block";
    hintButton.disabled = true;
    clearInterval(timerInterval);
    startFireworkEffect();
  } else {
    message.textContent = "Неверно, попробуйте снова.";
    // Добавить эффект подсветки неправильных букв
    wordContainer.childNodes.forEach((node, idx) => {
      if(selectedLetters.includes(idx)){
        node.classList.add('wrong-letter');
        setTimeout(() => node.classList.remove('wrong-letter'), 600);
      }
    });
  }
}

function updateScore() {
  scoreboard.textContent = `Очки: ${score}`;
  recordBoard.textContent = `Рекорд: ${localStorage.getItem('anagramRecord') || 0}`;
  levelEl.textContent = `Уровень: ${level+1}`;
}

function startTimer() {
  timeLeft = roundTimeSec;
  timerEl.textContent = `Время: ${timeLeft}`;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Время: ${timeLeft}`;
    if(timeLeft <= 0){
      clearInterval(timerInterval);
      message.textContent = `Время вышло! Правильное слово: ${currentWord}`;
      hintButton.disabled = true;
      nextLevelButton.style.display = "inline-block";
    }
  }, 1000);
}

function startLevel() {
  selectedLetters = [];
  currentWord = pickWordForLevel();
  if(!currentWord){
    message.textContent = "Слова для данного уровня закончились!";
    return;
  }
  shuffledWord = currentWord.split('');
  shuffleArray(shuffledWord);
  renderWord();
  renderSelectedWord();
  message.textContent = "";
  hintButton.disabled = false;
  nextLevelButton.style.display = "none";
  startTimer();
  updateScore();
}

function giveHint() {
  if(score <= 0) {
    message.textContent = "Недостаточно очков для подсказки";
    return;
  }
  score--;
  updateScore();
  // Показываем одну букву в правильном порядке
  if(selectedLetters.length < currentWord.length){
    const nextLetterIndex = currentWord.indexOf(currentWord[selectedLetters.length]);
    // Находим индекс буквы в shuffledWord
    const letterToHighlight = currentWord[selectedLetters.length];
    let highlightIndex = shuffledWord.findIndex((l, i) => l === letterToHighlight && !selectedLetters.includes(i));
    if(highlightIndex !== -1){
      wordContainer.childNodes[highlightIndex].classList.add('highlight');
      setTimeout(() => {
        wordContainer.childNodes[highlightIndex].classList.remove('highlight');
      }, 1000);
    }
  }
}

function startFireworkEffect() {
  for(let i=0; i<20; i++){
    const firework = document.createElement('div');
    firework.classList.add('firework');
    firework.style.left = (Math.random() * window.innerWidth) + "px";
    firework.style.top = (Math.random() * window.innerHeight) + "px";
    firework.style.width = "10px";
    firework.style.height = "10px";
    firework.style.backgroundColor = `hsl(${Math.random()*360}, 100%, 50%)`;
    document.body.appendChild(firework);
    setTimeout(() => {
      firework.remove();
    }, 700);
  }
}

hintButton.addEventListener('click', () => {
  giveHint();
});

nextLevelButton.addEventListener('click', () => {
  level++;
  if(level >= levels.length){
    message.textContent = "Поздравляем! Вы прошли все уровни!";
    wordContainer.innerHTML = "";
    hintButton.disabled = true;
    nextLevelButton.style.display = "none";
    clearInterval(timerInterval);
    // Обновление рекорда
    const record = localStorage.getItem('anagramRecord') || 0;
    if(score > record) {
      localStorage.setItem('anagramRecord', score);
      recordBoard.textContent = `Рекорд: ${score}`;
    }
    return;
  }
  startLevel();
});

window.addEventListener('load', () => {
  loadingScreen.classList.add('fade-out');
  setTimeout(() => loadingScreen.style.display = 'none', 500);
  updateScore();
  startLevel();
});

// Позволяет кликать на буквы для выбора
wordContainer.addEventListener('click', (e) => {
  if(!e.target.classList.contains('letter')) return;
  const index = Array.from(wordContainer.childNodes).indexOf(e.target);
  if(selectedLetters.includes(index)) return;
  selectedLetters.push(index);
  renderSelectedWord();

  if(selectedLetters.length === currentWord.length){
    checkAnswer();
  }
});
