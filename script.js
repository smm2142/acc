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
  ctx.moveTo(x + 10, y + 10);
  ctx.bezierCurveTo(x + 10, y, x, y, x, y + 10);
  ctx.bezierCurveTo(x, y + 20, x + 10, y + 25, x + 10, y + 30);
  ctx.bezierCurveTo(x + 10, y + 25, x + 20, y + 20, x + 20, y + 10);
  ctx.bezierCurveTo(x + 20, y, x + 10, y, x + 10, y + 10);
  ctx.fill();
}

// ---- MAIN LOOP ----
function gameLoop() {
  if (gameEnded) return;
  requestAnimationFrame(gameLoop);
  if (++count < 10) return; // Daha yavaş ilan
  count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Kenardan çıxma - digər tərəfdən gir
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

      // Son mesaj şəkilin üstündə
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

  ctx.fillStyle = "#fa0";
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize / 1.5, gridSize);
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
