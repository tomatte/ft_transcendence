import createOnlinePlayersTournament from "./createOnlinePlayersTournament.js"
import injectElement from "./injectElement.js"

export function updateOnlinePlayersTournament(players) {
    const html = createOnlinePlayersTournament(players)
    injectElement(html, "tournament_online_players")
}
