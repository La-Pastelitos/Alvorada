function mostrarCategoria(id) {
  document.querySelectorAll(".categoria").forEach((sec) => {
    sec.classList.remove("ativa");
  });
  document.getElementById(id).classList.add("ativa");
}

const botoes = document.querySelectorAll(".nav-btn");

botoes.forEach((btn) => {
  btn.addEventListener("click", () => {
    botoes.forEach((b) => b.classList.remove("btn-nav-ativo"));

    btn.classList.add("btn-nav-ativo");
  });
});

// Selecionar modal e overlay
const modal = document.getElementById("modal-produto");
const overlay = document.getElementById("overlay");

// Elementos dentro do modal
const modalImg = document.getElementById("modal-img");
const modalTitulo = document.getElementById("modal-nome");
const modalDescricao = document.getElementById("modal-descricao");
const modalPreco = document.getElementById("modal-preco");

// Pegar todos os produtos automaticamente
const produtos = document.querySelectorAll(".produto");

produtos.forEach((produto) => {
  const btn = produto.querySelector("button"); // botão Adicionar

  btn.addEventListener("click", () => {
    const imgSrc = produto.querySelector("img").src;
    const titulo = produto.querySelector("h3").innerText;
    const descricao =
      produto.querySelector(".descricao")?.innerText || "Sem descrição!";
    const preco = produto.querySelector(".preco").innerText;

    // Preencher modal
    modalImg.src = imgSrc;
    modalTitulo.innerText = titulo;
    modalDescricao.innerText = descricao;
    modalPreco.innerText = preco;

    // Abrir modal + overlay
    modal.style.display = "flex";
    overlay.style.display = "block";
  });
});

// Fechar modal
function fecharModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}

// Fechar clicando no fundo escuro
overlay.addEventListener("click", fecharModal);
