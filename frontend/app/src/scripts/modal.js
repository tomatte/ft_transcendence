function openModal(id) {
    const modal = document.getElementById(id);
    const overlay = document.getElementById('modalOverlay');

    overlay.style.display = 'flex';
    modal.style.display = 'flex';
    modal.classList.add('modal--open');

    // Close modal when clicking on the overlay
    overlay.addEventListener('click', closeModalOutside);
}


function closeModal(id) {
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
    overlay.removeEventListener('click', closeModalOutside);
}

function closeModalOutside(event) {
    const overlay = document.getElementById('modalOverlay');
    const modal = document.querySelector('.modal.modal--open');
    
    // Check if the clicked element is the modal itself
    if (event.target === overlay) {
        closeModal(modal.id);
    }
}


// close modal


function closeBothModals() {
    const modal1 = document.getElementById('modalInviteToTournament');
    const modal2 = document.getElementById('modalDeleteTournament');
    const overlay = document.getElementById('modalOverlay');

    if (modal1) {
        modal1.classList.remove('modal--open');
        modal1.classList.add('modal--close');
    }

    if (modal2) {
        modal2.classList.remove('modal--open');
        modal2.classList.add('modal--close');
    }

    // After animation completes, hide the modals
    setTimeout(() => {
        if (overlay) {
            overlay.style.display = 'none';
        }
        if (modal1) {
            modal1.style.display = 'none';
            modal1.classList.remove('modal--close'); // Reset classes for next open
        }
        if (modal2) {
            modal2.style.display = 'none';
            modal2.classList.remove('modal--close'); // Reset classes for next open
        }
    }, 200); // Adjust to match animation duration
}