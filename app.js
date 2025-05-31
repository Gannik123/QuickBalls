// ===== HTML Elements =====
const gameField = document.getElementById('gameField');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const totalScoreDisplay = document.getElementById('totalScore');
const timerDisplay = document.getElementById('timer');

// ===== Game Variables =====
let score = 0;
let timeLeft = 0;
let gameTimer;// почне зворотній відлік та зупинить гру
let ballIntervals = [];
let totalScore = parseInt(localStorage.getItem('totalScore')) || 0; //Крок 2 дістати з LocalStorage 
totalScoreDisplay.textContent = `Всього набрано: ${totalScore}🪙`; //Крок 3 відображаємо при оновленні сторінки

// ===== Difficulty Settings =====
  const difficultySettings = {
    easy: [
      { type: 'blue', interval: 1500, size: 80 }
    ],
  medium: [
    { type: 'blue', interval: 1500, size: 70 },
    { type: 'green', interval: 4000, size: 70 },
    { type: 'red', interval: 4500, size: 80 }
  ],  
  hard: [
    { type: 'blue', interval: 1300, size: 60 },
    { type: 'green', interval: 3500, size: 50 },
    { type: 'red', interval: 6500, size: 70 },
    { type: 'red', interval: 4500, size: 70 }
  ]
};
// part 2

let selectedDifficulty = 'easy'; // Значення за замовчуванням або null

document.querySelectorAll('.difficulty-btn').forEach(button => {
  button.addEventListener('click', () => {
    selectedDifficulty = button.value;

    // Виділяємо активну кнопку
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
    button.classList.add('selected');

    console.log('Обрана складність:', selectedDifficulty);
  });
});
// part 2 end

// ===== Create Ball =====
function createBall(type, size = 40) {
  const ball = document.createElement('div');
  ball.classList.add('ball', type);

// Кінець Part 3?  Використання скіна в грі

const skinId = selectedSkins[type];
console.log(skinId) // ті імена кульок, які у нас обрані

const skin = skins[type].find(s => s.id === skinId);//.find() шукає перший елемент, що відповідає умові.
//s — це кожен об'єкт у масиві скінів (має id, name, price, image)
//  s.id === skinId — умова: знаходимо скін, у якого id такий самий, як вибраний користувачем

console.log(skin)
console.log(skin.img)

if (skin && skin.img) { // якщо skin існує та в ньому є картинка, то:  
  ball.style.backgroundImage = `url('img/${skin.img}')`;
  ball.style.backgroundSize = 'cover';
  ball.style.backgroundRepeat = 'no-repeat';
}

// Part 3 end

  const maxX = gameField.clientWidth - size;
  const maxY = gameField.clientHeight - size;
  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);

  ball.style.left = `${x}px`;
  ball.style.top = `${y}px`;
  ball.style.width = `${size}px`;
  ball.style.height = `${size}px`;


  ball.addEventListener('click', () => {
       if (navigator.vibrate) {
      navigator.vibrate(100);// викликаємо вібрацію, якщо підтримується
      console.log("Вібрація!");
    }
    ball.classList.add('shake');
setTimeout(() => ball.classList.remove('shake'), 300);
    if (type === 'blue') {
      if (selectedDifficulty === "hard") {
        score += 2
      } 
      score++;
    } else if (type === 'green') {
      if (selectedDifficulty === "hard") {
        score += 5
      } 
      score += 5;
      timeLeft += 1;
    } else if (type === 'red') {
      if (selectedDifficulty === "hard") {
        score = 0
        scoreDisplay.innerText = "Очки:0"
        endGame(); // 👈 Тут закінчується гра одразу на hard при кліку на червону кульку
        return;
      } else {
        score -= 3;
        if (score < 0) score = 0;
      }
    }

    scoreDisplay.textContent = `Очки: ${score}`;
    ball.remove();
  });

  
  gameField.appendChild(ball);

  setTimeout(() => {
    if (gameField.contains(ball)) ball.remove();
  }, 1500);
}

