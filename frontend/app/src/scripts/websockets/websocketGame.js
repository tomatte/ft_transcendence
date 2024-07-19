import gameEventHandler from "./gameEventHandler.js";

class WebsocketGame {
    constructor() {
        this.listen = this.listen.bind(this)
        this.send = this.send.bind(this)
    }

    listen() {
        console.log("listening to game_loop...")
        this.client = new WebSocket("wss://localhost:443/ws/game_loop/")

        this.client.onmessage = (event) => {
            let data = JSON.parse(event.data)
            console.log(data)
                
            gameEventHandler.execute(data)
        };
    }

    send(payload) {
        this.client.send(JSON.stringify(payload))
    }
}

const websocketGame = new WebsocketGame()

export default  websocketGame