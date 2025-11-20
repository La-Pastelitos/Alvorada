/* ====== UTILITÁRIOS ======= */
function loadCart() {
  return JSON.parse(localStorage.getItem("lp_cart") || "[]");
}

function saveCart(c) {
  localStorage.setItem("lp_cart", JSON.stringify(c));
}

function formatNumberToBRL(num) {
  return "R$ " + num.toFixed(2).replace(".", ",");
}

function calcularTotal(cart) {
  return cart.reduce(
    (s, it) => s + (it.subtotal || it.preco * (it.qty || 1)),
    0
  );
}

document.getElementById("voltar").addEventListener("click", () => {
  window.location.href = "index.html";
});

const container = document.getElementById("carrinho-conteudo");
const textoTotal = document.getElementById("texto-total");

function renderCart() {
  const cart = loadCart();

  if (!cart.length) {
    container.innerHTML =
      '<div class="empty"><p>Seu carrinho está vazio.</p></div>';
    textoTotal.innerText = "Total: R$ 0,00";
    return;
  }

  let html = `
    <table>
      <thead>
      </thead>
      <tbody>
  `;

  cart.forEach((item) => {
    const molhosText = item.molhos?.length
      ? item.molhos.map((m) => `${m.nome} x${m.qtd}`).join(", ")
      : "-";

    html += `
      <tr>
        <td>${item.nome}</td>
        <td>${item.qty}</td>
        <td>${molhosText}</td>
        <td>${formatNumberToBRL(item.subtotal)}</td>

        <td class="td-editar-remover">
          <button class="btn-editar" data-id="${
            item.id
          }"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg></button>
          <button class="btn-remover" data-id="${
            item.id
          }"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg></button>
        </td>
      </tr>`;
  });

  html += "</tbody></table>";
  container.innerHTML = html;

  textoTotal.innerText = "Total: " + formatNumberToBRL(calcularTotal(cart));

  /* BOTÕES FUNCIONANDO */
  document.querySelectorAll(".btn-remover").forEach((btn) => {
    btn.addEventListener("click", () => removerItem(btn.dataset.id));
  });

  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", () => abrirEdicao(btn.dataset.id));
  });
}

/* ======= REMOVER ITEM ======= */
function removerItem(id) {
  const cart = loadCart().filter((it) => it.id !== id);
  saveCart(cart);
  renderCart();
}

/* ======= ABRIR MODAL PARA EDITAR ITEM ======= */
const modalEditar = document.getElementById("modal-editar");
const btnSalvarEdicao = document.getElementById("salvar-edicao");
const btnFecharEditar = document.getElementById("fechar-editar");

let itemEditando = null;

function abrirEdicao(id) {
  const cart = loadCart();
  const item = cart.find((it) => it.id === id);
  itemEditando = item;

  let molhosHTML = `
      <h4>Molhos:</h4>
      ${item.molhos
        .map(
          (m, i) => `
        <div class="linha-molho">
          <span>${m.nome}</span>
          <input type="number" min="0" value="${m.qtd}" data-index="${i}" class="edit-molho-qtd">
        </div>
      `
        )
        .join("")}
  `;

  document.getElementById("editar-corpo").innerHTML = `
    <label>Quantidade</label>
    <input id="editar-qty" type="number" min="1" value="${item.qty}">

    <label>Observações</label>
    <textarea id="editar-obs">${item.observacoes || ""}</textarea>

    ${molhosHTML}
  `;

  modalEditar.style.display = "flex";
}

/* ======= SALVAR EDIÇÃO ======= */
btnSalvarEdicao.addEventListener("click", () => {
  const cart = loadCart();
  const item = cart.find((it) => it.id === itemEditando.id);

  const novaQtd = parseInt(document.getElementById("editar-qty").value);
  const novaObs = document.getElementById("editar-obs").value.trim();

  if (!novaQtd || novaQtd < 1) return alert("Quantidade inválida!");

  const inputsMolhos = document.querySelectorAll(".edit-molho-qtd");

  let novoSubtotal = item.preco * novaQtd;

  inputsMolhos.forEach((inp) => {
    const qtd = parseInt(inp.value);
    const index = inp.dataset.index;

    item.molhos[index].qtd = qtd;

    if (qtd > 0) novoSubtotal += qtd * 3; // valor fixo do molho R$3,00
  });

  item.qty = novaQtd;
  item.observacoes = novaObs;
  item.subtotal = novoSubtotal;

  saveCart(cart);
  modalEditar.style.display = "none";
  renderCart();
});

