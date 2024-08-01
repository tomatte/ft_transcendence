import state from "../state/state.js"
import { updateCoordinates } from "../game.js"
import { showGameResult, showGameResultLocal } from "../../pages/result/gameResults.js"

class MatchEventHandler {
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

function coordinates(data, state) {
    updateCoordinates(data)
}

function randomMatchEnd(data, state) {
    showGameResult(data, "random", "Random match")
}

function endLocalMatch(data, state) {
    showGameResultLocal(data)
}

const matchEventHandler = new MatchEventHandler(state)
matchEventHandler.register("coordinates", coordinates)
matchEventHandler.register("random_match_end", randomMatchEnd)
matchEventHandler.register("end_local_match", endLocalMatch)

export default matchEventHandler