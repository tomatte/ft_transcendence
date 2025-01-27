import state from "../state/state.js"
import websocketMatch from "./websocketMatch.js"
import { showGamePage } from "../element-creators/updateElements.js"
import { removeSearchMatchPage } from "../../pages/SearchMatch.js"

class RandomMatchEventHandler {
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

function startRandomMatch(data, state) {
    websocketMatch.listen()
    showGamePage()
    removeSearchMatchPage()
}

const randomMatchEventHandler = new RandomMatchEventHandler(state)
randomMatchEventHandler.register("start_random_match", startRandomMatch)

export default randomMatchEventHandler