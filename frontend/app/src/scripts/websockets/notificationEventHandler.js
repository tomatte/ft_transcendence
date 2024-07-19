import state from "../state/state.js"
import { updateOnlinePlayersTournament } from "../element-creators/updateElements.js"

class NotificationEventHandler {
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

function newConnection(data, state) {
    // TODO: create a function to merge the notifications from redis with notifications from database
    state.notifications = data.notifications
    state.online_players = data.online_players
    state.renderPage()
    console.log("newConnection()")
}

function newNotification(data, state) {
    state['notifications'].unshift(data)
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

function tournamentInvitation(data, state) {
    console.log("tournamentInvitation()")
    console.log(data)
}

const notificationEventHandler = new NotificationEventHandler(state)

notificationEventHandler.register("new_connection", newConnection)
notificationEventHandler.register("new_notification", newNotification)
notificationEventHandler.register("update_online_players", updateOnlinePlayers)
notificationEventHandler.register('tournament_invitation', tournamentInvitation)

export default notificationEventHandler