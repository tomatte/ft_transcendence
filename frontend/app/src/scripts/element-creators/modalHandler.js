import state from "../state/state.js"
import { websocketTournament } from "../websockets/tournamentEvents.js";

function openModal(id) {
    const modal = document.getElementById(id);
    const overlay = document.getElementById('modalOverlay');

    overlay.style.display = 'flex';
    modal.style.display = 'flex';
    modal.classList.add('modal--open');

    // Close modal when clicking on the overlay
    overlay.addEventListener('click', closeModalOutside);
}

class ModalCreateTournament {
    constructor() {
        this.open = this.open.bind(this)
    }

    sendCreateTournamentRequest() {
        const payload = {
            action: "create"
        }
        websocketTournament.send(JSON.stringify(payload))
    }

    updateState() {
        state.tournament = {
            players: [state.user]
        }
    }

    open() {
        openModal('modalInviteToTournament')
        this.updateState()
        this.sendCreateTournamentRequest()
    }

    listen() {
        const btn = document.getElementById('button-create-tournament')
        if (btn) {
            btn.addEventListener('click', this.open)
        }
    }
}

export const modalCreateTournament = new ModalCreateTournament()