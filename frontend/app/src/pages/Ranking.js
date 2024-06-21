export default () => {
    const container = document.createElement("div");
    container.classList.add("container");

    const style = document.createElement("style");
    style.innerHTML = `
        .container {
            background-color: #4CAF50; /* Cor de fundo verde */
            padding: 20px;
            border-radius: 10px;
            text-align: center;
        }
        .container h1,
        .container p {
            color: rgba(255, 255, 255, 1); /* Cor branca */
        }
    `;

    container.innerHTML = `
        <h1>Ranking das Lontras Mais Divertidas!</h1>
        <p>Quem disse que lontras não têm senso de humor? Confira quem está no topo do ranking de piadas aquáticas!</p>
        <div class="notification">
            <h2>Posição 1: Lula Cômica</h2>
            <p>Ela é a rainha das piadas de polvos! Ninguém consegue segurar o riso quando ela começa.</p>
        </div>
        <div class="notification">
            <h2>Posição 2: Otávio Piadista</h2>
            <p>Se há uma lontra que sabe fazer um trocadilho, é o Otávio. Prepare-se para rolar de rir!</p>
        </div>
        <div class="notification">
            <h2>Posição 3: Marlon Trapalhão</h2>
            <p>Apesar de desastrado, ele sempre acaba fazendo todo mundo gargalhar com suas trapalhadas na água.</p>
        </div>
    `;

    container.appendChild(style);
    return container;
}
