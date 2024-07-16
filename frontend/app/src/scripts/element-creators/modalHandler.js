import state from "../state/state.js"

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
    constructor() {}

    open() {
        openModal('modalInviteToTournament')
    
        state.tournament = {
            players: [state.user]
        }
    
        console.log({state_1: state})
    }

    listen() {
        const btn = document.getElementById('button-create-tournament')
        btn.addEventListener('click', this.open)
    }
}

export const modalCreateTournament = new ModalCreateTournament()