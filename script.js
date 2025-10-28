const toggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu-lateral");

    // Abre/fecha menu ao clicar
    toggle.addEventListener("click", () => {
        menu.classList.toggle("ativo");
    });

    // Garante que o layout se ajuste ao redimensionar a janela
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 800) {
            // Em telas grandes, o menu fica fixo e sem a classe 'ativo'
            menu.classList.remove("ativo");
        }
});