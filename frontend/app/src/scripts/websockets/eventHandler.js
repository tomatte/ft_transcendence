import state from "../state/state.js"
import { updateOnlinePlayersTournament } from "../element-creators/updateElements.js"

function newConnection(data, state) {
    // TODO: create a function to merge the notifications from redis with notifications from database
    state.notifications = data.notifications
    state.online_players = data.online_players
    state.renderPage()
    console.log("newConnection()")
}

function newNotification(data, state) {
    state['notifications'].push(data)
    console.log({state})
    if (state.currentPage == 'Notifications') { //TODO: change this to inject the html
        state.renderPage()
    }
}

function updateOnlinePlayers(data, state) {
    state.online_players = data.online_players
    updateOnlinePlayersTournament(state.online_players)
    console.log("updateOnlinePlayers()")
}

class EventHandler {
    constructor (state) {
        this.state = state
        this.events = {}
    }

    register(name, callback) {
        this.events[name] = callback
    }

    execute(eventData) {
        if (this.events.hasOwnProperty(eventData.name) == false) {
            console.error(`invalid event: ${eventData.name}`)
           return
        }

        this.events[eventData.name](eventData, this.state)
    }
}

const eventHandler = new EventHandler(state)

eventHandler.register("new_connection", newConnection)
eventHandler.register("new_notification", newNotification)
eventHandler.register("update_online_players", updateOnlinePlayers)

export default eventHandler