export default () => {
    const container = document.createElement("div");
    container.classList.add("container");

    const style = document.createElement("style");
    style.innerHTML = `
        .container {
            background-color: #FF5733; /* Cor de fundo laranja */
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .container h1,
        .container p,
        .container .notification h2,
        .container .notification p {
            color: rgba(255, 255, 255, 1); /* Cor branca */
        }
        .notification {
            background-color: #F4D03F; /* Cor de fundo amarelo */
            padding: 10px;
            margin-top: 15px;
            border-radius: 5px;
        }
    `;

    container.innerHTML = `
        <h1>Amigos Lontras: Hora do Jogo!</h1>
        <p>E aí, galera lontrinha? Hoje é dia de mostrar quem é o rei da partida. Preparem suas nadadeiras!</p>
        <div class="notification">
            <h2>Notificação 1</h2>
            <p>Alerta de jogo emocionante em andamento! Lontras habilidosas estão protagonizando um duelo épico na água. Quem vai levar a melhor?</p>
        </div>
    `;

    container.appendChild(style);
    return container;
}
