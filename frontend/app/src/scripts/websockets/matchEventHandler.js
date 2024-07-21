import state from "../state/state.js"
import { updateCoordinates } from "../game.js"

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
            console.log(`no callback for event: ${eventData.name}`)
           return
        }

        this.events[eventData.name](eventData, this.state)
    }
}

function coordinates(data, state) {
    updateCoordinates(data)
}

const matchEventHandler = new MatchEventHandler(state)
matchEventHandler.register("coordinates", coordinates)

export default matchEventHandler