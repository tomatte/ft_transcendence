import state from "../state/state.js"
import websocketMatch from "./websocketMatch.js"
import { showGamePage } from "../element-creators/updateElements.js"
import { listenPlayer2Moves } from "../game.js"

class LocalMatchEventHandler {
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
            console.log(`no callback for event: ${eventData.name}`)
           return
        }

        this.events[eventData.name](eventData, this.state)
    }
}

function start(data, state) {
    console.log("EVENT startLocalMatch()")
    websocketMatch.listen()
    websocketMatch.listen()
    showGamePage()
    listenPlayer2Moves()
}

const localMatchEventHandler = new LocalMatchEventHandler(state)
localMatchEventHandler.register("start", start)

export default localMatchEventHandler