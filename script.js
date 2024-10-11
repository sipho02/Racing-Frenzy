const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

let carX = 100;
let carY = 500; 
let carSpeedX = 0;
let carSpeedY = 0; // New variable for vertical movement
let score = 0;
let obstacles = [];
let powerUps = [];
let isGameOver = false; 

function drawCar() {
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(carX, carY, 50, 50);
}

function drawObstacles() {
    obstacles.forEach((obstacle) => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(obstacle.x, obstacle.y, 50, 50);
    });
}

function drawPowerUps() {
    powerUps.forEach((powerUp) => {
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(powerUp.x, powerUp.y, 50, 50);
    });
}

function update() {
    if (!isGameOver) {
        carX += carSpeedX;
        carY += carSpeedY; // Update vertical position

        // Boundary checks for horizontal movement
        if (carX < 0) carX = 0;
        if (carX > canvas.width - 50) carX = canvas.width - 50;

        // Boundary checks for vertical movement
        if (carY < 0) carY = 0; // Prevent moving off the top
        if (carY > canvas.height - 50) carY = canvas.height - 50; // Prevent moving off the bottom

        obstacles.forEach((obstacle, index) => {
            obstacle.y += 2; 

            if (obstacle.y > canvas.height) {
                obstacles.splice(index, 1);
                generateObstacle(); 
            }

            if (checkCollision(carX, carY, obstacle.x, obstacle.y)) {
                isGameOver = true;
            }
        });

        powerUps.forEach((powerUp, index) => {
            if (checkCollision(carX, carY, powerUp.x, powerUp.y)) {
                score++;
                powerUps.splice(index, 1); 
            }
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawRoad(); // Draw the road first
    drawCar();
    drawObstacles();
    drawPowerUps();

    ctx.font = '24px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 10, 10);

    if (isGameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillText('Press R to Restart', canvas.width / 2 - 100, canvas.height / 2 + 40);
    }
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop); 
}

function init() {
    obstacles = []; 
    powerUps = []; 
    score = 0; 
    isGameOver = false; 
    for (let i = 0; i < 5; i++) { 
        generateObstacle();
        generatePowerUp();
    }
    loop();
}

function generateObstacle() {
    const obstacleX = Math.random() * (canvas.width - 50);
    obstacles.push({
        x: obstacleX,
        y: -50,
    });
}

function generatePowerUp() {
    powerUps.push({
        x: Math.random() * (canvas.width - 50),
        y: Math.random() * (canvas.height - 50),
    });
}

function checkCollision(x1, y1, x2, y2) {
    return (
        x1 < x2 + 50 &&
        x1 + 50 > x2 &&
        y1 < y2 + 50 &&
        y1 + 50 > y2
    ); 
}

document.addEventListener('keydown', (e) => {
    if (isGameOver) {
        if (e.key === 'r' || e.key === 'R') {
            init(); 
        }
        return; 
    }
    if (e.key === 'ArrowLeft') {
        carSpeedX = -5;
    } else if (e.key === 'ArrowRight') {
        carSpeedX = 5; 
    } else if (e.key === 'ArrowUp') { // Up arrow key
        carSpeedY = -5;
    } else if (e.key === 'ArrowDown') { // Down arrow key
        carSpeedY = 5; 
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        carSpeedX = 0; 
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        carSpeedY = 0; // Stop vertical movement
    }
});

init();

function drawRoad() {
    ctx.fillStyle = '#808080'; // Gray for the road
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#FFFFFF'; // White for the lane markings
    for (let i = 0; i < canvas.height; i += 50) {
        ctx.fillRect(canvas.width / 2 - 5, i, 10, 30); // Center lane
    }
}
