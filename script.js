

const canvas = document.getElementById('gameCanvas');
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
