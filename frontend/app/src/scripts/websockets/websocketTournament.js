import tournamentEventHandler from "./tournamentEventHandler.js"

class WebsocketTournament {
    constructor() {
        this.listen = this.listen.bind(this)
        this.send = this.send.bind(this)
    }

    listen() {
        this.client = new WebSocket(`wss://${window.location.hostname}:443/ws/tournament/`)

        this.client.onmessage = (event) => {
            let data = JSON.parse(event.data)
                
            tournamentEventHandler.execute(data)
        };
    }

    send(payload) {
        this.client.send(JSON.stringify(payload))
    }
}

const websocketTournament = new WebsocketTournament()

export default  websocketTournament
