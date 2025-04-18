// ---- GAME STATE ----
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gridSize = 20;
let count = 0;
let heartsEaten = 0;
let snake = [{ x: 160, y: 200 }];
let dx = gridSize;
let dy = 0;
let food = getRandomFood();
let messages = [
  "Ac ayı dərs edə bilməz",
  "Mısıx dolurmu?",
  "Yolu yarıladın dosdaar",
  "Sevdikcə böyümürükmü?",
  "Ac ayı artıq toxdu 🐻❤"
];
let currentMessageIndex = 0;
let gameEnded = false;

// ---- HELPERS ----
function getRandomFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize,
    y: Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize
  };
}

function drawHeart(x, y) {
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 15);
  ctx.bezierCurveTo(x + 15, y, x, y, x, y + 15);
  ctx.bezierCurveTo(x, y + 30, x + 15, y + 35, x + 15, y + 45);
  ctx.bezierCurveTo(x + 15, y + 35, x + 30, y + 30, x + 30, y + 15);
  ctx.bezierCurveTo(x + 30, y, x + 15, y, x + 15, y + 15);
  ctx.fill();
}

// ---- MAIN LOOP ----
function gameLoop() {
  if (gameEnded) return;
  requestAnimationFrame(gameLoop);
  if (++count < 10) return; // daha yavaş – daha rahat
  count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Kenardan çıxma – qarşı tərəfdən daxil ol
  if (head.x < 0) head.x = canvas.width - gridSize;
  if (head.x >= canvas.width) head.x = 0;
  if (head.y < 0) head.y = canvas.height - gridSize;
  if (head.y >= canvas.height) head.y = 0;

  let hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y);
  if (hitSelf) {
    document.getElementById("messageBox").textContent = "Ac ayı özünü tapdı 😅";
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    heartsEaten++;

    if (heartsEaten % 2 === 0 && currentMessageIndex < messages.length) {
      document.getElementById("messageBox").textContent = messages[currentMessageIndex++];
    } else {
      document.getElementById("messageBox").textContent = "";
    }

    if (heartsEaten === 10) {
      document.getElementById("gameCanvas").style.display = "none";
      const img = document.getElementById("finalImage");
      img.style.display = "block";

      const box = document.getElementById("messageBox");
      box.textContent = "Ardı evləndikdən sonra 💍";
      box.style.position = "absolute";
      box.style.top = "60%";
      box.style.width = "100%";
      box.style.textAlign = "center";
      box.style.fontSize = "24px";
      box.style.color = "maroon";
      box.style.fontWeight = "bold";

      gameEnded = true;
      return;
    }

    food = getRandomFood();
  } else {
    snake.pop();
  }

  // Dar, uzun və yuvarlaq başlıqlı ilan
  ctx.fillStyle = "#fa0";
  snake.forEach(segment => {
    ctx.beginPath();
    ctx.roundRect(segment.x, segment.y, gridSize / 1.8, gridSize, 6);
    ctx.fill();
  });

  drawHeart(food.x, food.y);
}

// ---- CONTROLS ----
document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowLeft": if (dx === 0) { dx = -gridSize; dy = 0; } break;
    case "ArrowUp": if (dy === 0) { dx = 0; dy = -gridSize; } break;
    case "ArrowRight": if (dx === 0) { dx = gridSize; dy = 0; } break;
    case "ArrowDown": if (dy === 0) { dx = 0; dy = gridSize; } break;
  }
});

// ---- START ----
gameLoop();

// canvas roundRect üçün dəstək yoxdursa, aşağıdakı polyfill əlavə et:
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
  }
}
