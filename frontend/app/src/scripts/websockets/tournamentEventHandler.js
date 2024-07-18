import state from "../state/state.js"
import websocketTournament from "./websocketTournament.js"
import { showTournamentPage } from "../element-creators/updateElements.js"
import { updatePlayersQueueTournament, updateTournamentBrackets } from "../element-creators/updateElements.js"

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
    console.log("EVENT enterTournament()")
    
    state.tournament.id = data.tournament_id
    state.tournament.players = data.players
    showTournamentPage()
}

function connectedTournament(data, state) {
    console.log("EVENT connectedTournament")

    websocketTournament.send({
        action: state.tournament.action,
        tournament: state.tournament
    })
}

function creatingTournament(data, state) {
    if (data.hasOwnProperty('tournament_id') == false)
        return

    console.log("creatingTournament()")
    state.tournament.id = data.tournament_id
    state.tournament.is_owner = true
    console.log({state})
}

function updatePlayers(data, state) {
    state.tournament.players = data.players
    if (state.tournament.hasOwnProperty("is_owner")) {
        updatePlayersQueueTournament(data.players)
    } else {
        updateTournamentBrackets(data.players)
    }
}

const tournamentEventHandler = new TournamentEventHandler(state)

tournamentEventHandler.register('enter_tournament', enterTournament)
tournamentEventHandler.register('connected', connectedTournament)
tournamentEventHandler.register('update_players', updatePlayers)
tournamentEventHandler.register('creating_tournament', creatingTournament)

export default tournamentEventHandler