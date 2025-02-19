import randomMatchEventHandler from "./randomMatchEventHandler.js";

class WebsocketRandomMatch {
    constructor() {
        this.listen = this.listen.bind(this)
        this.send = this.send.bind(this)
    }

    listen() {
        this.client = new WebSocket(`wss://${window.location.hostname}:443/ws/random_match/`)

        this.client.onmessage = (event) => {
            let data = JSON.parse(event.data)
                
            randomMatchEventHandler.execute(data)
        };
    }

    send(payload) {
        this.client.send(JSON.stringify(payload))
    }
}

const websocketRandomMatch = new WebsocketRandomMatch()

export default  websocketRandomMatch
