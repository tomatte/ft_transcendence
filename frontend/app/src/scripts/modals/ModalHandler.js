export default class ModalHandler {
    constructor() {
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)
    }

    open(id) {
        const modal = document.getElementById(id);
        const overlay = document.getElementById('modalOverlay');
    
        overlay.style.display = 'flex';
        modal.style.display = 'flex';
        modal.classList.add('modal--open');
    }

    close(id) {
        const modal = document.getElementById(id);
        const overlay = document.getElementById('modalOverlay');
    
        modal.classList.remove('modal--open');
        modal.classList.add('modal--close');
    
        // After animation completes, hide the modal
        setTimeout(() => {
            overlay.style.display = 'none';
            modal.style.display = 'none';
            modal.classList.remove('modal--close'); // Reset classes for next open
        }, 200); // Adjust to match animation duration
    }
}
