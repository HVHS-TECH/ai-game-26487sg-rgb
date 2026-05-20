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
  const type = Math.floor(Math.random() * 6);

  let obstacle = {
    x: Math.random() * (canvas.width - 60),
    y: -60,
    width: 60,
    height: 60,
    speed: Math.random() * 4 + 4,
    type: type
  };

  obstacles.push(obstacle);
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
  obstacles.forEach((o) => {

    switch (o.type) {

      // Red Block
      case 0:
        ctx.fillStyle = "red";
        ctx.fillRect(o.x, o.y, o.width, o.height);
        break;

      // Blue Circle
      case 1:
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(o.x + 30, o.y + 30, 30, 0, Math.PI * 2);
        ctx.fill();
        break;

      // Green Triangle
      case 2:
        ctx.fillStyle = "lime";
        ctx.beginPath();
        ctx.moveTo(o.x + 30, o.y);
        ctx.lineTo(o.x, o.y + 60);
        ctx.lineTo(o.x + 60, o.y + 60);
        ctx.closePath();
        ctx.fill();
        break;

      // Purple Diamond
      case 3:
        ctx.fillStyle = "purple";
        ctx.beginPath();
        ctx.moveTo(o.x + 30, o.y);
        ctx.lineTo(o.x + 60, o.y + 30);
        ctx.lineTo(o.x + 30, o.y + 60);
        ctx.lineTo(o.x, o.y + 30);
        ctx.closePath();
        ctx.fill();
        break;

      // Yellow Bar
      case 4:
        ctx.fillStyle = "yellow";
        ctx.fillRect(o.x, o.y + 15, 60, 30);
        break;

      // Orange Hexagon
      case 5:
        ctx.fillStyle = "orange";

        ctx.beginPath();
        ctx.moveTo(o.x + 15, o.y);
        ctx.lineTo(o.x + 45, o.y);
        ctx.lineTo(o.x + 60, o.y + 30);
        ctx.lineTo(o.x + 45, o.y + 60);
        ctx.lineTo(o.x + 15, o.y + 60);
        ctx.lineTo(o.x, o.y + 30);
        ctx.closePath();

        ctx.fill();
        break;
    }
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