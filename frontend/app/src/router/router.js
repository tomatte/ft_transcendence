// Aguarda o carregamento completo do DOM antes de executar o código.
document.addEventListener("DOMContentLoaded", () => {
    // Define a função navigateTo, que muda a URL e chama o router para atualizar a página.
    const navigateTo = url => {
        // Atualiza a URL no navegador sem recarregar a página.
        history.pushState(null, null, url);
        // Chama a função router para renderizar a view correspondente.
        router();
    };

    // Define a função router, que determina qual view deve ser renderizada com base na URL.
    const router = async () => {
        // Define as rotas e as views correspondentes.
        const routes = [
            { path: "/", view: () => "<h1>Home</h1><p>Bem-vindo ao projeto Transcendence!</p>" },
            { path: "/about", view: () => "<h1>About</h1><p>Sobre o projeto Transcendence.</p>" },
            { path: "/contact", view: () => "<h1>Contact</h1><p>Entre em contato conosco.</p>" }
        ];

        // Mapeia as rotas para verificar qual corresponde à URL atual.
        const potentialMatches = routes.map(route => {
            return {
                route: route,
                isMatch: location.pathname === route.path
            };
        });

        // Encontra a rota que corresponde à URL atual.
        let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

        // Se nenhuma rota corresponder, define a rota padrão (primeira rota).
        if (!match) {
            match = {
                route: routes[0],
                isMatch: true
            };
        }

        // Atualiza o conteúdo do elemento com ID "app" com a view correspondente.
        document.querySelector("#app").innerHTML = await match.route.view();
    };

    // Adiciona um ouvinte de evento para lidar com mudanças no histórico do navegador (ex. quando o usuário usa os botões de voltar/avançar).
    window.addEventListener("popstate", router);

    // Adiciona um ouvinte de evento para interceptar cliques em links e navegar sem recarregar a página.
    document.body.addEventListener("click", e => {
        // Verifica se o elemento clicado é um link que deve ser tratado pelo router.
        if (e.target.matches("[data-link]")) {
            // Previne o comportamento padrão do navegador de seguir o link.
            e.preventDefault();
            // Navega para a URL do link clicado.
            navigateTo(e.target.href);
        }
    });

    // Chama a função router para renderizar a view inicial com base na URL atual.
    router();
});