// ===== Start Game =====
function startGame() {
  document.querySelector(".difficulty-box").style.display = "none" // приховує вибір складності
  score = 0;
  timeLeft = 20;
  scoreDisplay.textContent = 'Очки: 0';
  timerDisplay.textContent = `Час: ${timeLeft}`;

  console.log(ballIntervals)
  ballIntervals.forEach(id => clearInterval(id));
  ballIntervals = [];
  clearInterval(gameTimer);   // Очищаємо інтервал ігрового таймеру

  // part 2
  console.log(difficultySettings["hard"])// дивимось на ключ

  const settings = difficultySettings[selectedDifficulty]; // [] бо difficulty- змінна
  console.log(settings) // масив із обраною складністю
 // part 2 ....
 
  settings.forEach(config => { // з forEach Перебираємо масив об'єктів з налаштуваннями (тип, інтервал, розмір)
    const intervalId = setInterval(() => { // Для кожного типу запускаємо таймер, який періодично викликає createBall
      createBall(config.type, config.size); // Створюємо кульку з вказаним типом (колір) і розміром
    }, config.interval); // Частота появи кульки для цього типу (наприклад, 1500 мс для синьої)
    
    ballIntervals.push(intervalId); // Зберігаємо ID інтервалу, щоб потім можна було його зупинити при завершенні гри
    console.log(ballIntervals)
  });

  gameTimer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Час: ${timeLeft}`;
    
    if (timeLeft <= 0) {
      endGame();
    }

  }, 1000);
}
// End game
function endGame() {
    clearInterval(gameTimer);
    ballIntervals.forEach(id => clearInterval(id)); // очистили по суті intervalId кожної кульки   
    ballIntervals = []; // потрібно для очищення всього вмісту перед новою грою

    totalScore += score;
    totalScoreDisplay.textContent = `Всього набрано: ${totalScore}🪙`;

    localStorage.setItem('totalScore', totalScore); // //Крок 1 додати до LocalStorage  
    alert(`Гру завершено! Твій результат: ${score} очок.`);
    document.querySelector(".difficulty-box").style.display = "block" // повертає вибір складності
  }
startBtn.addEventListener('click', startGame);

// Part 3

// ===== Структура скінів =====
const skins = {
  blue: [
    { id: 'classic', name: 'Класичний', price: 0, img: 'blue-classic.png' },
    { id: 'emoji-blue', name: 'emoji-blue', price: 20, img: 'emoji-blue.png' },
    { id: 'capybara', name: 'capybara', price: 400, img: 'capy.gif' },
  ],
  green: [
    { id: 'classic', name: 'Класичний', price: 0, img: 'green-classic.png' },
    { id: 'emoji-cool-dude', name: 'emoji-cool-dude', price: 25, img: 'emoji-cool-dude.webp' },
    { id: 'pingvin', name: 'pingvin', price: 200, img: 'pingvin.gif' }
  ],
  red: [
    { id: 'classic', name: 'Класичний', price: 0, img: 'red-classic.png' },
    { id: 'emoji-angree', name: 'emoji-angree', price: 40, img: 'emoji-angree.png' },
    { id: 'bomb', name: 'bomb', price: 500, img: 'bomb-1.webp' },
    { id: 'poop', name: 'poop', price: 100, img: 'poop.gif' }
  ]
};

// Окрема функція для збереження обох об’єктів в LocalStorage після будь-якої зміни (купівля або вибір скіна).
function saveShopData() {
  localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));
  localStorage.setItem('selectedSkins', JSON.stringify(selectedSkins));
}

// ===== Дістаємо придбані скіни та активний скін =====
const ownedSkins = JSON.parse(localStorage.getItem('ownedSkins')) || { 
  blue: ['classic'], //  || - Якщо LocalStorage порожній — даємо класичний безкоштовний скін кожному кольору.
  green: ['classic'],
  red: ['classic']
}; // дістає усі збережені придбані скіни, щоб користувач міг їх використовувати при наступному заході в гру.
console.warn(ownedSkins)

const selectedSkins = JSON.parse(localStorage.getItem('selectedSkins')) || {
  blue: 'classic',
  green: 'classic',
  red: 'classic'
}; //Вказує, який скін зараз вибраний для кожного кольору.
console.warn(selectedSkins)

// ===== Функція для відкриття магазину =====

const shopArea = document.querySelector("#shopArea");
const shopBtn = document.querySelector("#shopBtn");
const closeShop = document.querySelector("#closeShop");

shopBtn.onclick = function () {
  shopArea.classList.add("active");
};

closeShop.onclick = function () {
  shopArea.classList.remove("active");
};



// ===== Функція для відображення  ВМІСТУ магазина =====
function renderShop() {

  const shopContainer = document.getElementById('skinList');
  shopContainer.innerHTML = '';

  for (let type in skins) {
    const title = document.createElement('h3');
    title.textContent = `${type.toUpperCase()} Скіни`;
    shopContainer.appendChild(title);

    skins[type].forEach(skin => { // skin- кожен скін
     // console.log(skin)
      const div = document.createElement('div');
      div.className = 'skin-item';

      const imgShop = document.createElement('img');
     
      imgShop.src = `img/${skin.img}`;
      div.appendChild(imgShop);

      const label = document.createElement('div');
      label.innerHTML = `<p>${skin.name}</p><p>${skin.price}🪙</p>`;
      div.appendChild(label);

      const button = document.createElement('button');
      // Перевірка на куплений скін:
      if (ownedSkins[type].includes(skin.id)) { // Якщо скін вже куплений:
        console.log(ownedSkins[type])
        console.log(skin.id)

        if (selectedSkins[type] === skin.id) {
          button.textContent = 'Обрано';
          button.disabled = true;

          button.style.cssText =`
              background-color: #caffd4;
              border: 2px solid #aee6b8;
              color: #3d6544;
          `
      } else {
          button.textContent = 'Обрати';
          button.disabled = false;
          button.style.cssText =`
            background-color: #ffeaa7;
            border: 2px solid #dfc980;
            color: #8d7528;
      `
      }
// При натисканні → зберігаємо вибраний скін, оновлюємо інтерфейс.
        button.onclick = () => {
          selectedSkins[type] = skin.id;
          saveShopData();
          renderShop();
        };
      }
      // Якщо скін ще не куплений:
      else {
        button.textContent = `Купити за ${skin.price}🪙`;
        button.onclick = () => {
          if (totalScore >= skin.price) {
            totalScore -= skin.price;
            totalScoreDisplay.textContent = `Всього набрано: ${totalScore}🪙`;
            localStorage.setItem('totalScore', totalScore);// після купівлі оновлюємо

            ownedSkins[type].push(skin.id);
            selectedSkins[type] = skin.id;
            saveShopData();
            renderShop();
          } else {
            alert("Недостатньо очок!");
          }
        };
      }

      div.appendChild(button);
      shopContainer.appendChild(div);
    });
  }// кінець циклу
}


 renderShop();
