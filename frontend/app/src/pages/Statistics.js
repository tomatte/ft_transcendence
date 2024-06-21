export default () => {
    const container = document.createElement("div");
    container.classList.add("container");

    const style = document.createElement("style");
    style.innerHTML = `
        .container {
            background-color: #3498db; /* Cor de fundo azul */
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .container h1,
        .container p {
            color: rgba(255, 255, 255, 1); /* Cor branca */
        }
        .notification {
            background-color: #e67e22; /* Cor de fundo laranja */
            padding: 10px;
            margin-top: 15px;
            border-radius: 5px;
        }
    `;

    container.innerHTML = `
        <h1>Estatísticas Lontrísticas</h1>
        <p>Descubra dados impressionantes sobre nossas queridas lontras! Elas são mais do que apenas nadadoras.</p>
        <div class="notification">
            <h2>Curiosidade 1</h2>
            <p>Lontras do mar podem usar pedras para abrir mariscos. Elas são engenhosas até na hora da comida!</p>
        </div>
        <div class="notification">
            <h2>Curiosidade 2</h2>
            <p>As lontras são conhecidas por segurar as mãos umas das outras enquanto dormem, para não se perderem.</p>
        </div>
        <div class="notification">
            <h2>Curiosidade 3</h2>
            <p>Algumas espécies de lontras podem até mesmo usar ferramentas, como algas ou pedras, para construir abrigos.</p>
        </div>
    `;

    container.appendChild(style);
    return container;
}
