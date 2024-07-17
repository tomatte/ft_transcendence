export default class ModalHandler {
    constructor() {
        this.open = this.open.bind(this)
        this.close = this.close.bind(this)
        this.closeOutside = this.closeOutside.bind(this)
    }

    open(id) {
        const modal = document.getElementById(id);
        const overlay = document.getElementById('modalOverlay');
    
        overlay.style.display = 'flex';
        modal.style.display = 'flex';
        modal.classList.add('modal--open');
    
        // Close modal when clicking on the overlay
        overlay.addEventListener('click', this.closeOutside);
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
    
        // Remove event listener to prevent accidental closures
        overlay.removeEventListener('click', this.closeOutside);
    }

    closeOutside(event) {
        const overlay = document.getElementById('modalOverlay');
        const modal = document.querySelector('.modal.modal--open');
        
        // Check if the clicked element is the modal itself
        if (event.target === overlay) {
            this.close(modal.id);
        }
    }
}