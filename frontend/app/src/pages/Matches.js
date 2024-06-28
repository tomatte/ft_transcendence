export default () => {
    // Criação do contêiner principal
    const container = document.createElement("div");
    container.classList.add("playground-container");

    // Criação de estilos
    const style = document.createElement("style");
    style.innerHTML = `
            @import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css');
        @import url('https://fonts.googleapis.com/css2?family=Material+Icons+Round&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Red+Hat+Display:ital,wght@0,300..900;1,300..900&display=swap');
        @import url('../css/Components.css');
        @import url('../css/Colors.css');
        @import url('../css/Typography.css');
        @import url('../css/pages/matches.css');

   
    `;

    // Conteúdo do contêiner principal para Matches
    container.innerHTML = `
        <div class="header">
        <div class="header-content">
            <div class="header-title">Matches</div>
            <div class="header-sub
    <div class="page-content">
        <div class="content-block">
            <div class="text-wrapper">Matches</div>
            <div class="text-wrapper-2">[8]</div>
        </div>
        <button class="button">
            <div class="icon-wrapper"><img class="icon" src="img/icon.svg" alt="Icon" /></div>
            <div class="button-text">Label</div>
            <div class="icon-wrapper"><img class="icon" src="img/icon.svg" alt="Icon" /></div>
        </button>
    </div>
         </div>
    `;

    container.appendChild(style);

    return container;
}
