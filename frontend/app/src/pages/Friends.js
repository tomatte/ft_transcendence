export default () => {
    const container = document.createElement("div");
    container.classList.add("container");

    const style = document.createElement("style");
    style.innerHTML = `
        .container h1,
        .container p,
        .container .notification h2,
        .container .notification p {
            color: rgba(255, 255, 255, 1); /* Cor branca */
        }
        .container {
            background-color: #4CAF50; /* Cor de fundo verde */
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .notification {
            background-color: #FFC107; /* Cor de fundo amarelo */
            padding: 10px;
            margin-top: 15px;
            border-radius: 5px;
        }
    `;

    container.innerHTML = `
        <h1>Amigos da Lontra</h1>
        <p>Olá, queridos amigos lontrinhas! Estamos aqui para uma reunião séria sobre quem consegue boiar melhor na água.</p>
        <div class="notification">
            <h2>Notificação 1</h2>
            <p>Uma lontra acabou de ganhar uma competição de mergulho de costas. <strong>É isso aí, mantenha-se no topo!</strong></p>
        </div>
    `;

    container.appendChild(style);
    return container;
}

