import localMatchEventHandler from "./localMatchEventHandler.js";

class WebsocketLocalMatch {
    constructor() {
        this.listen = this.listen.bind(this)
        this.send = this.send.bind(this)
    }

    listen() {
        this.client = new WebSocket("wss://134.209.223.141:443/ws/local_match/")

        this.client.onmessage = (event) => {
            let data = JSON.parse(event.data)
                
            localMatchEventHandler.execute(data)
        };
    }

    send(payload) {
        this.client.send(JSON.stringify(payload))
    }
}

const websocketLocalMatch = new WebsocketLocalMatch()

export default  websocketLocalMatch
