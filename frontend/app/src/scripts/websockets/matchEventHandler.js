import state from "../state/state.js"
import { updateCoordinates } from "../game.js"
import GameResultDefeat from "../../pages/GameResultDefeat.js"
import { showStars } from "../../pages/GameResultDefeat.js"

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

function randomMatchEnd(data, state) {
    const html = GameResultDefeat(data.player_left, data.player_right)
    const container  = document.querySelector('.page-game-result__container')
    container.innerHTML = html
    container.style.display = "block"
    document.querySelector('.page-game__container').style.display = "none"
    showStars()
}

const matchEventHandler = new MatchEventHandler(state)
matchEventHandler.register("coordinates", coordinates)
matchEventHandler.register("random_match_end", randomMatchEnd)

export default matchEventHandler