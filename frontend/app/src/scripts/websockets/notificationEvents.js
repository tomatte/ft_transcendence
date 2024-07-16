
import notificationEventHandler from "./notificationEventHandler.js"

let ws_notification = new WebSocket("wss://localhost:443/ws/notification/")

let payload = {
    action: "",
    player_id: "",
    tournament_id: "",
}


function initialSetup(data) {
    payload.tournament_id = data.tournament_id
    payload.player_id = data.player_id
    document.getElementById("my-id").innerText = data.player_id
}

function sendTournamentInvitation() {
    const friend_id = document.getElementById("friend-id").value
    payload.friend_id = friend_id
    payload.action = "invite_to_tournament"
    ws_notification.send(JSON.stringify(payload))
}

function invitationReceived(data) {
    console.log("inviation received!!!")
    const ul = document.getElementById("invitation-list")
    const li = document.createElement("li")
    const span = document.createElement("span")
    const button = document.createElement("button")

    span.innerText = data.tournament_id

    button.onclick = function() {
        joinTournament(data.tournament_id)
    }
    button.innerText = "join"

    li.appendChild(span)
    li.appendChild(button)
    ul.appendChild(li)
}

export default function listenNotificationEvents(state) {
    ws_notification.onmessage = (event) => {
        let data = JSON.parse(event.data)
        console.log(data)

        notificationEventHandler.execute(data)
    };
}
