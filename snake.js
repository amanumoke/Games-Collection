const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};

let score = 0;
let d;
let game;
let speed = 200;

let player = "";

document.addEventListener("keydown", direction);

function direction(event) {
  if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
  else if (event.keyCode == 38 && d != "DOWN") d = "UP";
  else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
  else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

// Mobile swipe control
let startX, startY;
canvas.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
});
canvas.addEventListener("touchmove", (e) => {
  if (!startX || !startY) return;
  let dx = e.touches[0].clientX - startX;
  let dy = e.touches[0].clientY - startY;
  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && d != "LEFT") d = "RIGHT";
    else if (dx < 0 && d != "RIGHT") d = "LEFT";
  } else {
    if (dy > 0 && d != "UP") d = "DOWN";
    else if (dy < 0 && d != "DOWN") d = "UP";
  }
  startX = startY = null;
});

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "#00ff88" : "#00995c";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  // Wrap around edges
  if (snakeX < 0) snakeX = canvas.width - box;
  if (snakeY < 0) snakeY = canvas.height - box;
  if (snakeX >= canvas.width) snakeX = 0;
  if (snakeY >= canvas.height) snakeY = 0;

  // Eat food
  if (snakeX == food.x && snakeY == food.y) {
    score += 10;
    document.getElementById("score").textContent = score;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // Snake bites itself
  for (let i = 0; i < snake.length; i++) {
    if (snakeX == snake[i].x && snakeY == snake[i].y) {
      clearInterval(game);
      setTimeout(() => {
        alert(`Game Over, ${player}! You bit yourself 😅\nScore: ${score}`);
        window.location.reload();
      }, 100);
    }
  }

  snake.unshift(newHead);

  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.fillText("Player: " + player, 10, 20);
}

document.getElementById("startBtn").addEventListener("click", () => {
  const inputName = document.getElementById("playerName").value.trim();
  if (inputName === "") {
    alert("Please enter your name!");
    return;
  }
  player = inputName;
  document.getElementById("menu").style.display = "none";
  document.getElementById("gameContainer").style.display = "block";
  game = setInterval(draw, speed);
});
