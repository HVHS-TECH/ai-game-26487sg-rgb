const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 120,
  width: 50,
  height: 50,
  speed: 8
};

const keys = {};
let obstacles = [];
let score = 0;
let gameRunning = true;

document.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

function createObstacle() {
  const size = Math.random() * 40 + 30;

  obstacles.push({
    x: Math.random() * (canvas.width - size),
    y: -size,
    width: size,
    height: size,
    speed: Math.random() * 4 + 4
  });
}

function drawPlayer() {
  ctx.fillStyle = '#00e5ff';

  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.closePath();
  ctx.fill();
}

function drawObstacles() {
  ctx.fillStyle = '#ff3b3b';

  obstacles.forEach((o) => {
    ctx.fillRect(o.x, o.y, o.width, o.height);
  });
}

function updatePlayer() {
  if (keys['ArrowLeft'] || keys['a']) {
    player.x -= player.speed;
  }

  if (keys['ArrowRight'] || keys['d']) {
    player.x += player.speed;
  }

  if (keys['ArrowUp'] || keys['w']) {
    player.y -= player.speed;
  }

  if (keys['ArrowDown'] || keys['s']) {
    player.y += player.speed;
  }

  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function updateObstacles() {
  obstacles.forEach((o, index) => {
    o.y += o.speed;

    if (o.y > canvas.height) {
      obstacles.splice(index, 1);
      score++;
      document.getElementById('score').textContent = score;
    }

    if (
      player.x < o.x + o.width &&
      player.x + player.width > o.x &&
      player.y < o.y + o.height &&
      player.y + player.height > o.y
    ) {
      endGame();
    }
  });
}

function drawStars() {
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = 'white';

    ctx.fillRect(
      (i * 97) % canvas.width,
      (i * 53 + performance.now() * 0.05) % canvas.height,
      2,
      2
    );
  }
}

function endGame() {
  gameRunning = false;

  document.getElementById('finalScore').textContent = score;
  document.getElementById('gameOver').style.display = 'block';
}

function restartGame() {
  obstacles = [];
  score = 0;
  gameRunning = true;

  player.x = canvas.width / 2 - 25;
  player.y = canvas.height - 120;

  document.getElementById('score').textContent = score;
  document.getElementById('gameOver').style.display = 'none';

  animate();
}

function animate() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();
  updatePlayer();
  updateObstacles();

  drawPlayer();
  drawObstacles();

  requestAnimationFrame(animate);
}

setInterval(() => {
  if (gameRunning) {
    createObstacle();
  }
}, 700);

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});