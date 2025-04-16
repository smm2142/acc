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
  "Sebdikcə böyümürükmü?",
  "Ac ayı artıq toxdu 🐻❤️"
];
let currentMessageIndex = 0;
let gameEnded = false;

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

function gameLoop() {
  if (gameEnded) return;

  requestAnimationFrame(gameLoop);

  if (++count < 10) return;
  count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let head = { x: snake[0].x + dx, y: snake[0].y + dy };

  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)) {
  
  document.getElementById("messageBox").textContent = "Ac ayı bir az çaşdı ";

  
  canvas.style.backgroundColor = "rgba(255,0,0,0.5)";
  setTimeout(() => {
    canvas.style.backgroundColor = "white";
  }, 200);
}

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    heartsEaten++;

    // Romantik mesajlar
    if (heartsEaten % 6 === 0 && currentMessageIndex < messages.length) {
      document.getElementById("messageBox").textContent = messages[currentMessageIndex++];
    } else {
      document.getElementById("messageBox").textContent = "";
    }

    // 30 ürək yeyildikdə final şəkli göstər
    if (heartsEaten === 30) {
      document.getElementById("gameCanvas").style.display = "none";
      document.getElementById("finalImage").style.display = "block";
      setTimeout(() => {
        document.getElementById("messageBox").textContent = "Ardı evləndikdən sonra 💍";
        gameEnded = true;
      }, 3000);
      return;
    }

    food = getRandomFood();
  } else {
    snake.pop();
  }

  // Uzun, dar ilan
  ctx.fillStyle = "#fa0";
  snake.forEach(segment => {
    ctx.fillRect(segment.x, segment.y, gridSize / 1.5, gridSize);
  });

  drawHeart(food.x, food.y);
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowLeft": if (dx === 0) { dx = -gridSize; dy = 0; } break;
    case "ArrowUp": if (dy === 0) { dx = 0; dy = -gridSize; } break;
    case "ArrowRight": if (dx === 0) { dx = gridSize; dy = 0; } break;
    case "ArrowDown": if (dy === 0) { dx = 0; dy = gridSize; } break;
  }
});

gameLoop();
