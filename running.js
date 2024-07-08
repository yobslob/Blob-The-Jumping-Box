let gameRunning = true;
let score = 0;
let highScore = 0;

document.getElementById('jumpButton').addEventListener('click', function () {
  if (!gameRunning) return;
  let character = document.getElementById('character');
  if (!character.classList.contains('jump')) {
    character.classList.add('jump');
    setTimeout(function () {
      character.classList.remove('jump');
    }, 1000);
  }
});

const gameContainer = document.querySelector('.game-screen');

function createObstacle () {
  if (!gameRunning) return;
  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');
  const obstacleType = Math.random() < 0.5 ? 'tree' : 'rock';

  if (obstacleType === 'tree') {
    obstacle.classList.add('tree');
    obstacle.style.height = `${Math.random() * 50 + 50}px`;
    obstacle.style.width = '30px';
    obstacle.style.borderBottomLeftRadius = '30px';
    obstacle.style.borderBottomRightRadius = '30px';
  } else {
    obstacle.classList.add('rock');
    obstacle.style.height = `${Math.random() * 30 + 20}px`;
    obstacle.style.width = `${Math.random() * 30 + 20}px`;
  }
  obstacle.style.left = '100%';

  gameContainer.appendChild(obstacle);

  let moveInterval = setInterval(() => {
    if (!gameRunning) {
      clearInterval(moveInterval);
      return;
    }

    let currentLeft = parseFloat(getComputedStyle(obstacle).left);
    if (currentLeft < -50) {
      clearInterval(moveInterval);
      gameContainer.removeChild(obstacle);
      updateScore();
    } else {
      obstacle.style.left = `${currentLeft - 4.6}px`;
      checkCollision(obstacle);
    }
  }, 20);
}

let obstacleInterval = setInterval(createObstacle, 1800);

function checkCollision (obstacle) {
  const character = document.getElementById('character');
  const characterRect = character.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    characterRect.left < obstacleRect.left + obstacleRect.width &&
    characterRect.left + characterRect.width > obstacleRect.left &&
    characterRect.top < obstacleRect.top + obstacleRect.height &&
    characterRect.top + characterRect.height > obstacleRect.top
  ) {
    endGame();
  }
}

function endGame () {
  gameRunning = false;
  document.getElementById('character').style.display = 'none';
  document.getElementById('restartButton').style.display = 'block';
}

function resetGame () {
  const obstacles = document.querySelectorAll('.obstacle');
  obstacles.forEach(obstacle => gameContainer.removeChild(obstacle));
  clearInterval(obstacleInterval);
  obstacleInterval = setInterval(createObstacle, 2000);
  document.getElementById('character').style.display = 'block';
  gameRunning = true;
  score = 0;
  document.getElementById('score').innerText = `Score: ${score}`;
}

function updateScore () {
  score++;
  document.getElementById('score').innerText = `Score: ${score}`;
  if (score > highScore) {
    highScore = score;
    document.getElementById('highScore').innerText = `High Score: ${highScore}`;
  }
}

document.getElementById('restartButton').addEventListener('click', function () {
  resetGame();
  this.style.display = 'none';
});
