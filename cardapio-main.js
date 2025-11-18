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

const molhosPorCategoria = {
  salgados: [
    { nome: "Molho Verde", preco: 3, img: "./images/molho-verde.png" },
    { nome: "Maionese", preco: 3, img: "./images/molho-verde.png" },
  ],

  // porções usam os mesmos molhos dos pasteis salgados
  porcoes: [
    { nome: "Molho Verde", preco: 3, img: "./images/molho-verde.png" },
    { nome: "Maionese", preco: 3, img: "./images/molho-verde.png" },
  ],

  doces: [
    { nome: "Calda de Chocolate", preco: 3, img: "./images/nuttela.jpeg" },
    { nome: "Nutella", preco: 4, img: "./images/nuttela.jpeg" },
  ],
};

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

    const section = produto.closest(".categoria").id;
    gerarMolhos(section);

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

function gerarMolhos(categoria) {
  const areaMolhos = document.querySelector(".molhos");
  const listaMolhoHTML = areaMolhos.querySelectorAll(".molho-adicionar");

  // Se a categoria não tiver molhos → esconder tudo
  if (!molhosPorCategoria[categoria]) {
    areaMolhos.style.display = "none";
    return;
  }

  // Caso tenha molhos → mostrar
  areaMolhos.style.display = "block";

  // Limpar molhos atuais
  areaMolhos.innerHTML = "<h2>Molhos:</h2>";

  // Inserir molhos daquela categoria
  molhosPorCategoria[categoria].forEach((molho) => {
    const bloco = document.createElement("div");
    bloco.classList.add("molho-adicionar");

    bloco.innerHTML = `
      <p><img src="${molho.img}" alt="${molho.nome}" /> ${molho.nome}</p>
      <p class="preco preco-molho">R$ ${molho.preco
        .toFixed(2)
        .replace(".", ",")}</p>
      <button class="btn-add-molho"><svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    width="20"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg></button>
      <button class="btn-sub-molho"> <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    width="20"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M5 12h14"
                    />
                  </svg></button>
    `;

    areaMolhos.appendChild(bloco);
  });

  // Reativar eventos dos botões
  registrarEventosMolhos();
}

function registrarEventosMolhos() {
  document.querySelectorAll(".btn-add-molho").forEach((botao) => {
    botao.onclick = () => {
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
    };
  });

  document.querySelectorAll(".btn-sub-molho").forEach((botao) => {
    botao.onclick = () => {
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
    };
  });
}

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
/* ===========================
   MENU LATERAL
=========================== */

const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebar-overlay");
const menuBtn = document.getElementById("menu");
const closeSidebar = document.getElementById("close-sidebar");

menuBtn.addEventListener("click", () => {
  sidebar.classList.add("show");
  sidebarOverlay.style.display = "block";
});

closeSidebar.addEventListener("click", fecharSidebar);
sidebarOverlay.addEventListener("click", fecharSidebar);

function fecharSidebar() {
  sidebar.classList.remove("show");
  sidebarOverlay.style.display = "none";
}

/* ===========================
   MODAIS
=========================== */

function abrirModal2(id) {
  document.getElementById(id).style.display = "flex";
}

function fecharModal2(id) {
  document.getElementById(id).style.display = "none";
}

/* ===========================
   SISTEMA DE MENSAGENS
=========================== */

function mostrarMensagem(id, texto, tipo) {
  const msg = document.getElementById(id);
  msg.style.display = "block";
  msg.textContent = texto;

  msg.className =
    "msg-retorno " + (tipo === "erro" ? "msg-erro" : "msg-sucesso");

  if (tipo === "sucesso") {
    setTimeout(() => {
      msg.style.display = "none";
    }, 2000);
  }
}

/* ===========================
   VALIDAÇÃO DOS CAMPOS
=========================== */

function marcarErro(campo) {
  campo.style.border = "1px solid red";
}

function limparErro(campo) {
  campo.style.border = "1px solid #bbb";
}

/* ===========================
   SALVAR PASTEL
=========================== */

