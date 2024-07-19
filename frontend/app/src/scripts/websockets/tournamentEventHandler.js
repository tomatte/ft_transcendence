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

function enterTournament(data, state) {
    //updatePlayersQueueTournament(data.tournament.players)
    //state.tournament = data.tournament
    console.log("enterTournament()")
}

const tournamentEventHandler = new TournamentEventHandler(state)

tournamentEventHandler.register('enter_tournament', enterTournament)

export default tournamentEventHandler