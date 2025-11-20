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
let molhosPorCategoria = {};
let isAdmin = false;
let categoriaAtualModal = null;

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
    categoriaAtualModal = section;
    gerarMolhos(section);

    modal.style.display = "flex";
    overlay.style.display = "block";
  });
});

function fecharModal() {
  modal.style.display = "none";
  overlay.style.display = "none";

  molhosSelecionados = {};
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
  areaMolhos.innerHTML = "<h2>Molhos adicinais:</h2>";

  if (
    !molhosPorCategoria[categoria] ||
    molhosPorCategoria[categoria].length === 0
  ) {
    areaMolhos.style.display = "none";
    modalImg.style.height = "340px";
    return;
  }

  areaMolhos.style.display = "block";
  modalImg.style.height = "227px";

  molhosPorCategoria[categoria].forEach((molho) => {
    const bloco = document.createElement("div");
    bloco.classList.add("molho-adicionar");

    // Quantidade atual
    const qtdMolho = molhosSelecionados[molho.nome] || 0;

    bloco.innerHTML = `
      <p class="molhinho">
        <img src="${molho.img}" alt="${molho.nome}" />
        ${molho.nome}
                <span class="quantidade"></span>
      </p>
      <p class="preco preco-molho">R$ ${molho.preco
        .toFixed(2)
        .replace(".", ",")}</p>

    ${`
  ${
    isAdmin
      ? `<button class="btn-del-molho" data-id="${molho.id}"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg></button>`
      : ""
  }
      <button class="btn-add-molho"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="14"stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>
</button>
      <button class="btn-sub-molho" style="display:none"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="14" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
</svg>
</button>
`}


    `;

    areaMolhos.appendChild(bloco);
  });

  registrarEventosMolhos();
}

function registrarEventosMolhos() {
  document.querySelectorAll(".btn-add-molho").forEach((btn) => {
    btn.onclick = () => {
      const bloco = btn.parentElement;
      const nome = bloco.querySelector("p").innerText.split("x")[0].trim();
      const preco = parseFloat(
        bloco
          .querySelector(".preco-molho")
          .innerText.replace("R$", "")
          .replace(",", ".")
      );

      molhosSelecionados[nome] = (molhosSelecionados[nome] || 0) + 1;
      bloco.querySelector(
        ".quantidade"
      ).innerText = `x${molhosSelecionados[nome]}`;

      if (molhosSelecionados[nome] > 0) {
        bloco.querySelector(".btn-sub-molho").style.display = "block";
      } else {
        bloco.querySelector(".btn-sub-molho").style.display = "none";
      }

      totalProduto += preco;

      atualizarPrecoNoModal();
    };
  });

  document.querySelectorAll(".btn-sub-molho").forEach((btn) => {
    btn.onclick = () => {
      const bloco = btn.parentElement;
      const nome = bloco.querySelector("p").innerText.split("x")[0].trim();
      const preco = parseFloat(
        bloco
          .querySelector(".preco-molho")
          .innerText.replace("R$", "")
          .replace(",", ".")
      );

      molhosSelecionados[nome] = (molhosSelecionados[nome] || 0) - 1;

      if (molhosSelecionados[nome] >= 0) {
        totalProduto = Math.max(precoPastel, totalProduto - preco);

        if (molhosSelecionados[nome] === 0) {
          bloco.querySelector(".btn-sub-molho").style.display = "none";
        }
      }

      bloco.querySelector(
        ".quantidade"
      ).innerText = ` x${molhosSelecionados[nome]}`;

      atualizarPrecoNoModal();
    };
  });

  document.querySelectorAll(".btn-del-molho").forEach((btn) => {
    btn.onclick = async () => {
      if (!isAdmin) return;

      const idMolho = btn.dataset.id;

      if (!confirm("Excluir este molho?")) return;

      const { error } = await supabase
        .from("molhos")
        .delete()
        .eq("id", idMolho);

      if (error) {
        alert("Erro ao excluir molho!");
        return;
      }

      await carregarMolhos();
      gerarMolhos(categoriaAtualModal);
    };
  });
}

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

