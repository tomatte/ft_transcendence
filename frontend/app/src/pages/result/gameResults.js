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
    }
}

const descriptions = {
    "random": "Random match"
}

/* type: ["random", "semifinal", "final"] 
 * result: ["defeat", "victory"]
 */
function getPageGameResult(data, match_type) {
    const { player_left, player_right, winner } = data
    const me = player_left.username === state.user.username ? player_left : player_right
    const result = me.winner ? "victory" : "defeat"
    return resultPages[match_type][result](player_left, player_right, descriptions[match_type])
}

export function showGameResult(data, match_type) {
    const html = getPageGameResult(data, match_type)
    const container  = document.querySelector('.page-game-result__container')
    container.innerHTML = html
    container.style.display = "block"
    document.querySelector('.page-game__container').style.display = "none"
    showStars()
}
