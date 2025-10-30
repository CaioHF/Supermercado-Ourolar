const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu-lateral");

// Abrir/fechar menu
toggle.addEventListener("click", () => {
    menu.classList.toggle("ativo");
});

// Ajuste ao redimensionar
window.addEventListener("resize", () => {
    if (window.innerWidth >= 800) {
        menu.classList.remove("ativo");
    }
});

// Filtrar produtos por categoria
const menuItems = document.querySelectorAll(".menu-lateral li");
const produtos = document.querySelectorAll(".produto");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        const categoria = item.getAttribute("data-categoria");

        // Remove a classe 'ativo' de todos
        menuItems.forEach(i => i.classList.remove("ativo"));

        // Adiciona 'ativo' no clicado
        item.classList.add("ativo");

        // Filtrar produtos
        produtos.forEach(produto => {
            if (categoria === "ofertas") {
                produto.style.display = "flex";
            } else if (produto.getAttribute("data-categoria") === categoria) {
                produto.style.display = "flex";
            } else {
                produto.style.display = "none";
            }
        });
    });
});