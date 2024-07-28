import websocketMatch from "../websockets/websocketMatch.js"
import websocketTournament from "../websockets/websocketTournament.js"
import { showGamePage, showTournamentPage } from "./updateElements.js"
import { mockPlayers } from "../state/mockState.js"
import state from "../state/state.js"

export function hideContents() {
    document.querySelector(".sidebar").style.display = 'none'
    document.querySelector(".page-content").style.display = 'none'
}

export function injectElement(html, parent_id) {
    const parent = document.getElementById(parent_id)
    parent.innerHTML = html
}

export function diffOnlineAndQueue(online, queue) {
    return Object.values(online).filter(online_player => {
        return !queue.some((queue_player) => queue_player.username === online_player.username)
    });
}

export function listenForKeyPress(targetKey, callback) {
    function handleKeyPress(event) {
        if (event.key === targetKey) {
            callback();
        }
    }

    document.addEventListener('keydown', handleKeyPress);
}

export function listenTestKeys() {
    listenForKeyPress("1", () => websocketMatch.listen())
    listenForKeyPress("2", () => websocketTournament.listen())
    listenForKeyPress("3", () => websocketTournament.send({action: "start"}))
    listenForKeyPress("4", () => {
        state.tournament = {}
        state.tournament.players = mockPlayers
        showTournamentPage()
    })
    listenForKeyPress("5", () => showGamePage())
}

export function listenButtonClick(parent, btnId, callback) {
    parent.addEventListener('click', function(event) {
        let targetElement = event.target;
        while (targetElement != null && targetElement !== this) {
            if (targetElement.id === btnId) {
                console.log(`${btnId} clicked`);
                callback()
                break;
            }
            targetElement = targetElement.parentNode;
        }
    });
}