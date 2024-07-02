function openModal() {
    const modal = document.getElementById('modalLeaveTournament');
    const overlay = document.getElementById('modalOverlay');

    overlay.style.display = 'flex';
    modal.style.display = 'flex';
    modal.classList.add('modal--open');


    // Close modal when clicking on the overlay
    overlay.addEventListener('click', closeModalOutside);
}

function closeModal() {
    const modal = document.getElementById('modalLeaveTournament');
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
    overlay.removeEventListener('click', closeModalOutside);
}

function closeModalOutside(event) {
    const overlay = document.getElementById('modalOverlay');
    
    // Check if the clicked element is the modal itself
    if (event.target === overlay) {
        closeModal();
    }
}