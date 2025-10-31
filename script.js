// Seletores principais
const toggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu-lateral");
const campoBusca = document.getElementById("campoBusca");
const btnBusca = document.getElementById("btnBusca");
const menuItems = document.querySelectorAll(".menu-lateral li");
const msgErro = document.getElementById("mensagem-erro");

// ===== Funções auxiliares =====
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
  const produtos = document.querySelectorAll(".produto"); // pega produtos atuais
  produtos.forEach(p => {
    const c = String(p.getAttribute("data-categoria") || "").trim().toLowerCase();
    p.style.display = c === categoriaLower ? "flex" : "none";
  });
}

function mostrarTodos() {
  const produtos = document.querySelectorAll(".produto");
  produtos.forEach(p => p.style.display = "flex");
}

// ===== Função principal de busca/filtragem =====
function filtrarProdutos() {
  const produtos = document.querySelectorAll(".produto");
  const termoRaw = campoBusca.value || "";
  const termo = termoRaw.trim().toLowerCase();

  // Caso o campo esteja vazio: mostrar a categoria ativa (ou ofertas por padrão)
  if (!termo) {
    const ativo = document.querySelector(".menu-lateral li.ativo");
    if (ativo) {
      const catAtiva = ativo.getAttribute("data-categoria");
      mostrarSomenteCategoria(catAtiva);
      msgErro.style.display = "none";
      return;
    } else {
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

    const primeiroVisivel = Array.from(produtos).find(p => p.style.display !== "none");
    if (primeiroVisivel) {
      setTimeout(() => window.scrollTo({
        top: primeiroVisivel.offsetTop - 80,
        behavior: "smooth"
      }), 100);
    }
  }
}

// ===== Eventos =====

// Botão de busca e tecla Enter
btnBusca.addEventListener("click", filtrarProdutos);
campoBusca.addEventListener("keyup", function (event) {
  if (event.key === "Enter") filtrarProdutos();
});

// Toggle do menu lateral (mobile)
toggle.addEventListener("click", () => {
  menu.classList.toggle("ativo");
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 800) menu.classList.remove("ativo");
});

// Clique no menu - mostra só a categoria
menuItems.forEach(item => {
  item.addEventListener("click", () => {
    const categoria = String(item.getAttribute("data-categoria") || "").trim().toLowerCase();
    if (!categoria) return;

    limparSelecaoMenu();
    item.classList.add("ativo");

    campoBusca.value = ""; // limpa campo de busca

    mostrarSomenteCategoria(categoria);
    msgErro.style.display = "none";

    const produtos = document.querySelectorAll(".produto");
    const primeiro = Array.from(produtos).find(
      p => p.getAttribute("data-categoria") &&
        p.getAttribute("data-categoria").trim().toLowerCase() === categoria
    );

    if (primeiro) {
      setTimeout(() => window.scrollTo({
        top: primeiro.offsetTop - 80,
        behavior: "smooth"
      }), 100);
    }
  });
});

// ===== Carregamento automático de produtos via JSON =====
async function carregarProdutos() {
  try {
    const resposta = await fetch("produtos.json");
    const dados = await resposta.json();
    const container = document.querySelector(".produtos");

    dados.forEach(prod => {
      const div = document.createElement("div");
      div.classList.add("produto");
      div.setAttribute("data-categoria", prod.categoria);

      div.innerHTML = `
        <img src="${prod.imagem}" alt="${prod.nome}">
        <h2>${prod.nome}</h2>
        <p class="preco">${prod.preco}</p>
      `;

      container.appendChild(div);
    });

    inicializarFiltros();
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
  }
}

function inicializarFiltros() {
  selecionarMenuPorCategoria("ofertas");
  mostrarSomenteCategoria("ofertas");
  msgErro.style.display = "none";
}

// ===== Início =====
window.addEventListener("DOMContentLoaded", carregarProdutos);
