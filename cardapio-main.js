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
let isAdmin = false;

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
    { nome: "Calda de Choc.", preco: 3, img: "./images/nuttela.jpeg" },
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
    modalImg.style.height = "340px";

    return;
  }

  // Caso tenha molhos → mostrar
  areaMolhos.style.display = "block";
  modalImg.style.height = "227px";

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
        <button ">Editar</button>
        <button ">Excluir</button>
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
});