function salvarPastel() {
  const categoria = document.getElementById("pastel-categoria");
  const imagem = document.getElementById("pastel-imagem");
  const nome = document.getElementById("pastel-nome");
  const descricao = document.getElementById("pastel-descricao");
  const preco = document.getElementById("pastel-preco");

  let erro = false;

  limparErro(categoria);
  limparErro(imagem);
  limparErro(nome);
  limparErro(descricao);
  limparErro(preco);

  if (categoria.value === "") {
    marcarErro(categoria);
    erro = true;
  }
  if (imagem.files.length === 0) {
    marcarErro(imagem);
    erro = true;
  }
  if (nome.value.trim() === "") {
    marcarErro(nome);
    erro = true;
  }

  if (preco.value === "" || preco.value <= 0) {
    marcarErro(preco);
    erro = true;
  }

  if (erro)
    return mostrarMensagem(
      "msg-pastel",
      "Preencha todos os campos corretamente!",
      "erro"
    );

  mostrarMensagem("msg-pastel", "Pastel salvo com sucesso!", "sucesso");

  setTimeout(() => {
    fecharModal2("modal-add-pastel");
  }, 1500);
}

/* ===========================
   SALVAR MOLHO
=========================== */

function salvarMolho() {
  const categoria = document.getElementById("molho-categoria");
  const nome = document.getElementById("molho-nome");
  const preco = document.getElementById("molho-preco");

  let erro = false;

  limparErro(categoria);
  limparErro(nome);
  limparErro(preco);

  if (categoria.value === "") {
    marcarErro(categoria);
    erro = true;
  }
  if (nome.value.trim() === "") {
    marcarErro(nome);
    erro = true;
  }
  if (preco.value === "" || preco.value <= 0) {
    marcarErro(preco);
    erro = true;
  }

  if (erro)
    return mostrarMensagem("msg-molho", "Preencha todos os campos!", "erro");

  mostrarMensagem("msg-molho", "Molho salvo com sucesso!", "sucesso");

  setTimeout(() => {
    fecharModal2("modal-add-molho");
  }, 1500);
}

/* ===========================
   SALVAR LOGO
=========================== */

function salvarLogo() {
  const imagem = document.getElementById("logo-imagem");

  limparErro(imagem);

  if (imagem.files.length === 0) {
    marcarErro(imagem);
    return mostrarMensagem("msg-logo", "Selecione uma nova imagem!", "erro");
  }

  mostrarMensagem("msg-logo", "Logo atualizada com sucesso!", "sucesso");

  setTimeout(() => {
    fecharModal2("modal-editar-logo");
  }, 1500);
}

/* ===========================
   INICIALIZAÇÃO
=========================== */

const CODIGO_SECRETO = "#@la---paste--litos0010110";

document.getElementById("observacoes").addEventListener("input", function () {
  if (this.value.includes(CODIGO_SECRETO)) {
    this.value = ""; // limpa o campo para ninguém ver
    abrirModalSecreto();
  }
});

function liberarModoAdmin() {
  const admin = localStorage.getItem("lp_admin");

  if (admin === "true") {
    // Tudo que for só para administradores deve ter a classe .btn-admin
    document.getElementById("menu").style.display = "block";
  }
}

function abrirModalSecreto() {
  document.getElementById("modal-secreto").style.display = "flex";
}

function fecharModalSecreto() {
  document.getElementById("modal-secreto").style.display = "none";
}

async function validarAcesso() {
  const email = document.getElementById("secret-email").value;
  const senha = document.getElementById("secret-senha").value;

  // Esconde erro anterior
  const erroEl = document.getElementById("secret-erro");
  erroEl.style.display = "none";

  // Tenta autenticar com Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  if (error) {
    // Senha ou email inválidos
    erroEl.innerText = "Email ou senha incorretos!";
    erroEl.style.display = "block";
    return;
  }

  // SUCESSO — acesso autorizado
  localStorage.setItem("lp_admin", "true");

  fecharModalSecreto();
  liberarModoAdmin();

  alert("Acesso liberado!");
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  liberarModoAdmin();
});
