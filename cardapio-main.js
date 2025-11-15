// Selecionar modal e overlay
const modal = document.getElementById("modal-produto");
const overlay = document.getElementById("overlay");

// Elementos dentro do modal
const modalImg = document.getElementById("modal-img");
const modalTitulo = document.getElementById("modal-nome");
const modalObservacoes = document.getElementById("observacoes");
const modalDescricao = document.getElementById("modal-descricao");
const modalPreco = document.getElementById("modal-preco");
const modalPrecoTotal = document.getElementById("modal-preco-total");
const btnAdicionar = document.getElementById("btn-adicionar"); // botão enviar pedido

let precoPastel = 0; // preço base do pastel
let totalProduto = 0; // total com molhos
let molhosSelecionados = {}; // objeto para guardar quantidade de cada molho

// Seleciona todos os produtos
const produtos = document.querySelectorAll(".produto");

produtos.forEach((produto) => {
  const btn = produto.querySelector("button");

  btn.addEventListener("click", () => {
    const imgSrc = produto.querySelector("img").src;
    const titulo = produto.querySelector("h3").innerText;
    const descricao =
      produto.querySelector(".descricao")?.innerText || "Sem descrição!";
    const precoTexto = produto.querySelector(".preco").innerText;

    // Define o preço do pastel e total inicial
    precoPastel = parseFloat(precoTexto.replace("R$", "").replace(",", "."));
    totalProduto = precoPastel;

    // Reseta molhos e observações
    molhosSelecionados = {};
    modalObservacoes.value = "";

    // Preenche o modal
    modalImg.src = imgSrc;
    modalTitulo.innerText = titulo;
    modalDescricao.innerText = descricao;
    modalPreco.innerText = precoTexto;
    atualizarPrecoNoModal();

    // Abre modal
    modal.style.display = "flex";
    overlay.style.display = "block";
  });
});

// Fechar modal
function fecharModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}

overlay.addEventListener("click", fecharModal);

// Botões de adicionar molho
const botoesMolho = document.querySelectorAll(".btn-add-molho");

botoesMolho.forEach((botao) => {
  botao.addEventListener("click", () => {
    const container = botao.parentElement;
    const nomeMolho = container.querySelector("p").innerText.trim();
    const precoMolhoTexto = container.querySelector(".preco-molho").innerText;
    const precoMolho = parseFloat(
      precoMolhoTexto.replace("R$", "").replace(",", ".")
    );

    totalProduto += precoMolho;

    // Incrementa quantidade do molho
    if (molhosSelecionados[nomeMolho]) {
      molhosSelecionados[nomeMolho]++;
    } else {
      molhosSelecionados[nomeMolho] = 1;
    }

    atualizarPrecoNoModal();
  });
});

// Botões de subtrair molho
const botoesSubMolho = document.querySelectorAll(".btn-sub-molho");

botoesSubMolho.forEach((botao) => {
  botao.addEventListener("click", () => {
    const container = botao.parentElement;
    const nomeMolho = container.querySelector("p").innerText.trim();
    const precoMolhoTexto = container.querySelector(".preco-molho").innerText;
    const precoMolho = parseFloat(
      precoMolhoTexto.replace("R$", "").replace(",", ".")
    );

    // Subtrai mas nunca abaixo do preço do pastel
    totalProduto = Math.max(precoPastel, totalProduto - precoMolho);

    // Decrementa quantidade do molho
    if (molhosSelecionados[nomeMolho]) {
      molhosSelecionados[nomeMolho]--;
      if (molhosSelecionados[nomeMolho] === 0) {
        delete molhosSelecionados[nomeMolho]; // remove se quantidade = 0
      }
    }

    atualizarPrecoNoModal();
  });
});

// Atualizar preço total no modal
function atualizarPrecoNoModal() {
  modalPrecoTotal.innerText = "R$ " + totalProduto.toFixed(2).replace(".", ",");
}

// Botão de enviar pedido para WhatsApp
btnAdicionar.addEventListener("click", () => {
  const observacoesValor = modalObservacoes.value.trim();
  const nomePastel = modalTitulo.innerText;

  let mensagem = `Olá! Quero pedir:\n`;
  mensagem += `*Pastel:* ${nomePastel}\n`;

  // Monta lista de molhos com quantidade
  const molhosArray = [];
  for (let molho in molhosSelecionados) {
    const qtd = molhosSelecionados[molho];
    molhosArray.push(qtd > 1 ? `${molho} x${qtd}` : molho);
  }

  if (molhosArray.length > 0) {
    mensagem += `*Molhos:* ${molhosArray.join(", ")}\n`;
  }

  mensagem += `*Total:* R$ ${totalProduto.toFixed(2).replace(".", ",")}\n`;

  if (observacoesValor) {
    mensagem += `*Observações:* ${observacoesValor}`;
  }

  // Número do WhatsApp
  const numero = "+556993603059";
  const linkWhatsApp =
    "https://wa.me/" +
    numero.replace(/\D/g, "") +
    "?text=" +
    encodeURIComponent(mensagem);

  // Abre o WhatsApp com a mensagem pronta
  window.open(linkWhatsApp, "_blank");
});
