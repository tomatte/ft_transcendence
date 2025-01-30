import matchEventHandler from "./matchEventHandler.js";
import { listenMoves } from "../game.js";

class WebsocketMatch {
    constructor() {
        this.listen = this.listen.bind(this)
        this.send = this.send.bind(this)
    }

    listen() {
        this.client = new WebSocket(`wss://${window.location.hostname}:443/ws/match/`)

        this.client.onmessage = (event) => {
            let data = JSON.parse(event.data)
                
            matchEventHandler.execute(data)
            listenMoves()
        };
    }

    send(payload) {
        this.client.send(JSON.stringify(payload))
    }
}

const websocketMatch = new WebsocketMatch()

export default  websocketMatch