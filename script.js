const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// صور اللعبة
let playerImg = new Image(); playerImg.src = "shaks_clean.png";
let enemyImg = new Image(); enemyImg.src = "clean_enemy.png";
let bulletImg = new Image(); bulletImg.src = "fried_drumstick_clean.png";
let leftArrow = new Image(); leftArrow.src = "left.png";
let rightArrow = new Image(); rightArrow.src = "right.png";
let shootIcon = new Image(); shootIcon.src = "shoot.png";

// أحجام جديدة
let player = { x: 165, y: 500, width: 70, height: 70 }; // شاكس أكبر
let bullets = [], enemies = [];
let score = 0;
let leftPressed = false, rightPressed = false;
let isGameOver = false;

function startGame() {
  document.getElementById("startScreen").style.display = "none";
  requestAnimationFrame(gameLoop);
}

function restartGame() {
  document.getElementById("gameOverScreen").style.display = "none";
  bullets = [];
  enemies = [];
  score = 0;
  isGameOver = false;
  player.x = 165; // وسط الشاشة مع الحجم الجديد
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.key === " ") shoot();
});
document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") leftPressed = false;
  if (e.key === "ArrowRight") rightPressed = false;
});

function shoot() {
  bullets.push({ x: player.x + 15, y: player.y, width: 40, height: 40 }); // طلقة أكبر
}

function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawBullets() {
  bullets = bullets.filter((b) => b.y > -40);
  bullets.forEach((b) => {
    b.y -= 8; // سرعة أكبر للطلقة الكبيرة
    ctx.drawImage(bulletImg, b.x, b.y, b.width, b.height);
  });
}

function drawEnemies() {
  if (Math.random() < 0.02) {
    enemies.push({ x: Math.random() * (canvas.width - 70), y: 0, width: 70, height: 70 }); // عدو أكبر
  }

  enemies = enemies.filter((e) => e.y < canvas.height + 70);
  enemies.forEach((e) => {
    e.y += 2;
    ctx.drawImage(enemyImg, e.x, e.y, e.width, e.height);

    bullets.forEach((b) => {
      if (b.x < e.x + e.width && b.x + b.width > e.x &&
          b.y < e.y + e.height && b.y + b.height > e.y) {
        e.hit = true;
        b.hit = true;
        score += 10;
      }
    });

    if (
      e.x < player.x + player.width &&
      e.x + e.width > player.x &&
      e.y < player.y + player.height &&
      e.y + e.height > player.y
    ) {
      endGame();
    }
  });

  enemies = enemies.filter(e => !e.hit);
  bullets = bullets.filter(b => !b.hit);
}

function drawScore() {
  ctx.fillStyle = "#FFD700";
  ctx.font = "30px monospace";
  ctx.fillText("النقاط: " + score, 10, 40);
}

// أزرار بحجم أكبر
function drawControls() {
  ctx.drawImage(leftArrow, 20, 500, 80, 80);
  ctx.drawImage(rightArrow, 110, 500, 80, 80);
  ctx.drawImage(shootIcon, 300, 500, 80, 80);
}

function endGame() {
  isGameOver = true;
  document.getElementById("gameOverScreen").style.display = "flex";
  document.getElementById("finalScore").innerText = "النقاط: " + score;
}

function update() {
  if (leftPressed) player.x = Math.max(0, player.x - 6); // زيادة السرعة عشان الحجم
  if (rightPressed) player.x = Math.min(canvas.width - player.width, player.x + 6);
}

function gameLoop() {
  if (isGameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawPlayer();
  drawBullets();
  drawEnemies();
  drawScore();
  drawControls();
  requestAnimationFrame(gameLoop);
}

// نقاط الضغط الجديدة تناسب حجم الأزرار (80x80)
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // زر اليسار
  if (x >= 20 && x <= 100 && y >= 500 && y <= 580) {
    player.x = Math.max(0, player.x - 30);
  }
  // زر اليمين
  else if (x >= 110 && x <= 190 && y >= 500 && y <= 580) {
    player.x = Math.min(canvas.width - player.width, player.x + 30);
  }
  // زر الإطلاق
  else if (x >= 300 && x <= 380 && y >= 500 && y <= 580) {
    shoot();
  }
});
