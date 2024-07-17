import createOnlinePlayersTournament from "./createOnlinePlayersTournament.js"
import injectElement from "./injectElement.js"

export function updateOnlinePlayersTournament(players) {
    const html = createOnlinePlayersTournament(players)
    injectElement(html, "tournament_online_players")
}

export function updatePlayersQueueTournament(players) {
    const html = createOnlinePlayersTournament(players)
    injectElement(html, "tournament-player-queue")
    
    const statusHtml = `${players.length}/4 ready`
    injectElement(statusHtml, "tournament-status-ready")
}