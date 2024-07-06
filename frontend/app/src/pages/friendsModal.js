//abrir o modal
function openModal() {
    const modalContent = `
        <div id="myModal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <p>Modal Content</p>
            </div>
        </div>
    `;

    // Adicionar 
    document.body.insertAdjacentHTML('beforeend', modalContent);
}

// fechar o modal
function closeModal() {
    const modal = document.getElementById('myModal');
    if (modal) {
        modal.remove();
    }
}