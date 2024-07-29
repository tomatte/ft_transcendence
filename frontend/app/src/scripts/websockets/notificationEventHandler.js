import state from "../state/state.js"
import { updateOnlinePlayersTournament } from "../element-creators/updateElements.js"
import { showGamePage } from "../element-creators/updateElements.js"
import websocketMatch from "./websocketMatch.js"
import websocketTournament from "./websocketTournament.js"
import { listenPlayer2Moves } from "../game.js"

class NotificationEventHandler {
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
    if (state.hasOwnProperty("tournament") && state.tournament.is_owner) {
        updateOnlinePlayersTournament(state.online_players)
    }
    console.log("updateOnlinePlayers()")
}

function tournamentInvitation(data, state) {
    console.log("tournamentInvitation()")
    console.log(data)
}

function enterRunningMatch() {
    websocketMatch.listen()
    showGamePage()
}

function enterRunningTournament() {
    websocketTournament.listen()
}

function enterRunningLocalMatch() {
    websocketMatch.listen()
    websocketMatch.listen()
    showGamePage()
    listenPlayer2Moves()
}

const notificationEventHandler = new NotificationEventHandler(state)

notificationEventHandler.register("new_connection", newConnection)
notificationEventHandler.register("new_notification", newNotification)
notificationEventHandler.register("update_online_players", updateOnlinePlayers)
notificationEventHandler.register('tournament_invitation', tournamentInvitation)
notificationEventHandler.register("enter_running_match", enterRunningMatch)
notificationEventHandler.register("enter_running_tournament", enterRunningTournament)
notificationEventHandler.register("enter_running_local_match", enterRunningLocalMatch)

export default notificationEventHandler