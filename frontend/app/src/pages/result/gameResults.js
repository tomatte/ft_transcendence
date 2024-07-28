import GameResultDefeat from "./GameResultDefeat.js";
import GameResultVictory from "./GameResultVictory.js";
import state from "../../scripts/state/state.js";

function showStars() {
    document.querySelector(".stars1").classList.add("stars-result");
    document.querySelector(".stars2").classList.add("stars-result");
}

const resultPages = {
    "random": {
        "defeat": GameResultDefeat,
        "victory": GameResultVictory
    },
    "local": {
        "defeat": GameResultVictory,
        "victory": GameResultVictory
    }
}

/* type: ["random", "semifinal", "final"] 
 * result: ["defeat", "victory"]
 */
function getPageGameResult(data, type, description) {
    const { player_left, player_right } = data
    const me = player_left.username === state.user.username ? player_left : player_right
    const result = me.winner ? "victory" : "defeat"
    return resultPages[type][result](player_left, player_right, description, type)
}

export function showGameResult(data, type, description) {
    const html = getPageGameResult(data, type, description)
    const container  = document.querySelector('.page-game-result__container')
    container.innerHTML = html
    container.style.display = "block"
    document.querySelector('.page-game__container').style.display = "none"
    showStars()
}

export function showGameResultLocal(data) {
    data.player_left.username = "Left"
    data.player_left.nickname = state.user.nickname
    data.player_left.avatar = state.user.avatar
    data.player_right.username = "Right"
    data.player_right.avatar = state.user.avatar
    data.player_right.nickname = state.user.nickname
    const winnerSide = data.player_right.winner ? "Right" : "Left"
    showGameResult(data, "local", `${winnerSide} side won!`)
}