async function salvarPastel() {
  try {
    const bucket = "pastelaria"; // <- ajuste aqui se seu bucket tiver outro nome
    if (!window.supabase) {
      console.error("Supabase client não encontrado (window.supabase).");
      mostrarMensagem("msg-pastel", "Erro: supabase não inicializado.", "erro");
      return;
    }

    const categoria = document.getElementById("pastel-categoria").value;
    const imagemInput = document.getElementById("pastel-imagem");
    const nome = document.getElementById("pastel-nome").value.trim();
    const descricao = document.getElementById("pastel-descricao").value.trim();
    const preco = parseFloat(document.getElementById("pastel-preco").value);

    // Validações
    if (
      !categoria ||
      !imagemInput ||
      !imagemInput.files ||
      !imagemInput.files.length ||
      !nome ||
      !preco ||
      preco <= 0
    ) {
      mostrarMensagem(
        "msg-pastel",
        "Preencha todos os campos corretamente!",
        "erro"
      );
      return;
    }

    const file = imagemInput.files[0];
    if (!file) {
      mostrarMensagem("msg-pastel", "Selecione uma imagem válida!", "erro");
      return;
    }

    // gerar fileName sem caracteres estranhos
    const safeName = file.name.replace(/\s+/g, "_");
    const fileName = `${Date.now()}_${safeName}`;

    console.log("Iniciando upload:", { bucket, fileName, file });

    // Upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      console.error("Erro no upload:", uploadError);
      mostrarMensagem("msg-pastel", "Erro ao enviar imagem! (upload)", "erro");
      return;
    }

    console.log("Upload OK:", uploadData);

    // Obter URL pública (para bucket público)
    const getUrlRes = supabase.storage.from(bucket).getPublicUrl(fileName);
    // getPublicUrl pode retornar em formatos diferentes dependendo da versão
    const publicUrl =
      (getUrlRes &&
        (getUrlRes.publicUrl ||
          (getUrlRes.data && getUrlRes.data.publicUrl))) ||
      (getUrlRes && getUrlRes.data && getUrlRes.data.public_url) ||
      null;

    console.log(
      "getPublicUrl response:",
      getUrlRes,
      " -> publicUrl:",
      publicUrl
    );

    if (!publicUrl) {
      mostrarMensagem("msg-pastel", "Erro ao obter URL da imagem!", "erro");
      return;
    }

    // Inserir no banco com returning para receber o objeto inserido
    const { data, error } = await supabase.from("pasteis").insert(
      [
        {
          nome,
          descricao,
          preco,
          categoria,
          imagem_url: publicUrl,
        },
      ],
      { returning: "representation" }
    );

    if (error) {
      console.error("Erro ao inserir na tabela 'pasteis':", error);
      mostrarMensagem("msg-pastel", "Erro ao salvar pastel no banco!", "erro");
      return;
    }

    if (!data || !data[0]) {
      console.warn("Insert não retornou dados (data null ou vazio):", data);
      mostrarMensagem(
        "msg-pastel",
        "Pastel salvo, mas resposta inesperada do servidor.",
        "sucesso"
      );
      fecharModal2("modal-add-pastel");
      await carregarPasteis();
      return;
    }

    console.log("Insert OK:", data[0]);

    mostrarMensagem("msg-pastel", "Pastel salvo com sucesso!", "sucesso");

    // Atualizar DOM sem recarregar
    adicionarProdutoNoDOM(data[0]);

    // limpar formulário
    document.getElementById("pastel-nome").value = "";
    document.getElementById("pastel-descricao").value = "";
    document.getElementById("pastel-preco").value = "";
    document.getElementById("pastel-imagem").value = "";

    fecharModal2("modal-add-pastel");
  } catch (err) {
    console.error("Erro inesperado em salvarPastel:", err);
    mostrarMensagem("msg-pastel", "Erro inesperado. Veja console.", "erro");
  }
}

/* ===========================
    EDITAR PASTEL
  =========================== */

