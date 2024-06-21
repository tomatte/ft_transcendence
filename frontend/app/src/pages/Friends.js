export default () => {
    const container = document.createElement("div");
    container.classList.add("container");

    const style = document.createElement("style");
    style.innerHTML = `
        .container {
            background: linear-gradient(135deg, #000428, #004e92); /* Gradiente azul espacial */
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            color: #ffffff;
        }
        .container h1 {
            font-size: 2.5em;
            margin-bottom: 20px;
        }
        .container p {
            font-size: 1.2em;
        }
        .notification {
            background: linear-gradient(135deg, #4e54c8, #8f94fb); /* Gradiente azul roxo */
            padding: 10px;
            margin-top: 15px;
            border-radius: 5px;
        }
        .notification h2 {
            font-size: 1.5em;
        }
        .notification p {
            font-size: 1.2em;
        }
        .add-friend {
            background-color: #1E90FF; /* Azul Dodger */
            border: none;
            padding: 10px 20px;
            margin-top: 20px;
            border-radius: 5px;
            cursor: pointer;
            color: #ffffff;
            font-size: 1.2em;
        }
        .add-friend:hover {
            background-color: #104E8B; /* Azul profundo */
        }
    `;

    container.innerHTML = `
        <h1>Amigos do Espaço Lontra</h1>
        <p>Olá, queridos amigos lontrinhas! Preparem-se para uma reunião intergaláctica sobre quem consegue boiar melhor no espaço. 🦦🚀</p>
        <div class="notification">
            <h2>Notificação 1</h2>
            <p>Uma lontra acabou de ganhar uma competição de mergulho espacial de costas. <strong>É isso aí, mantenha-se no topo!</strong></p>
        </div>
        <button class="add-friend">Adicionar Amigo Lontra Espacial</button>
    `;

    const addFriendButton = container.querySelector('.add-friend');
    addFriendButton.addEventListener('click', () => {
        const newFriendNotification = document.createElement('div');
        newFriendNotification.classList.add('notification');
        newFriendNotification.innerHTML = `
            <h2>Amigo Lontra Adicionado!</h2>
            <p>Parabéns! Você acabou de adicionar mais um amigo lontra espacial à sua lista. 🦦🎉</p>
        `;
        container.appendChild(newFriendNotification);
    });

    container.appendChild(style);
    return container;
}
