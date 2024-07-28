import { playerMove, player2Move } from "./websockets/websocketActions.js"

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

let payload = {
    key: "",
    player_id: 0,
    match_id: -1,
    action: ""
}

export function updateCoordinates(data) {
    const player_height = 100
    const ball_radious = 10

    const ball_x = data.ball.x - ball_radious
    const ball_y = data.ball.y - ball_radious

    const player_left_y = data.player_left.y - (player_height / 2)
    const player_right_y = data.player_right.y - (player_height / 2)

    const player_left_points = data.player_left.points
    const player_right_points = data.player_right.points
    playBallKickSound(data.ball)
    setPlayerLeft(player_left_y)
    setPlayerRight(player_right_y)
    setBall(ball_x, ball_y)
    setScores(player_left_points, player_right_points)
}

export function listenMoves() {
    document.addEventListener('keydown', async function(event) {
        if (event.key === 'ArrowUp') {
            playerMove('up')
        } else if (event.key === 'ArrowDown') {
            playerMove('down');
        }
    });
    
    document.addEventListener('keyup', function(event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            playerMove("stop");
        }
    });
}

async function handlePlayer2KeyDown(event) {
    console.log("handlePlayer2KeyDown")
    if (event.key === 'w') {
        player2Move('up');
    } else if (event.key === 's') {
        player2Move('down');
    }
}

async function handlePlayer2KeyUp(event) {
    console.log("handlePlayer2KeyUp")
    if (event.key == 'w' || event.key == 's') {
        player2Move("stop");
    }
}

export function listenPlayer2Moves() {
    document.addEventListener('keydown', handlePlayer2KeyDown);
    document.addEventListener('keyup', handlePlayer2KeyUp);
}

/* TODO: call this function in end of local match event*/
export function removePlayer2MovesListeners() {
    document.removeEventListener('keydown', handlePlayer2KeyDown);
    document.removeEventListener('keyup', handlePlayer2KeyUp);
}
