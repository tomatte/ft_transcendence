import createOnlinePlayersTournamentRows from "./createOnlinePlayersTournament.js"
import createPlayerQueueTournament from "./createPlayerQueueTournament.js"
import { inviteToTournament, startTournament } from "../websockets/websocketActions.js"
import Tournament from "../../pages/Tournament.js"
import { createBracketsSemi } from "./createTournamentBrackets.js"
import { injectElement, hideContents, diffOnlineAndQueue } from "./utils.js"
import state from "../state/state.js"

export function updateOnlinePlayersTournament(players) {
    if (!state.hasOwnProperty("tournament") || !state.tournament.hasOwnProperty("players")) {
        return 
    }

    const newOnline = diffOnlineAndQueue(players, state.tournament.players)
    const html = createOnlinePlayersTournamentRows(newOnline)
    injectElement(html, "tournament_online_players")
    
    for (let key in players) {
        const player = players[key]
        const btn = document.getElementById(`button-tournament-invite-${player.username}`)
        if (btn) {
            btn.addEventListener('click', () => inviteToTournament(player.username))
        }
    }
}

export function updatePlayersQueueTournament(players) {
    const html = createPlayerQueueTournament(players)
    injectElement(html, "tournament-player-queue")
    
    const statusHtml = `${players.length}/4 ready`
    injectElement(statusHtml, "tournament-status-ready")
}

export function showTournamentPage() {
    hideContents()
   const gameContainer = document.querySelector('.page-tournament__container'); 
   
    gameContainer.innerHTML = Tournament()
};

export function updateTournamentBrackets(players) {
    const {leftBrackets, rightBrackets} = createBracketsSemi(players)

    document.getElementById("tournament-bracket-semi-left").innerHTML = leftBrackets
    document.getElementById("tournament-bracket-semi-right").innerHTML = rightBrackets
}

export function addStartTournamentClickEvent() {
    const btn = document.getElementById("button-start-tournament")
    if (btn) {
        btn.addEventListener('click', () => {
            console.log("start tournament")
            startTournament()
        })
    }
}