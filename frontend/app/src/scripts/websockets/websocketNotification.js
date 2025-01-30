
import notificationEventHandler from "./notificationEventHandler.js"

class WebsocketNotification {
    constructor() {
        this.listen = this.listen.bind(this)
        this.send = this.send.bind(this)
    }

    listen() {
        this.client = new WebSocket(`wss://${window.location.hostname}:443/ws/notification/`)

        this.client.onmessage = (event) => {
            let data = JSON.parse(event.data)
                
            notificationEventHandler.execute(data)
        };
    }

    send(payload) {
        this.client.send(JSON.stringify(payload))
    }
}

const websocketNotification = new WebsocketNotification()

export default  websocketNotification