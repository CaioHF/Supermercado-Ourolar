const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu-lateral");
const campoBusca = document.getElementById("campoBusca");
const btnBusca = document.getElementById("btnBusca");
const menuItems = document.querySelectorAll(".menu-lateral li");
const produtos = document.querySelectorAll(".produto");
const msgErro = document.getElementById("mensagem-erro");

// Helpers
function limparSelecaoMenu() {
  menuItems.forEach(i => i.classList.remove("ativo"));
}

function selecionarMenuPorCategoria(cat) {
  limparSelecaoMenu();
  menuItems.forEach(item => {
    if (String(item.getAttribute("data-categoria")).trim().toLowerCase() === String(cat).trim().toLowerCase()) {
      item.classList.add("ativo");
    }
  });
}

function mostrarSomenteCategoria(cat) {
  const categoriaLower = String(cat).trim().toLowerCase();
  produtos.forEach(p => {
    const c = String(p.getAttribute("data-categoria") || "").trim().toLowerCase();
    if (c === categoriaLower) {
      p.style.display = "flex";
    } else {
      p.style.display = "none";
    }
  });
}

function mostrarTodos() {
  produtos.forEach(p => p.style.display = "flex");
}

// Função principal de busca/filtragem
function filtrarProdutos() {
  const termoRaw = campoBusca.value || "";
  const termo = termoRaw.trim().toLowerCase();

  // Caso o campo esteja vazio: mostrar a categoria ativa (ou ofertas por padrão)
  if (!termo) {
    // se já existe item ativo, mostra só a categoria ativa
    const ativo = document.querySelector(".menu-lateral li.ativo");
    if (ativo) {
      const catAtiva = ativo.getAttribute("data-categoria");
      mostrarSomenteCategoria(catAtiva);
      msgErro.style.display = "none";
      return;
    } else {
      // sem ativo: voltar para 'ofertas' por padrão
      selecionarMenuPorCategoria("ofertas");
      mostrarSomenteCategoria("ofertas");
      msgErro.style.display = "none";
      return;
    }
  }

  // Se tiver termo: filtra por nome
  let categoriasEncontradas = new Set();
  let encontrouAlgum = false;

  produtos.forEach(prod => {
    const h2 = prod.querySelector("h2");
    const nome = h2 ? String(h2.textContent).trim().toLowerCase() : "";
    const categoriaProduto = String(prod.getAttribute("data-categoria") || "").trim().toLowerCase();

    if (nome.includes(termo)) {
      prod.style.display = "flex";
      encontrouAlgum = true;
      if (categoriaProduto) categoriasEncontradas.add(categoriaProduto);
    } else {
      prod.style.display = "none";
    }
  });

  msgErro.style.display = encontrouAlgum ? "none" : "block";

  // Atualiza seleção do menu:
  limparSelecaoMenu();
  if (categoriasEncontradas.size === 1) {
    const [categoriaFinal] = [...categoriasEncontradas];
    selecionarMenuPorCategoria(categoriaFinal);
    // rolar até o primeiro produto visível (mais UX)
    const primeiroVisivel = Array.from(produtos).find(p => p.style.display !== "none");
    if (primeiroVisivel) {
      setTimeout(() => window.scrollTo({
        top: primeiroVisivel.offsetTop - 80,
        behavior: "smooth"
      }), 100);
    }
  }
}

// Eventos de busca
btnBusca.addEventListener("click", filtrarProdutos);
campoBusca.addEventListener("keyup", function(event) {
  if (event.key === "Enter") filtrarProdutos();
});

// Menu mobile toggle
toggle.addEventListener("click", () => {
  menu.classList.toggle("ativo");
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 800) menu.classList.remove("ativo");
});

// Clique no menu - mostra só a categoria (sem exceções)
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const categoria = String(item.getAttribute("data-categoria") || "").trim().toLowerCase();
    if (!categoria) return;

    limparSelecaoMenu();
    item.classList.add("ativo");

    // Limpa campo de busca (opcional). Se não quiser que limpe, comente a linha abaixo.
    campoBusca.value = "";

    mostrarSomenteCategoria(categoria);

    msgErro.style.display = "none";

    // rolar até o primeiro produto da categoria
    const primeiro = Array.from(produtos).find(p => p.getAttribute("data-categoria") && p.getAttribute("data-categoria").trim().toLowerCase() === categoria);
    if (primeiro) {
      setTimeout(() => window.scrollTo({
        top: primeiro.offsetTop - 80,
        behavior: "smooth"
      }), 100);
    }
  });
});

// Ao carregar a página: selecionar ofertas e mostrar só elas
window.addEventListener("DOMContentLoaded", () => {
  selecionarMenuPorCategoria("ofertas");
  mostrarSomenteCategoria("ofertas");
  msgErro.style.display = "none";
});