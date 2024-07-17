import state from "../state/state.js"
import websocketTournament from "../websockets/websocketTournament.js";
import ModalHandler from "./ModalHandler.js";

class ModalCreateTournament {
    constructor(modalhandler) {
        this.open = this.open.bind(this)
        this.modal = modalhandler
    }

    updateState() {
        state.tournament = {
            players: [state.user],
            action: 'create'
        }
    }

    open() {
        this.updateState()
        websocketTournament.listen()
        this.modal.open('modalInviteToTournament')
    }

    listen() {
        const btn = document.getElementById('button-create-tournament')
        if (btn) {
            btn.addEventListener('click', this.open)
        }
    }
}

const modalCreateTournament = new ModalCreateTournament(new ModalHandler())

export default modalCreateTournament