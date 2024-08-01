
import notificationEventHandler from "./notificationEventHandler.js"

class WebsocketNotification {
    constructor() {
        this.listen = this.listen.bind(this)
        this.send = this.send.bind(this)
    }

    listen() {
        this.client = new WebSocket("wss://134.209.223.141:443/ws/notification/")

        this.client.onmessage = (event) => {
            let data = JSON.parse(event.data)
            console.log(data)
                
            notificationEventHandler.execute(data)
        };
    }

    send(payload) {
        this.client.send(JSON.stringify(payload))
    }
}

const websocketNotification = new WebsocketNotification()

export default  websocketNotification