function adicionarProdutoNoDOM(pastel) {
  const categoria = pastel.categoria || "salgados"; // categoria padrão
  const container = document.querySelector(`#${categoria} .grid-produtos`);
  if (!container) return;
  const produtoHTML = `
    <div class="produto">
      <img src="${pastel.imagem_url}" alt="${pastel.nome}" />
      <div class="informacoes">
        <h3>${pastel.nome}</h3>
        <div class="informacao-display">
          <p><strong>Descrição:</strong></p>
          <p class="descricao">${pastel.descricao}</p>
        </div>
        <p class="preco">R$ ${pastel.preco.toFixed(2)}</p>
      </div>

      <button class="btn-add-pastel">Adicionar</button>

      <div class="actions-admin" style="display: none;">
        <button ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
</svg>
</button>
        <button ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
</button>
      </div>
    </div>
  `;
  const card = document.createElement("div");
  card.classList.add("produto-card");
  card.innerHTML = produtoHTML;

  container.appendChild(card);

  const novoProdutoBtn = card.querySelector(".btn-add-pastel");
  novoProdutoBtn.addEventListener("click", () => abrirModalProduto(card));

  if (isAdmin) {
    card.querySelector(".actions-admin").style.display = "flex";
  }

  const btnEditar = card.querySelector(".actions-admin button:first-child");
  const btnExcluir = card.querySelector(".actions-admin button:last-child");

  btnEditar.addEventListener("click", () => editarPastel(pastel.id));
  btnExcluir.addEventListener("click", () => excluirPastel(pastel.id));
}

async function editarPastel(id) {
  // Buscar os dados atuais
  const { data, error } = await supabase
    .from("pasteis")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    alert("Erro ao carregar pastel!");
    console.error(error);
    return;
  }

  // Preencher modal de edição
  document.getElementById("edit-id").value = data.id;
  document.getElementById("edit-nome").value = data.nome;
  document.getElementById("edit-descricao").value = data.descricao;
  document.getElementById("edit-preco").value = data.preco;
  document.getElementById("edit-categoria").value = data.categoria;
  document.getElementById("edit-imagem-preview").src = data.imagem_url;
  document.getElementById("modal-edit-pastel").style.display = "flex";
}

async function salvarEdicaoPastel() {
  if (!isAdmin) {
    alert("Apenas administradores podem editar pastéis!");
    return;
  }

  const id = document.getElementById("edit-id").value;
  const nome = document.getElementById("edit-nome").value.trim();
  const descricao = document.getElementById("edit-descricao").value.trim();
  const preco = parseFloat(document.getElementById("edit-preco").value);
  const categoria = document.getElementById("edit-categoria").value;

  if (!nome || !descricao || !preco || preco <= 0) {
    alert("Preencha todos os campos!");
    return;
  }

  const { error } = await supabase
    .from("pasteis")
    .update({ nome, descricao, preco, categoria })
    .eq("id", id);

  if (error) {
    alert("Erro ao atualizar pastel!");
    console.error(error);
    return;
  }

  alert("Pastel atualizado!");
  fecharModal2("modal-edit-pastel");

  // Atualiza a lista
  document
    .querySelectorAll(".grid-produtos")
    .forEach((c) => (c.innerHTML = ""));
  carregarPasteis();
}

/* ===========================
    EXCLUIR PASTEL
  =========================== */

async function excluirPastel(id) {
  if (!confirm("Tem certeza que deseja excluir este pastel?")) return;

  const { error } = await supabase.from("pasteis").delete().eq("id", id);

  if (error) {
    alert("Erro ao excluir pastel!");
    console.error(error);
    return;
  }

  alert("Pastel removido!");

  // Atualiza a lista
  document
    .querySelectorAll(".grid-produtos")
    .forEach((c) => (c.innerHTML = ""));
  carregarPasteis();
}

async function carregarPasteis() {
  const { data, error } = await supabase.from("pasteis").select("*");

  if (error) {
    console.error("Erro ao carregar pasteis:", error);
    return;
  }

  // Montar no DOM
  data.forEach((p) => adicionarProdutoNoDOM(p));
}

// Função para abrir o modal do produto recém-adicionado
function abrirModalProduto(produto) {
  const img = produto.querySelector("img").src;
  const nome = produto.querySelector("h3").innerText;
  const descricao = produto.querySelector(".descricao").innerText;
  const preco = produto.querySelector(".preco").innerText;

  modalImg.src = img;
  modalTitulo.innerText = nome;
  modalDescricao.innerText = descricao;
  modalPreco.innerText = preco;

  modalObservacoes.value = "";
  totalProduto = parseFloat(preco.replace("R$", "").replace(",", "."));
  precoPastel = totalProduto;
  atualizarPrecoNoModal();
  modal.style.display = "flex";
  overlay.style.display = "block";

  const categoria = produto.closest(".categoria").id;
  gerarMolhos(categoria);
}

/* ===========================
    SALVAR MOLHO
  =========================== */

