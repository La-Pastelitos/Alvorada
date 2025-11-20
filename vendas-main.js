function formatBRL(v) {
  return v.toFixed(2).replace(".", ",");
}

// Arrays para controle local
let vendas = [];
let gastos = [];

// 🔹 Carregar vendas e gastos do Supabase
async function carregarVendasEGastos() {
  const tabela = document.querySelector("#tabela-vendas tbody");
  tabela.innerHTML = `<tr><td colspan="3">Carregando...</td></tr>`;

  try {
    // Vendas
    const { data: vendasData, error: errorVendas } = await supabase
      .from("vendas")
      .select("*")
      .order("id", { ascending: false });
    if (errorVendas) throw errorVendas;
    vendas = vendasData || [];

    // Gastos
    const { data: gastosData, error: errorGastos } = await supabase
      .from("gastos")
      .select("*")
      .order("id", { ascending: false });
    if (errorGastos) throw errorGastos;
    gastos = gastosData || [];

    atualizarTabela();
  } catch (err) {
    console.error(err);
    tabela.innerHTML = `<tr><td colspan="3">Erro ao carregar vendas/gastos.</td></tr>`;
  }
}

document.getElementById("btn-adicionar-gasto").addEventListener("click", () => {
  document.getElementById("modal-gasto").style.display = "flex";
});

// 🔹 Atualizar tabela + totais
function atualizarTabela() {
  const tabela = document.querySelector("#tabela-vendas tbody");
  tabela.innerHTML = "";

  const totalBruto = vendas.reduce((acc, v) => acc + Number(v.total), 0);
  const totalGastos = gastos.reduce((acc, g) => acc + Number(g.valor), 0);
  const totalLiquido = totalBruto - totalGastos;

  document.getElementById("total-bruto").innerText = formatBRL(totalBruto);
  document.getElementById("total-gastos").innerText = formatBRL(totalGastos);
  document.getElementById("total-liquido").innerText = formatBRL(totalLiquido);

  // Vendas
  vendas.forEach((venda) => {
    tabela.innerHTML += `
      <tr>
        <td>${venda.nome}</td>
        <td>R$ ${formatBRL(Number(venda.total))}</td>
        <td>
          <button type="button" class="excluir" onclick="confirmarExcluirVenda('${
            venda.id
          }')" ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg></button>
        </td>
      </tr>
    `;
  });

  // Gastos
  gastos.forEach((gasto) => {
    tabela.innerHTML += `
      <tr>
        <td>${gasto.nome}</td>
        <td>R$ -${formatBRL(Number(gasto.valor))}</td>
        <td>
          <button  type="button" class="excluir" onclick="confirmarExcluirGasto(${
            gasto.id
          })" ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg></button>
        </td>
      </tr>
    `;
  });
}

function confirmarExcluirVenda(id) {
  if (!confirm("Deseja realmente excluir esta venda?")) return;
  excluirVendaBanco(id);
}
function confirmarExcluirGasto(id) {
  if (!confirm("Deseja realmente excluir esta venda?")) return;
  excluirGastoBanco(id);
}

async function excluirVendaBanco(id) {
  try {
    const { data, error } = await supabase.from("vendas").delete().eq("id", id); // id deve ser string se for UUID

    if (error) throw error;

    if (!data || data.length === 0) {
      console.warn(
        "Nenhuma venda foi removida. Verifique se o ID existe no banco:",
        id
      );
    }

    // Remove do array local
    vendas = vendas.filter((v) => v.id !== id);
    atualizarTabela();
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir venda do banco.");
  }
}

// 🔹 Excluir gasto do Supabase (opcional melhorar também)
async function excluirGastoBanco(id) {
  try {
    const { error } = await supabase.from("gastos").delete().eq("id", id);
    if (error) throw error;

    gastos = gastos.filter((g) => g.id !== id);
    atualizarTabela();
  } catch (err) {
    console.error(err);
    alert("Erro ao excluir gasto.");
  }
}

// 🔹 Excluir gasto do Supabase
async function excluirGastoBanco(id) {
  await supabase.from("gastos").delete().eq("id", id);
  carregarVendasEGastos();
}

// 🔹 Modal gasto
document.getElementById("btn-adicionar-gasto").addEventListener("click", () => {
  document.getElementById("modal-gasto").style.display = "flex";
});

function fecharModalGasto() {
  document.getElementById("modal-gasto").style.display = "none";
}

// 🔹 Salvar gasto no Supabase
async function salvarGasto(nome, valor) {
  try {
    const { data, error } = await supabase
      .from("gastos")
      .insert([{ nome, valor }])
      .select();
    if (error) throw error;

    gastos.unshift(data[0]); // adiciona localmente
    atualizarTabela();
    fecharModalGasto();
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar gasto.");
  }
}

// 🔹 Botão salvar gasto do modal
document.getElementById("btn-salvar-gasto").addEventListener("click", () => {
  const nome = document.getElementById("gasto-nome").value.trim();
  const valor = parseFloat(document.getElementById("gasto-valor").value);

  if (!nome || isNaN(valor) || valor <= 0)
    return alert("Informe nome e valor válidos.");
  salvarGasto(nome, valor);
});

// 🔹 Inicializar
document.addEventListener("DOMContentLoaded", carregarVendasEGastos);
