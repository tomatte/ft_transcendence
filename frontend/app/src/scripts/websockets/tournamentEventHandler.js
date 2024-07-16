import state from "../state/state.js"

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

function createTournament() {
    const payload = {
        action: "create"
    }

    ws_tournament.send(JSON.stringify(payload))
}

function enterTournament(data, state) {
    //updatePlayersQueueTournament(data.tournament.players)
    //state.tournament = data.tournament
}

const tournamentEventHandler = new TournamentEventHandler(state)