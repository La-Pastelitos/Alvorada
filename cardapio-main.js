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
