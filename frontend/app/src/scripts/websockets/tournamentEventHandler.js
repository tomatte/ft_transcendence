import state from "../state/state.js"
import websocketTournament from "./websocketTournament.js"

class TournamentEventHandler {
    constructor (state) {
        this.state = state
        this.events = {}
    }

    register(name, callback) {
        this.events[name] = callback
    }

    execute(eventData) {
        if (this.events.hasOwnProperty(eventData.name) == false) {
            console.log(`no callback for event: ${eventData.name}`)
           return
        }

        this.events[eventData.name](eventData, this.state)
    }
}

function enterTournament(data, state) {
    if (data.hasOwnProperty('tournament_id') == false)
            return
    
    state.tournament.id = data.tournament_id
    console.log("EVENT enterTournament()")
}

function connectedTournament(data, state) {
    console.log("EVENT connectedTournament")

    websocketTournament.send({
        action: state.tournament.action,
        tournament: state.tournament
    })
}

const tournamentEventHandler = new TournamentEventHandler(state)

tournamentEventHandler.register('enter_tournament', enterTournament)
tournamentEventHandler.register('connected', connectedTournament)

export default tournamentEventHandler