async function salvarMolho() {
  if (!isAdmin) {
    return mostrarMensagem(
      "msg-molho",
      "Apenas admins podem adicionar molhos!",
      "erro"
    );
  }

  const categoria = document.getElementById("molho-categoria").value;
  const nome = document.getElementById("molho-nome").value.trim();
  const preco = parseFloat(document.getElementById("molho-preco").value);
  const imagemInput = document.getElementById("molho-imagem");

  if (!categoria || !nome || !preco || !imagemInput.files.length) {
    return mostrarMensagem(
      "msg-molho",
      "Preencha todos os campos e selecione uma imagem!",
      "erro"
    );
  }

  const file = imagemInput.files[0];
  const safeName = file.name.replace(/\s+/g, "_");
  const fileName = `${Date.now()}_${safeName}`;

  // Upload
  const { error: uploadError } = await supabase.storage
    .from("pastelaria")
    .upload(fileName, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    console.error(uploadError);
    return mostrarMensagem("msg-molho", "Erro ao enviar imagem!", "erro");
  }

  // URL Pública
  const { data: publicUrlData } = supabase.storage
    .from("pastelaria")
    .getPublicUrl(fileName);

  const publicUrl =
    publicUrlData?.publicUrl ||
    publicUrlData?.public_url ||
    publicUrlData?.publicURL;

  if (!publicUrl) {
    return mostrarMensagem("msg-molho", "Erro ao obter URL da imagem!", "erro");
  }

  // Inserir no banco
  const { data, error } = await supabase
    .from("molhos")
    .insert([
      {
        categoria,
        nome,
        preco,
        imagem_url: publicUrl,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    return mostrarMensagem("msg-molho", "Erro ao salvar molho!", "erro");
  }

  mostrarMensagem("msg-molho", "Molho salvo com sucesso!", "sucesso");
  fecharModal2("modal-add-molho");

  await carregarMolhos();
  gerarMolhos(categoria);
}

async function carregarMolhos() {
  try {
    const { data, error } = await supabase.from("molhos").select("*");
    if (error) {
      console.error("Erro ao carregar molhos:", error);
      return;
    }

    molhosPorCategoria = {};

    data.forEach((molho) => {
      const categoria = molho.categoria || "salgados";
      if (!molhosPorCategoria[categoria]) molhosPorCategoria[categoria] = [];
      molhosPorCategoria[categoria].push({
        id: molho.id, // ← importante
        nome: molho.nome,
        preco: parseFloat(molho.preco) || 0,
        img: molho.imagem_url,
      });
    });

    console.log("Molhos carregados:", molhosPorCategoria);
  } catch (err) {
    console.error("Erro inesperado em carregarMolhos:", err);
  }
}

/* ===========================
    SALVAR LOGO
  =========================== */
async function salvarLogo() {
  const imagemInput = document.getElementById("logo-imagem");
  const msg = "msg-logo";

  limparErro(imagemInput);

  if (!imagemInput.files.length) {
    marcarErro(imagemInput);
    return mostrarMensagem(msg, "Selecione uma imagem!", "erro");
  }

  const file = imagemInput.files[0];

  //--------------------------------------------------------------------
  // 1. Enviar para o Supabase (substituindo a logo antiga)
  //--------------------------------------------------------------------
  const { error: uploadError } = await supabase.storage
    .from("pastelaria")
    .upload("logo/logo.png", file, {
      cacheControl: "3600",
      upsert: true, // substitui a imagem antiga
      contentType: file.type,
    });

  if (uploadError) {
    console.error("Erro no upload da logo:", uploadError);

    if (uploadError.message.includes("permission")) {
      return mostrarMensagem(
        msg,
        "Apenas administradores podem alterar a logo.",
        "erro"
      );
    }

    return mostrarMensagem(msg, "Erro ao enviar a nova logo!", "erro");
  }

  //--------------------------------------------------------------------
  // 2. Obter URL pública corrigida (igual ao salvarPastel)
  //--------------------------------------------------------------------
  const getUrlRes = supabase.storage
    .from("pastelaria")
    .getPublicUrl("logo/logo.png");

  const publicUrl =
    (getUrlRes &&
      (getUrlRes.publicUrl || (getUrlRes.data && getUrlRes.data.publicUrl))) ||
    null;

  if (!publicUrl) {
    return mostrarMensagem(
      msg,
      "Logo enviada, mas falha ao obter URL pública.",
      "erro"
    );
  }

  //--------------------------------------------------------------------
  // 3. Atualizar a logo no site (forçando atualizar mesmo com cache)
  //--------------------------------------------------------------------
  const logoImg = document.querySelector(".logo");
  logoImg.src = `${publicUrl}?t=${Date.now()}`; // evita cache antigo

  //--------------------------------------------------------------------
  // 4. Mensagem de sucesso igual ao seu padrão
  //--------------------------------------------------------------------
  mostrarMensagem(msg, "Logo atualizada com sucesso!", "sucesso");

  setTimeout(() => {
    fecharModal2("modal-editar-logo");
  }, 1500);
}
const LOGO_PATH = "logo/logo.png";

async function carregarLogo() {
  const { data } = supabase.storage.from("pastelaria").getPublicUrl(LOGO_PATH);

  document.querySelector(".logo").src = data.publicUrl + "?t=" + Date.now();
}

/* ===========================
    INICIALIZAÇÃO
  =========================== */

const CODIGO_SECRETO = "#@la---paste--litos0010110";

// ----------------------
// MOSTRAR MODAL SECRETO
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
  const observacoes = document.getElementById("observacoes");
  if (observacoes) {
    observacoes.addEventListener("input", function () {
      if (this.value.includes(CODIGO_SECRETO)) {
        this.value = "";
        abrirModalSecreto();
      }
    });
  }

  updateCartCount();
  checarAdmin(); // Checa se já existe sessão de admin
});

