import websocketNotification from "./websocketNotification.js"
import websocketTournament from "./websocketTournament.js"
import websocketMatch from "./websocketMatch.js"
import state from "../state/state.js"
import websocketRandomMatch from "./websocketRandomMatch.js"
import SearchMatch from "../../pages/SearchMatch.js"
import { injectSearchMatchPage } from "../../pages/SearchMatch.js"
import websocketLocalMatch from "./websocketLocalMatch.js"

export function inviteToTournament(username) {
    websocketNotification.send({
        action: 'invite_to_tournament',
        friend: username,
        tournament_id: state.tournament.id
    })
}

export function joinTournament(data) {
    state.tournament = {
        action: 'join',
        id: data.tournament_id
    }

    websocketTournament.listen()
}

export function startTournament() {
    websocketTournament.send({
        action: 'start'
    })
}

let keyPressed = ""
export function playerMove(key) {
    if (keyPressed == key)
        return
    else
        keyPressed = key
    websocketMatch.send({
        "action": "move",
        "key": key
    })
}

let keyPressed2 = ""
export function player2Move(key) {
    if (keyPressed2 == key)
        return
    else
        keyPressed2 = key
    websocketMatch.send({
        "action": "player2_move",
        "key": key
    })
}

export function playRandomly() {
    const html = SearchMatch(state.user)
    injectSearchMatchPage(html)
    websocketRandomMatch.listen()
}

export function playLocal() {
    websocketLocalMatch.listen()
}
