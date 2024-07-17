import createOnlinePlayersTournamentRows from "./createOnlinePlayersTournament.js"
import createPlayerQueueTournament from "./createPlayerQueueTournament.js"
import injectElement from "./injectElement.js"
import { inviteToTournament } from "../websockets/websocketActions.js"

export function updateOnlinePlayersTournament(players) {
    const html = createOnlinePlayersTournamentRows(players)
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