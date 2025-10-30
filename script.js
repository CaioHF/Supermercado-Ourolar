const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu-lateral");
const campoBusca = document.getElementById("campoBusca");
const btnBusca = document.getElementById("btnBusca");
const menuItems = document.querySelectorAll(".menu-lateral li");
const produtos = document.querySelectorAll(".produto");
const msgErro = document.getElementById("mensagem-erro");

// FILTRAR PRODUTOS + DESTACAR CATEGORIA + SCROLL
function filtrarProdutos() {
  const termo = campoBusca.value.toLowerCase();
  let categoriasEncontradas = new Set();
  let encontrouAlgum = false;

  produtos.forEach(prod => {
    const nomeProduto = prod.querySelector("h2").textContent.toLowerCase();
    const categoriaProduto = prod.getAttribute("data-categoria");

    if (nomeProduto.includes(termo)) {
      prod.style.display = "flex";
      categoriasEncontradas.add(categoriaProduto);
      encontrouAlgum = true;
    } else {
      prod.style.display = "none";
    }
  });

  // Mostrar ou esconder mensagem de erro
  msgErro.style.display = encontrouAlgum ? "none" : "block";

  // Remover seleção anterior
  menuItems.forEach(i => i.classList.remove("ativo"));

  // Se só uma categoria, selecionar ela
  if (categoriasEncontradas.size === 1) {
    const categoriaFinal = [...categoriasEncontradas][0];

    menuItems.forEach(item => {
      if (item.getAttribute("data-categoria") === categoriaFinal) {
        item.classList.add("ativo");

        // Rolar suavemente até a categoria
        const categoriaElemento = document.querySelector(`[data-categoria="${categoriaFinal}"]`);
        if (categoriaElemento) {
          setTimeout(() => window.scrollTo({
            top: categoriaElemento.offsetTop - 80,
            behavior: "smooth"
          }), 150);
        }
      }
    });
  }
}

btnBusca.addEventListener("click", filtrarProdutos);

campoBusca.addEventListener("keyup", function(event) {
  if (event.key === "Enter") filtrarProdutos();
});

toggle.addEventListener("click", () => {
  menu.classList.toggle("ativo");
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 800) menu.classList.remove("ativo");
});

// Filtrar clicando no menu
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const categoria = item.getAttribute("data-categoria");

    menuItems.forEach(i => i.classList.remove("ativo"));
    item.classList.add("ativo");

    produtos.forEach(produto => {
      if (categoria === "ofertas" || produto.getAttribute("data-categoria") === categoria) {
        produto.style.display = "flex";
      } else {
        produto.style.display = "none";
      }
    });

    msgErro.style.display = "none"; // esconde mensagem ao clicar no menu
  });
});