const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Configurações da bola
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    dx: 5,
    dy: 5
};

// Configurações das raquetes
const paddleWidth = 10;
const paddleHeight = 100;
const player = {
    x: 0,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 8
};
const computer = {
    x: canvas.width - paddleWidth,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 8
};

// Desenha a bola
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.closePath();
}

// Desenha uma raquete
function drawPaddle(x, y, width, height) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, width, height);
}

// Movimento das raquetes
function movePaddles() {
    player.y += player.dy;
    computer.y += computer.dy;

    // Impede que as raquetes saiam do canvas
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + paddleHeight > canvas.height) {
        player.y = canvas.height - paddleHeight;
    }

    if (computer.y < 0) {
        computer.y = 0;
    } else if (computer.y + paddleHeight > canvas.height) {
        computer.y = canvas.height - paddleHeight;
    }
}

// Movimento da bola
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Detecta colisão com as bordas superior e inferior
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Detecta colisão com as raquetes
    if (ball.x - ball.radius < player.x + player.width && 
        ball.y > player.y && ball.y < player.y + player.height) {
        ball.dx *= -1;
    } else if (ball.x + ball.radius > computer.x && 
               ball.y > computer.y && ball.y < computer.y + computer.height) {
        ball.dx *= -1;
    }

    // Detecta se a bola sai do campo
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        resetBall();
    }
}

// Reseta a posição da bola
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
}

// Controla a raquete do jogador
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "ArrowUp") {
        player.dy = -player.speed;
    } else if (e.key === "ArrowDown") {
        player.dy = player.speed;
    }
}

function keyUpHandler(e) {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        player.dy = 0;
    }
}

// IA simples para o computador
function moveComputerPaddle() {
    if (ball.y < computer.y + computer.height / 2) {
        computer.dy = -computer.speed;
    } else {
        computer.dy = computer.speed;
    }
}

// Função principal de atualização do jogo
function update() {
    movePaddles();
    moveBall();
    moveComputerPaddle();
}

// Função principal de desenho
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle(player.x, player.y, player.width, player.height);
    drawPaddle(computer.x, computer.y, computer.width, computer.height);
}

// Loop do jogo
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Inicia o jogo
gameLoop();
