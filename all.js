const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score = 0;

// ==== ПЕРСОНАЖ ====
const player = {
  x: 180,
  y: 360,
  width: 40,
  height: 40,
  color: "cyan",
  speed: 7
};

// ==== ВОРОГИ ====
const enemies = [];

let enemySpeed = 3;
let enemySize = 35;

function spawnEnemy() {
    const x = Math.floor(Math.random() * (canvas.width - enemySize));
enemies.push({
    x: x,
    y: 0,
    width: enemySize,
    height: enemySize,
    speed: enemySpeed
})
}

let spawnInterval =
setInterval(spawnEnemy, 1500);

// ==== КЕРУВАННЯ ====
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// ==== ГОЛОВНИЙ ЦИКЛ ====
let gameOver = false;

const restartBtn = document.getElementById("restartBtn");
const speedbtn = document.getElementById("speedBtn");

function update() {
  // Рух персонажа
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;

  // Оновлення ворогів
  for (let e of enemies) {
    e.y += e.speed;
    // Перевірка на зіткнення
    if (
      e.x < player.x + player.width &&
      e.x + e.width > player.x &&
      e.y < player.y + player.height &&
      e.y + e.height > player.y
    ) {
      gameOver = true;
      restartBtn.hidden = false; // Показати кнопку перезапуску
    }
  }

  // Видалити ворогів, що вийшли за межі
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].y > canvas.height) {
      enemies.splice(i, 1);
      score += 10;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Гравець
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Вороги
  ctx.fillStyle = "red";
  for (let e of enemies) {
    ctx.fillRect(e.x, e.y, e.width, e.height);
  }

  ctx.fillStyle = "white";
  ctx.font = "18px sans-serif";
  ctx.fillText("Score: " + score, 10, 20);

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "30px sans-serif";
    ctx.fillText("Game over!", 100, 200);
  }
}

function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  } else {
    draw();
  }
}

// === Restart game ===
function restartGame() {
    player.x = 180;
    enemies.length = 0;
    gameOver = false;
    restartBtn.hidden = true;
    enemySpeed = 5;
    enemySize = 35;
    clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnEnemy, 1500);
    score = 0;
    gameLoop();
}

restartBtn.addEventListener("click", restartGame);

speedbtn.addEventListener("click", () => {
    if (enemySpeed < 20 )    {
    enemySpeed += 1; }
        enemySize = Math.max(9, enemySize - 9);
        for (let e of enemies) {
            e.speed = enemySpeed;
            e.width = enemySize;
            e.height = enemySize;
            
        }
});
gameLoop();