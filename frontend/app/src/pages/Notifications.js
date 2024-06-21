export default () => {
    const container = document.createElement("div");
    container.classList.add("container");

    const style = document.createElement("style");
    style.innerHTML = `
        .container {
            background: linear-gradient(135deg, #1B2735, #090A0F); /* Fundo gradiente espacial */
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            color: #ffffff;
            max-width: 100%;
            margin: auto;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .header {
            margin-bottom: 20px;
            width: 100%;
            text-align: center;
        }
        .header h1 {
            font-size: 2em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.2em;
        }
        .notifications {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            width: 100%;
        }
        .notification {
            background: linear-gradient(135deg, #4e54c8, #8f94fb); /* Gradiente azul roxo */
            padding: 15px;
            margin: 10px;
            border-radius: 10px;
            text-align: left;
            font-family: 'Arial', sans-serif;
            color: #ffffff;
            line-height: 1.5;
            box-sizing: border-box;
            flex: 1 1 calc(33% - 20px); /* Adjusting to take 1/3 of the row with margin */
            min-width: 200px;
            max-width: 300px;
        }
        .notification h2 {
            margin-bottom: 5px;
            color: #FFD700; /* Cor dourada */
        }
        .add-friend {
            background-color: #32CD32; /* Cor verde lima */
            border: none;
            padding: 10px 20px;
            margin-top: 20px;
            border-radius: 5px;
            cursor: pointer;
            color: #fff;
            font-size: 1.2em;
            box-sizing: border-box;
        }
        .add-friend:hover {
            background-color: #228B22; /* Verde floresta */
        }
        @media (min-width: 768px) {
            .container {
                max-width: 1200px;
            }
            .header h1 {
                font-size: 2.5em;
            }
            .header p {
                font-size: 1.3em;
            }
        }
        @media (max-width: 767px) {
            .container {
                padding: 10px;
            }
            .header h1 {
                font-size: 1.8em;
            }
            .header p {
                font-size: 1.1em;
            }
            .add-friend {
                font-size: 1em;
                padding: 8px 16px;
            }
        }
    `;

    container.innerHTML = `
        <div class="header">
            <h1>Notificações Lontrinhas Espaciais</h1>
            <p>Bem-vindos ao portal de notificações mais cósmico das lontras! 🦦🌌</p>
        </div>
        <div class="notifications">
            <div class="notification">
                <h2>Nadador Estelar</h2>
                <p>Parabéns ao nosso amigo lontra Espoleta, que acabou de ganhar a competição de natação espacial! 🚀🏅</p>
            </div>
            <div class="notification">
                <h2>Conquista Intergaláctica</h2>
                <p>Lontra Estrela chegou a Plutão e agora é a primeira lontra a visitar todos os planetas do nosso sistema solar! 🪐✨</p>
            </div>
            <div class="notification">
                <h2>Festa das Estrelas</h2>
                <p>Não perca a próxima Festa das Estrelas, onde teremos uma competição de flutuação espacial. Preparem seus trajes espaciais! 🌠🎉</p>
            </div>
        </div>
        <button class="add-friend">Adicionar Amigo Lontra Espacial</button>
    `;

    const notificationsContainer = container.querySelector('.notifications');
    const addFriendButton = container.querySelector('.add-friend');
    addFriendButton.addEventListener('click', () => {
        const newFriendNotification = document.createElement('div');
        newFriendNotification.classList.add('notification');
        newFriendNotification.innerHTML = `
            <h2>Amigo Lontra Adicionado!</h2>
            <p>Parabéns! Você acabou de adicionar mais um amigo lontra espacial à sua lista. 🦦🎉</p>
        `;
        notificationsContainer.appendChild(newFriendNotification);
    });

    container.appendChild(style);
    return container;
}
