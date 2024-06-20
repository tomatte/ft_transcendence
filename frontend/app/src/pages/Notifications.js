export default () => {
    const container = document.createElement("div");
    container.classList.add("container");

    const style = document.createElement("style");
    style.innerHTML = `
        .container {
            background-color: #f39c12; /* Cor de fundo laranja */
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .container h1,
        .container p {
            color: rgba(255, 255, 255, 1); /* Cor branca */
        }
        .notification {
            background-color: #3498db; /* Cor de fundo azul */
            padding: 10px;
            margin-top: 15px;
            border-radius: 5px;
            text-align: left;
            font-family: 'Arial', sans-serif;
            line-height: 1.5;
        }
        .notification h2 {
            margin-bottom: 5px;
            color: #f39c12; /* Cor laranja */
        }
    `;

    container.innerHTML = `
        <h1>Carta Lontrinha</h1>
        <p>Queridos amigos lontrinhas, aqui está a nossa carta especial para vocês!</p>
        <div class="notification">
            <h2>Queridos Amigos,</h2>
            <p>Esperamos que estejam aproveitando a vida aquática ao máximo! Lembramos que a competição de natação está chegando e contamos com todos vocês para mostrar suas habilidades. Vamos fazer uma festa das águas inesquecível juntos!</p>
            <p>Com carinho,<br>Equipe Lontrinha</p>
        </div>
    `;

    container.appendChild(style);
    return container;
}
