export default () => {
    const container = document.createElement("div");
    container.classList.add("container");

    const style = document.createElement("style");
    style.innerHTML = `
        body {
            margin: 0;
            font-family: 'Comic Sans MS', cursive, sans-serif;
            background: linear-gradient(135deg, #1B2735, #090A0F); /* Fundo gradiente espacial */
            color: #ffffff;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            width: 90%;
            max-width: 1200px;
            margin: auto;
            text-align: center;
        }
        .header {
            margin-bottom: 40px;
        }
        .header h1 {
            font-size: 3em;
            margin: 0;
            color: #FFD700; /* Cor dourada */
        }
        .header p {
            font-size: 1.5em;
            margin: 0;
        }
        .rows {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 10px;
        }
        .box {
            background: linear-gradient(135deg, #4e54c8, #8f94fb); /* Gradiente azul roxo */
            padding: 20px;
            border-radius: 10px;
            flex: 1 1 calc(33% - 20px); /* Ajustando para ocupar 1/3 da linha */
            min-width: 200px;
            box-sizing: border-box;
            text-align: center;
        }
        .box h2 {
            margin: 0 0 10px;
            font-size: 1.5em;
        }
        .box p {
            margin: 0;
            font-size: 1em;
        }
        @media (max-width: 767px) {
            .header h1 {
                font-size: 2em;
            }
            .header p {
                font-size: 1.2em;
            }
            .box {
                flex: 1 1 calc(50% - 10px); /* Ajustando para ocupar 1/2 da linha em telas menores */
                min-width: 150px;
            }
        }
    `;

    container.innerHTML = `
        <div class="header">
            <h1>OTTER SPACE</h1>
            <p>O maior e melhor pong da galáxia</p>
        </div>
        <div class="rows">
            <div class="row">
                <div class="box">
                    <h2>Flutuando com Estilo</h2>
                    <p>Venha ver as lontras flutuando como astronautas! 🦦🚀</p>
                </div>
                <div class="box">
                    <h2>Pong Espacial</h2>
                    <p>Desafie seus amigos no pong espacial intergaláctico! 🌌🏓</p>
                </div>
                <div class="box">
                    <h2>Estrelas Cadentes</h2>
                    <p>Assista ao incrível show das estrelas cadentes com lontras! 🌠✨</p>
                </div>
            </div>
            <div class="row">
                <div class="box">
                    <h2>Competição de Natação</h2>
                    <p>Veja quem é a lontra mais rápida da galáxia! 🏊‍♂️🌟</p>
                </div>
                <div class="box">
                    <h2>Exploração de Planetas</h2>
                    <p>Explore novos planetas com suas lontras favoritas! 🪐🔭</p>
                </div>
                <div class="box">
                    <h2>Festa na Lua</h2>
                    <p>Não perca a maior festa na lua com todas as lontras! 🌕🎉</p>
                </div>
            </div>
            <div class="row">
                <div class="box">
                    <h2>Corrida Espacial</h2>
                    <p>Participe da corrida espacial e vença prêmios incríveis! 🚀🏁</p>
                </div>
                <div class="box">
                    <h2>Aventura Subaquática</h2>
                    <p>Descubra os segredos das profundezas espaciais! 🌊🔍</p>
                </div>
                <div class="box">
                    <h2>Show de Luzes</h2>
                    <p>Maravilhe-se com o show de luzes das auroras espaciais! 🌌🎆</p>
                </div>
            </div>
        </div>
    `;

    container.appendChild(style);
    return container;
}
