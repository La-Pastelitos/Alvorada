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
function formatNumberToBRL(num) {
  return "R$ " + num.toFixed(2).replace(".", ",");
}
function loadCart() {
  return JSON.parse(localStorage.getItem("lp_cart") || "[]");
}
function saveCart(cart) {
  localStorage.setItem("lp_cart", JSON.stringify(cart));
}
function updateCartCount() {
  const cart = loadCart();
  const countEl = document.getElementById("count-carrinho");
  if (!countEl) return;
  const totalItems = cart.reduce((s, it) => s + (it.qty || 1), 0);
  countEl.innerText = totalItems;
}
function showMessage(msg, tempo = 2000) {
  let mensagemDiv = document.getElementById("mensagem-info");
  if (!mensagemDiv) {
    mensagemDiv = document.createElement("div");
    mensagemDiv.id = "mensagem-info";
    mensagemDiv.style.position = "fixed";
    mensagemDiv.style.top = "60px";
    mensagemDiv.style.right = "20px";
    mensagemDiv.style.background = "#333";
    mensagemDiv.style.color = "#fff";
    mensagemDiv.style.padding = "12px 18px";
    mensagemDiv.style.borderRadius = "8px";
    mensagemDiv.style.zIndex = "1000";
    mensagemDiv.style.display = "none";
    document.body.appendChild(mensagemDiv);
  }
  mensagemDiv.innerText = msg;
  mensagemDiv.style.display = "block";
  setTimeout(() => (mensagemDiv.style.display = "none"), tempo);
}

/* ======= MODAL PRODUTO ======= */
const modal = document.getElementById("modal-produto");
const overlay = document.getElementById("overlay");
const modalImg = document.getElementById("modal-img");
const modalTitulo = document.getElementById("modal-nome");
const modalObservacoes = document.getElementById("observacoes");
const modalDescricao = document.getElementById("modal-descricao");
const modalPreco = document.getElementById("modal-preco");
const modalPrecoTotal = document.getElementById("modal-preco-total");
const btnAdicionar = document.getElementById("btn-adicionar");

let precoPastel = 0;
let totalProduto = 0;
let molhosSelecionados = {};

/* ======= ABRIR MODAL PRODUTO ======= */
document.querySelectorAll(".produto").forEach((produto) => {
  const btn = produto.querySelector("button");
  btn.addEventListener("click", () => {
    const imgSrc = produto.querySelector("img").src;
    const titulo = produto.querySelector("h3").innerText;
    const descricao =
      produto.querySelector(".descricao")?.innerText || "Sem descrição!";
    const precoTexto = produto.querySelector(".preco").innerText;

    precoPastel = parseFloat(precoTexto.replace("R$", "").replace(",", "."));
    totalProduto = precoPastel;

    molhosSelecionados = {};
    modalObservacoes.value = "";

    modalImg.src = imgSrc;
    modalTitulo.innerText = titulo;
    modalDescricao.innerText = descricao;
    modalPreco.innerText = precoTexto;
    atualizarPrecoNoModal();

    modal.style.display = "flex";
    overlay.style.display = "block";
  });
});

function fecharModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}
overlay.addEventListener("click", fecharModal);

document.querySelectorAll(".btn-add-molho").forEach((botao) => {
  botao.addEventListener("click", () => {
    const container = botao.parentElement;
    const nomeMolho = container.querySelector("p").innerText.trim();
    const precoMolho = parseFloat(
      container
        .querySelector(".preco-molho")
        .innerText.replace("R$", "")
        .replace(",", ".")
    );

    totalProduto += precoMolho;
    molhosSelecionados[nomeMolho] = (molhosSelecionados[nomeMolho] || 0) + 1;

    atualizarPrecoNoModal();
  });
});

document.querySelectorAll(".btn-sub-molho").forEach((botao) => {
  botao.addEventListener("click", () => {
    const container = botao.parentElement;
    const nomeMolho = container.querySelector("p").innerText.trim();
    const precoMolho = parseFloat(
      container
        .querySelector(".preco-molho")
        .innerText.replace("R$", "")
        .replace(",", ".")
    );

    if (molhosSelecionados[nomeMolho] > 0) {
      molhosSelecionados[nomeMolho]--;
      totalProduto = Math.max(precoPastel, totalProduto - precoMolho);
      if (molhosSelecionados[nomeMolho] === 0)
        delete molhosSelecionados[nomeMolho];
    }

    atualizarPrecoNoModal();
  });
});

/* ======= ATUALIZAR PREÇO ======= */
function atualizarPrecoNoModal() {
  modalPrecoTotal.innerText = formatNumberToBRL(totalProduto);
}

/* ======= ADICIONAR AO CARRINHO ======= */
btnAdicionar.addEventListener("click", () => {
  const observacoesValor = modalObservacoes.value.trim();
  const nomePastel = modalTitulo.innerText;
  const imgSrc = modalImg.src || "";

  const molhosArray = [];
  for (let molho in molhosSelecionados) {
    molhosArray.push({ nome: molho, qtd: molhosSelecionados[molho] });
  }

  const item = {
    id: Date.now().toString(),
    nome: nomePastel,
    preco: precoPastel,
    molhos: molhosArray,
    observacoes: observacoesValor,
    qty: 1,
    imagem: imgSrc,
    subtotal: totalProduto,
  };

  const cart = loadCart();
  const igualIndex = cart.findIndex(
    (it) =>
      it.nome === item.nome &&
      JSON.stringify(it.molhos) === JSON.stringify(item.molhos) &&
      (it.observacoes || "") === (item.observacoes || "") &&
      it.preco === item.preco
  );

  if (igualIndex > -1) {
    cart[igualIndex].qty += 1;
    cart[igualIndex].subtotal += totalProduto;
  } else {
    cart.push(item);
  }

  saveCart(cart);
  updateCartCount();
  fecharModal();
  showMessage("Produto adicionado ao carrinho!");
});

/* ======= ABRIR CARRINHO ======= */
document.getElementById("pedidos").addEventListener("click", () => {
  window.location.href = "carrinho-index.html";
});

/* ======= INICIALIZAÇÃO ======= */
document.addEventListener("DOMContentLoaded", updateCartCount);
