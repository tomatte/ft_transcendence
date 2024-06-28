function setCanvasSize() {
    const minWidth = 800; // Minimum width for the canvas
    const maxWidth = 1600; // Maximum width for the canvas
    const maxHeight = 900; // Maximum height for the canvas

    // Calculate the desired width and height based on screen size
    let desiredWidth = Math.min(maxWidth, window.innerWidth);
    let desiredHeight = Math.min(maxHeight, window.innerHeight);

    if (desiredWidth < minWidth) {
        desiredWidth = minWidth;
    }

    //TODO: remove this when the game size allows for dynamic sizing:
    desiredHeight = 720
    desiredWidth = 1280

    // Apply the calculated dimensions to the canvas
    canvas.width = desiredWidth;
    canvas.height = desiredHeight;

    // Ensure the canvas remains centered
    canvas.style.left = `${(window.innerWidth - desiredWidth) / 2}px`;
    canvas.style.top = `${(window.innerHeight - desiredHeight) / 2}px`;

    drawLeftPaddle(canvas.height / 2)
    drawRightPaddle(canvas.height / 2)
    drawMiddleLine();
}

function drawLeftPaddle(y) {
    ctx.fillStyle = '#FFFFFF'; // Paddle color
    ctx.fillRect(30, y, 10, 100); // Left paddle position and size
}

function drawRightPaddle(y) {
    ctx.fillStyle = '#FFFFFF'; // Paddle color
    ctx.fillRect(canvas.width - 40, y, 10, 100); // Right paddle position and size
}

function drawBall(x, y, radius) {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true); // Draw a circle
    ctx.fill(); // F
}

function setScores(leftScore, rightScore) {
    ctx.fillStyle = '#FFFFFF'; // White color for text
    ctx.font = '30px Arial';

    // Calculate positions based on canvas size
    const leftScoreX = canvas.width * 0.25; // 25% from the left of the canvas
    const rightScoreX = canvas.width * 0.75; // 75% from the left of the canvas
    const scoreY = canvas.height * 0.1; // 10% from the top of the canvas

    // Draw left score
    ctx.textAlign = 'center'; // Center the text horizontally
    ctx.fillText(leftScore.toString(), leftScoreX, scoreY);

    // Draw right score
    ctx.fillText(rightScore.toString(), rightScoreX, scoreY);
}

function drawMiddleLine() {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 8;
    ctx.setLineDash([32, 32]); // Dotted line style

    // Calculate positions for the line
    const startX = canvas.width / 2;
    const startY = 0;
    const endX = canvas.width / 2;
    const endY = canvas.height;

    // Draw the line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

window.addEventListener('resize', setCanvasSize);

setCanvasSize();


//--------------- GAME LOOP -----------------------------------------------------------------------
//daksjdhoiashdlauisudhoanlisudhaosiduasokduhasodkuhasoiduhasodijashodiuasoifuhfgpasoijpógispgoisdh

function getRandomId(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

let ws = new WebSocket("ws://localhost:8000/player/")
let payload = {
    key: "",
    player_id: getRandomId(1, 3999999999),
    match_id: -1,
    action: ""
}

document.addEventListener("DOMContentLoaded", function() {
    ws.onmessage = (event) => {
        data = JSON.parse(event.data)

        console.log(data)

        if (data.action == "coordinates") {
            const player_height = 100
            const ball_radious = 10

            ball_x = data.ball.x - ball_radious
            ball_y = data.ball.y - ball_radious

            player_left_y = data.player_left.y - (player_height / 2)
            player_right_y = data.player_right.y - (player_height / 2)

            player_left_points = data.player_left.points
            player_right_points = data.player_right.points

            drawLeftPaddle(player_left_y)
            drawRightPaddle(player_right_y)
            drawBall(ball_x, ball_y, ball_radious)
            setScores(player_left_points, player_right_points)
            drawMiddleLine()

            return ;
        }

        if (data.action == "connect") {
            console.log("start connection")
            payload.match_id = data.match_id
            payload.action = "ready"
            ws.send(JSON.stringify(payload))
        }

    };
  });


let keyPressed = ""

async function sendKey(key) {
    if (keyPressed == key)
        return
    else
        keyPressed = key
    payload.key = key
    payload.action = "player_move"
    ws.send(JSON.stringify(payload))
}

document.addEventListener('keydown', async function(event) {
    if (event.key === 'ArrowUp') {
        sendKey('up');
    } else if (event.key === 'ArrowDown') {
        sendKey('down');
    }
});

document.addEventListener('keyup', function(event) {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        sendKey("stop");
    }
});