import state from "../state/state.js"
import websocketTournament from "./websocketTournament.js"
import {
    updateOnlinePlayersTournament,
    updatePlayersQueueTournament, 
    updateTournamentBrackets,
    addStartTournamentClickEvent,
    showTournamentPage,
    showGamePage,
    showTournamentBracketFinal,
    goBackHome
} from "../element-creators/updateElements.js"
import websocketMatch from "./websocketMatch.js"
import { showGameResult } from "../../pages/result/gameResults.js"


class TournamentEventHandler {
    constructor (state) {
        this.state = state
        this.events = {}
        this.register = this.register.bind(this)
        this.execute = this.execute.bind(this)
    }

    register(name, callback) {
        this.events[name] = callback
    }

    execute(eventData) {
        if (this.events.hasOwnProperty(eventData.name) == false) {
           return
        }

        this.events[eventData.name](eventData, this.state)
    }
}

function enterTournament(data, state) {
    if (data.hasOwnProperty('tournament_id') == false)
            return
    
    state.tournament.id = data.tournament_id
    state.tournament.players = data.players
    showTournamentPage()
}

function connectedTournament(data, state) {
    websocketTournament.send({
        action: state.tournament.action,
        tournament: state.tournament
    })
}

function creatingTournament(data, state) {
    if (data.hasOwnProperty('tournament_id') == false)
        return

    state.tournament.id = data.tournament_id
    state.tournament.is_owner = true
}

function updatePlayers(data, state) {
    state.tournament.players = data.players
    if (data.players.length == 4) {
        showTournamentPage()
        updateTournamentBrackets(data.players)
        addStartTournamentClickEvent()
    }
    else if (state.tournament.hasOwnProperty("is_owner")) {
        updatePlayersQueueTournament(data.players)
        updateOnlinePlayersTournament(state.online_players)
    } else {
        updateTournamentBrackets(data.players)
    }
}

const startMatch = (state) => {
    websocketMatch.listen()
    showGamePage()
}

function semifinalEnd(data, state) {
    showGameResult(data, "semifinal", "Tournament Semi-final")
}

function bracketFinalMatch(data, state) {
    showTournamentBracketFinal(data)
}

function finalEnd(data, state) {
    showGameResult(data, "final", "")
}

function reconnected(data) {
    state.tournament = {
        id: data.tournament_id,
        players: data.players,
        action: ""
    }
}

function cancelTournament(data) {
    goBackHome()
    delete state.tournament
}

const tournamentEventHandler = new TournamentEventHandler(state)
tournamentEventHandler.register('enter_tournament', enterTournament)
tournamentEventHandler.register('connected', connectedTournament)
tournamentEventHandler.register('update_players', updatePlayers)
tournamentEventHandler.register('creating_tournament', creatingTournament)
tournamentEventHandler.register('start_match', startMatch)
tournamentEventHandler.register('semifinal_end', semifinalEnd)
tournamentEventHandler.register('bracket_final_match', bracketFinalMatch)
tournamentEventHandler.register('final_end', finalEnd)
tournamentEventHandler.register('reconnected', reconnected)
tournamentEventHandler.register('cancel_tournament', cancelTournament)

export default tournamentEventHandler