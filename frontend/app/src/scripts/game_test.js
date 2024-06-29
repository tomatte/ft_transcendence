function setPlayerLeft(y) {
    const player = document.getElementById("player_left")
    player.style.top = `${y}px`
    player.style.left = `${30}px`
}

function setPlayerRight(y) {
    const player = document.getElementById("player_right")
    player.style.top = `${y}px`
    player.style.right = `${40}px`
}

function setBall(x, y) {
    const ball = document.getElementById("ball")
    ball.style.left = `${x}px`
    ball.style.top = `${y}px`
}

function setScores(leftScore, rightScore) {
    const left = document.getElementById("score_left")
    left.innerText = leftScore

    const right = document.getElementById("score_right")
    right.innerText = rightScore
}

function playBallKickSound(ball) {
    if (ball.bounced == false) {
        return
    }
    const kickSound = document.getElementById("ball-kick")
    kickSound.currentTime = 0
    kickSound.play()
}

let ws = new WebSocket("ws://localhost:8000/player/")
let payload = {
    key: "",
    player_id: 0,
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
            playBallKickSound(data.ball)
            setPlayerLeft(player_left_y)
            setPlayerRight(player_right_y)
            setBall(ball_x, ball_y)
            setScores(player_left_points, player_right_points)
            return ;
        }

        if (data.action == "connect") {
            console.log("start connection")
            payload.match_id = data.match_id
            payload.action = "ready"
            payload.player_id = data.player_id
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