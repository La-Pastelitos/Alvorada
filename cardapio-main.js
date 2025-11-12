function mostrarCategoria(id) {
  document.querySelectorAll(".categoria").forEach((sec) => {
    sec.classList.remove("ativa");
  });
  document.getElementById(id).classList.add("ativa");
}