/* ======= FECHAR MODAL ======= */
btnFecharEditar.addEventListener("click", () => {
  modalEditar.style.display = "none";
});

/* ==================================
    VALIDAR CAMPOS (BORDA VERMELHA)
   ================================== */
function marcarErro(input) {
  input.style.border = "2px solid red";

  if (
    !input.nextElementSibling ||
    !input.nextElementSibling.classList.contains("erro-msg")
  ) {
    const msg = document.createElement("small");
    msg.classList.add("erro-msg");
    msg.style.color = "red";
    msg.innerText = "Preencha este campo";
    input.insertAdjacentElement("afterend", msg);
  }
}

function limparErro(input) {
  input.style.border = "";
  if (input.nextElementSibling?.classList.contains("erro-msg")) {
    input.nextElementSibling.remove();
  }
}
async function salvarVendaSupabase(nomeCliente, totalPedido) {
  const { data, error } = await supabase.from("vendas").insert([
    {
      nome: nomeCliente,
      total: totalPedido,
    },
  ]);

  if (error) {
    console.error("Erro ao salvar venda:", error);
  } else {
    console.log("Venda registrada:", data);
  }
}

/* ======= FINALIZAR PEDIDO ======= */
const modalFinalizar = document.getElementById("modal-finalizar");
const fecharFinalizar = document.getElementById("fechar-finalizar");
const confirmarFinalizar = document.getElementById("confirmar-finalizar");

document.getElementById("finalizar-btn").addEventListener("click", () => {
  modalFinalizar.style.display = "flex";
});

fecharFinalizar.addEventListener("click", () => {
  modalFinalizar.style.display = "none";
});

confirmarFinalizar.addEventListener("click", () => {
  const campos = [
    "input-bairro",
    "input-rua",
    "input-numero",
    "input-nome",
    "input-telefone",
  ];

  let valido = true;

  campos.forEach((id) => {
    const input = document.getElementById(id);
    if (!input.value.trim()) {
      marcarErro(input);
      valido = false;
    } else {
      limparErro(input);
    }
  });

  if (!valido) return;

  const bairro = document.getElementById("input-bairro").value.trim();
  const rua = document.getElementById("input-rua").value.trim();
  const numero = document.getElementById("input-numero").value.trim();
  const complemento = document.getElementById("input-complemento").value.trim();
  const nome = document.getElementById("input-nome").value.trim();
  const telefone = document.getElementById("input-telefone").value.trim();
  const pagamento = document.getElementById("input-pagamento").value;

  const cart = loadCart();
  if (!cart.length) return alert("Seu carrinho está vazio!");

  const totalPedido = calcularTotal(cart);
  salvarVendaSupabase(nome, totalPedido);

  let mensagem = "Olá! Gostaria de fazer um pedido:\n\n";

  cart.forEach((it, i) => {
    mensagem += `${i + 1}. ${it.nome} — Qtd: ${it.qty}\n`;

    const molhosAtivos = it.molhos.filter((m) => m.qtd > 0);
    if (molhosAtivos.length) {
      mensagem += `Molhos: ${molhosAtivos
        .map((m) => m.nome + " x" + m.qtd)
        .join(", ")}\n`;
    }

    if (it.observacoes) mensagem += `Obs: ${it.observacoes}\n`;

    mensagem += `Subtotal: ${formatNumberToBRL(it.subtotal)}\n\n`;
  });

  mensagem += `Total: ${formatNumberToBRL(calcularTotal(cart))}\n\n`;

  mensagem += "*Entrega:*\n";
  mensagem += `*Rua:* ${rua}, Nº: ${numero}\n`;
  if (complemento) mensagem += `Complemento: ${complemento}\n`;
  mensagem += `Bairro: ${bairro}\n`;
  mensagem += `Nome: ${nome}\n`;
  mensagem += `Telefone: ${telefone}\n`;
  mensagem += `Pagamento: ${pagamento}\n\nObrigado!`;

  const numeroDest = "+556993603059";

  const link =
    "https://wa.me/" +
    numeroDest.replace(/\D/g, "") +
    "?text=" +
    encodeURIComponent(mensagem);

  window.open(link, "_blank");

  localStorage.removeItem("lp_cart");
  renderCart();
  modalFinalizar.style.display = "none";
});

/* ======= INICIALIZAÇÃO ======= */
document.addEventListener("DOMContentLoaded", renderCart);