// ----------------------
// ABRIR / FECHAR MODAL
// ----------------------
function abrirModalSecreto() {
  document.getElementById("modal-secreto").style.display = "flex";
}

function fecharModalSecreto() {
  document.getElementById("modal-secreto").style.display = "none";
}

// ----------------------
// CHECAR ADMIN
// ----------------------
async function checarAdmin() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    isAdmin = false;
    document
      .querySelectorAll(".btn-admin")
      .forEach((btn) => (btn.style.display = "none"));
    document.getElementById("menu").style.display = "none";
    return false;
  }

  const { data: adminData } = await supabase
    .from("admins")
    .select("*")
    .eq("email", session.user.email)
    .maybeSingle();

  isAdmin = !!adminData; // ← agora salva globalmente

  document.querySelectorAll(".btn-admin").forEach((btn) => {
    btn.style.display = isAdmin ? "block" : "none";
  });
  document.getElementById("menu").style.display = isAdmin ? "block" : "none";

  return isAdmin;
}

// ----------------------
// VALIDAR ACESSO DO ADMIN
// ----------------------
async function validarAcesso() {
  const email = document.getElementById("secret-email").value.trim();
  const senha = document.getElementById("secret-senha").value.trim();
  const erroEl = document.getElementById("secret-erro");
  erroEl.style.display = "none";

  if (!email || !senha) {
    erroEl.innerText = "Preencha email e senha!";
    erroEl.style.display = "block";
    return;
  }

  try {
    // Autenticação no Supabase
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

    if (loginError || !loginData.session) {
      erroEl.innerText = "Email ou senha incorretos!";
      erroEl.style.display = "block";
      return;
    }

    // Verifica se o email é admin
    const { data: adminData } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (!adminData) {
      erroEl.innerText = "Você não tem permissão para acessar!";
      erroEl.style.display = "block";
      await supabase.auth.signOut();
      return;
    }

    // Usuário é admin → liberar painel
    fecharModalSecreto();
    await checarAdmin();
    alert("Acesso de administrador liberado!");
  } catch (err) {
    console.error("Erro ao validar acesso:", err);
    erroEl.innerText = "Ocorreu um erro. Tente novamente.";
    erroEl.style.display = "block";
  }
}

// ----------------------
// LOGOUT ADMIN
// ----------------------
async function logoutAdmin() {
  await supabase.auth.signOut();
  document
    .querySelectorAll(".btn-admin")
    .forEach((btn) => (btn.style.display = "none"));
  document.getElementById("menu").style.display = "none";
  alert("Você saiu do modo administrador.");
}

// Ao carregar a página
document.addEventListener("DOMContentLoaded", async () => {
  updateCartCount(); // contador do carrinho
  await checarAdmin(); // checa se já existe admin logado
  await carregarPasteis(); // carrega todos os pasteis do banco
  await carregarMolhos();
  await carregarLogo();
});
