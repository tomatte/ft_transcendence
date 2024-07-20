import matchEventHandler from "./matchEventHandler.js";

class WebsocketMatch {
    constructor() {
        this.listen = this.listen.bind(this)
        this.send = this.send.bind(this)
    }

    listen() {
        console.log("listening to match...")
        this.client = new WebSocket("wss://localhost:443/ws/match/")

        this.client.onmessage = (event) => {
            let data = JSON.parse(event.data)
            console.log(data)
                
            matchEventHandler.execute(data)
        };
    }

    send(payload) {
        this.client.send(JSON.stringify(payload))
    }
}

const websocketMatch = new WebsocketMatch()

export default  websocketMatch