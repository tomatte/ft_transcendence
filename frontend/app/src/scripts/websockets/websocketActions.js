import websocketNotification from "./websocketNotification.js"
import websocketTournament from "./websocketTournament.js"
import websocketMatch from "./websocketMatch.js"
import state from "../state/state.js"

export function inviteToTournament(username) {
    console.log(`invite ${username} to tournament`)
    websocketNotification.send({
        action: 'invite_to_tournament',
        friend: username,
        tournament_id: state.tournament.id
    })
}

export function joinTournament(data) {
    console.log("joinTournament()")
    state.tournament = {
        action: 'join',
        id: data.tournament_id
    }

    websocketTournament.listen()
}

export function startTournament() {
    console.log("startTournament()")
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
