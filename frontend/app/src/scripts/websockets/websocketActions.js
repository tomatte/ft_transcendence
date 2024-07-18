import websocketNotification from "./websocketNotification.js"
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
    console.log(`joining ${data.owner.username}'s tournament`)
    console.log({data})
}