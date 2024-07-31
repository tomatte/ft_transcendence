import state from "../state/state.js"
import websocketTournament from "../websockets/websocketTournament.js";
import ModalHandler from "./ModalHandler.js";
import { updateOnlinePlayersTournament, updatePlayersQueueTournament } from "../element-creators/updateElements.js";

class ModalCreateTournament {
    constructor(modalhandler, modalId, openBtnId, closeBtnId) {
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)
        this.modal = modalhandler
        this.modalId = modalId
        this.openBtnId = openBtnId
        this.closeBtnId = closeBtnId
    }

    updateState() {
        state.tournament = {
            players: [state.user],
            action: 'create',
            isOwner: true,
            invitedPlayers: [],
        }
    }

    open() {
        this.updateState()
        websocketTournament.listen()
        updatePlayersQueueTournament(state.tournament.players)
        updateOnlinePlayersTournament(state.online_players)
        this.modal.open(this.modalId)
    }

    listen() {
        const openBtn = document.getElementById(this.openBtnId)
        if (openBtn) {
            openBtn.addEventListener('click', this.open)
        }

        const closeBtn = document.getElementById(this.closeBtnId)
        if (closeBtn) {
            closeBtn.addEventListener('click', this.close)
        }
    }

    close() {
        console.log("MODAL close()")
        this.modal.close(this.modalId)
        websocketTournament.client.close(3111)
    }
}

const modalCreateTournament = new ModalCreateTournament(
    new ModalHandler(),
    'modalInviteToTournament',
    'button-create-tournament',
    "button-close-create-tournament"
)

export default modalCreateTournament